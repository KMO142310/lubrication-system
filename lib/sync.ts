'use client';

// ============================================================
// SINCRONIZACIÓN ROBUSTA CON SUPABASE
// NIVEL ÉLITE - Anti-pérdida de datos
// ============================================================

import { supabase } from './supabase';

// ============================================================
// SYNC STATUS MANAGEMENT
// ============================================================

export interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  isSyncing: boolean;
}

const currentSyncStatus: SyncStatus = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  lastSync: null,
  isSyncing: false,
};

const syncStatusListeners: ((status: SyncStatus) => void)[] = [];

export function getSyncStatus(): SyncStatus {
  return currentSyncStatus;
}

export function onSyncStatusChange(listener: (status: SyncStatus) => void): () => void {
  syncStatusListeners.push(listener);
  return () => {
    const index = syncStatusListeners.indexOf(listener);
    if (index > -1) syncStatusListeners.splice(index, 1);
  };
}

function notifyListeners() {
  syncStatusListeners.forEach(listener => listener(currentSyncStatus));
}

export const syncDataService = {
  getPendingCount(): number {
    return getPendingQueue().length;
  },
  async syncNow(): Promise<void> {
    currentSyncStatus.isSyncing = true;
    notifyListeners();
    await syncPendingQueue();
    currentSyncStatus.isSyncing = false;
    currentSyncStatus.lastSync = new Date();
    notifyListeners();
  },
};

// Cola de tareas pendientes (para modo offline)
const PENDING_QUEUE_KEY = 'aisa_pending_tasks_queue';

interface PendingTask {
  id: string;
  work_order_id: string;
  lubrication_point_id: string;
  status: string;
  quantity_used: number;
  observations: string;
  photo_url: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
  queuedAt?: string;
}

function getPendingQueue(): PendingTask[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(PENDING_QUEUE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function savePendingQueue(queue: PendingTask[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PENDING_QUEUE_KEY, JSON.stringify(queue));
}

// ============================================================
// GUARDAR TAREA - CON REINTENTOS Y COLA OFFLINE
// ============================================================

export async function saveCompletedTask(task: {
  id: string;
  workOrderId: string;
  lubricationPointId: string;
  status: string;
  quantityUsed?: number;
  observations?: string;
  photoUrl?: string;
  completedAt?: string;
}): Promise<{ success: boolean; error?: string; queued?: boolean }> {

  const taskData = {
    id: task.id,
    work_order_id: task.workOrderId,
    lubrication_point_id: task.lubricationPointId,
    status: task.status,
    quantity_used: task.quantityUsed || 0,
    observations: task.observations || '',
    photo_url: task.photoUrl?.substring(0, 100) || '', // Solo referencia corta
    completed_at: task.completedAt || new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Intentar guardar con 3 reintentos
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`📤 Intento ${attempt}/3 - Guardando tarea:`, task.id);

      const { error } = await supabase
        .from('tasks')
        .upsert(taskData, {
          onConflict: 'id',
          ignoreDuplicates: false
        });

      if (!error) {
        console.log('✅ GUARDADO EXITOSO en Supabase:', task.id);
        // Limpiar de cola pendiente si estaba
        const queue = getPendingQueue().filter(t => t.id !== task.id);
        savePendingQueue(queue);
        return { success: true };
      }

      console.error(`❌ Intento ${attempt} falló:`, error.message);

      if (attempt < 3) {
        await new Promise(r => setTimeout(r, 1000 * attempt)); // Esperar antes de reintentar
      }
    } catch (e) {
      console.error(`❌ Error de red intento ${attempt}:`, e);
      if (attempt < 3) {
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }
  }

  // Si falló después de 3 intentos, guardar en cola offline
  console.log('⚠️ Guardando en cola offline:', task.id);
  const queue = getPendingQueue();
  if (!queue.find(t => t.id === task.id)) {
    queue.push({ ...taskData, queuedAt: new Date().toISOString() });
    savePendingQueue(queue);
  }

  return { success: false, error: 'Guardado en cola offline', queued: true };
}

// ============================================================
// SINCRONIZAR COLA PENDIENTE
// ============================================================

export async function syncPendingQueue(): Promise<{ synced: number; failed: number }> {
  const queue = getPendingQueue();
  if (queue.length === 0) return { synced: 0, failed: 0 };

  console.log(`🔄 Sincronizando ${queue.length} tareas pendientes...`);

  let synced = 0;
  let failed = 0;
  const newQueue: PendingTask[] = [];

  for (const task of queue) {
    try {
      const { error } = await supabase
        .from('tasks')
        .upsert(task, { onConflict: 'id', ignoreDuplicates: false });

      if (!error) {
        synced++;
        console.log('✅ Sincronizado:', task.id);
      } else {
        failed++;
        newQueue.push(task);
      }
    } catch {
      failed++;
      newQueue.push(task);
    }
  }

  savePendingQueue(newQueue);
  console.log(`📊 Sync completo: ${synced} OK, ${failed} pendientes`);
  return { synced, failed };
}

// ============================================================
// OBTENER TAREAS COMPLETADAS DESDE SUPABASE
// ============================================================

export async function getCompletedTasksFromServer(): Promise<{
  id: string;
  status: string;
  lubricationPointId?: string;
  workOrderId?: string;
  quantityUsed?: number;
  observations?: string;
  photoUrl?: string;
  completedAt?: string;
}[]> {

  try {
    console.log('📥 Cargando tareas desde Supabase...');

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'completado');

    if (error) {
      console.error('❌ Error cargando tareas:', error.message);
      return [];
    }

    console.log(`✅ ${data?.length || 0} tareas cargadas`);

    return (data || []).map(t => ({
      id: t.id,
      status: t.status,
      lubricationPointId: t.lubrication_point_id,
      workOrderId: t.work_order_id,
      quantityUsed: t.quantity_used,
      observations: t.observations,
      photoUrl: t.photo_url,
      completedAt: t.completed_at,
    }));

  } catch (e) {
    console.error('❌ Error de red:', e);
    return [];
  }
}

// ============================================================
// SUBIR FOTO A SUPABASE STORAGE
// ============================================================

export async function uploadPhoto(
  dataUrl: string,
  taskId: string
): Promise<string> {

  try {
    // Convertir base64 a blob
    const base64Data = dataUrl.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    // Nombre único
    const fileName = `${taskId}_${Date.now()}.jpg`;
    const filePath = `tasks/${fileName}`;

    console.log('📤 Subiendo foto:', fileName);

    const { data, error } = await supabase.storage
      .from('photos')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.error('❌ Error subiendo foto:', error.message);
      return dataUrl; // Retornar original si falla
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('photos')
      .getPublicUrl(data.path);

    console.log('✅ Foto subida:', urlData.publicUrl);
    return urlData.publicUrl;

  } catch (e) {
    console.error('❌ Error:', e);
    return dataUrl;
  }
}

// ============================================================
// DESCARGAR FOTO A GALERÍA DEL DISPOSITIVO
// ============================================================

export function downloadPhotoToGallery(dataUrl: string, fileName: string): void {
  try {
    // Crear link de descarga
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;

    // Forzar descarga
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('✅ Foto guardada:', fileName);
  } catch (e) {
    console.error('❌ Error guardando foto:', e);
  }
}

// ============================================================
// SUBIR FOTO A STORAGE (stub - por ahora retorna dataUrl)
// ============================================================

export async function uploadPhotoToStorage(
  dataUrl: string,
  _taskId: string,
  _photoType: string
): Promise<string | null> {
  // Por ahora, simplemente retornar la dataUrl
  // En producción, esto subiría a Supabase Storage
  console.log('📷 Foto procesada localmente');
  return dataUrl;
}

// ============================================================
// VERIFICAR CONEXIÓN
// ============================================================

export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}
