'use client';

// ============================================================
// DATA SERVICE CON SINCRONIZACIÓN SUPABASE
// Mantiene localStorage como cache, sincroniza con Supabase
// ============================================================

import { supabase } from './supabase';
import type { WorkOrder, Task, Anomaly } from './types';
import { dataService } from './data';

// ============================================================
// ESTADO DE SINCRONIZACIÓN
// ============================================================

let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
let lastSync: Date | null = null;
let syncListeners: ((status: SyncStatus) => void)[] = [];

export interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  isSyncing: boolean;
}

let isSyncing = false;

function notifyListeners() {
  const status: SyncStatus = { isOnline, lastSync, isSyncing };
  syncListeners.forEach(cb => cb(status));
}

export function onSyncStatusChange(callback: (status: SyncStatus) => void): () => void {
  syncListeners.push(callback);
  return () => {
    syncListeners = syncListeners.filter(cb => cb !== callback);
  };
}

export function getSyncStatus(): SyncStatus {
  return { isOnline, lastSync, isSyncing };
}

// ============================================================
// INICIALIZACIÓN DE LISTENERS
// ============================================================

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isOnline = true;
    notifyListeners();
    syncPendingChanges();
  });
  
  window.addEventListener('offline', () => {
    isOnline = false;
    notifyListeners();
  });
}

// ============================================================
// COLA DE CAMBIOS PENDIENTES
// ============================================================

const PENDING_KEY = 'aisa_pending_sync';

interface PendingChange {
  id: string;
  type: 'task' | 'workOrder' | 'anomaly';
  action: 'update' | 'create';
  entityId: string;
  data: Record<string, unknown>;
  timestamp: string;
}

function getPendingChanges(): PendingChange[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(PENDING_KEY);
  return stored ? JSON.parse(stored) : [];
}

function savePendingChange(change: Omit<PendingChange, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  const pending = getPendingChanges();
  pending.push({
    ...change,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
}

function clearPendingChanges(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PENDING_KEY);
}

// ============================================================
// SINCRONIZACIÓN CON SUPABASE
// ============================================================

async function syncPendingChanges(): Promise<number> {
  if (!isOnline || isSyncing) return 0;
  
  isSyncing = true;
  notifyListeners();
  
  const pending = getPendingChanges();
  let synced = 0;
  const failed: PendingChange[] = [];

  for (const change of pending) {
    try {
      let success = false;
      
      if (change.type === 'task') {
        // Insertar o actualizar tarea en Supabase
        const taskData = {
          id: change.entityId,
          work_order_id: change.data.workOrderId || null,
          lubrication_point_id: change.data.lubricationPointId || change.entityId.split('-').pop() || 'unknown',
          status: change.data.status as string,
          quantity_used: change.data.quantityUsed as number || null,
          observations: change.data.observations as string || null,
          photo_url: change.data.photoUrl as string || null,
          completed_at: change.data.completedAt as string || null,
          updated_at: new Date().toISOString(),
        };
        
        const { error } = await supabase
          .from('tasks')
          .upsert(taskData, { onConflict: 'id' });
        
        success = !error;
        if (error) console.error('Task sync error:', error);
      } else if (change.type === 'workOrder') {
        const { error } = await supabase
          .from('work_orders')
          .upsert({
            id: change.entityId,
            status: change.data.status,
            completed_at: change.data.completedAt,
            signature_url: change.data.signatureUrl,
            updated_at: new Date().toISOString(),
          });
        success = !error;
      } else if (change.type === 'anomaly') {
        const { error } = await supabase
          .from('anomalies')
          .insert({
            lubrication_point_id: change.data.lubricationPointId,
            machine_id: change.data.machineId,
            description: change.data.description,
            severity: change.data.severity,
            status: change.data.status || 'abierta',
            photo_url: change.data.photoUrl,
            reported_by: change.data.reportedBy,
          });
        success = !error;
      }
      
      if (success) {
        synced++;
      } else {
        failed.push(change);
      }
    } catch (error) {
      console.error('Sync error:', error);
      failed.push(change);
    }
  }

  // Guardar solo los que fallaron
  if (failed.length > 0) {
    localStorage.setItem(PENDING_KEY, JSON.stringify(failed));
  } else {
    clearPendingChanges();
  }

  lastSync = new Date();
  isSyncing = false;
  notifyListeners();

  return synced;
}

// ============================================================
// CARGAR DATOS DESDE SUPABASE
// ============================================================

async function fetchTasksFromSupabase(): Promise<void> {
  if (!isOnline) return;

  try {
    // Obtener tareas de hoy desde Supabase
    const today = new Date().toISOString().split('T')[0];
    
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !tasks) {
      console.log('No tasks in Supabase yet');
      return;
    }

    // Actualizar localStorage con datos de Supabase
    const localTasks = dataService.getTasks();
    
    tasks.forEach(remoteTask => {
      const localTask = localTasks.find(t => t.id === remoteTask.id);
      
      // Si la tarea remota está más actualizada, actualizar local
      if (remoteTask.status === 'completado' && (!localTask || localTask.status !== 'completado')) {
        dataService.updateTask(remoteTask.id, {
          status: remoteTask.status,
          quantityUsed: remoteTask.quantity_used,
          observations: remoteTask.observations,
          photoUrl: remoteTask.photo_url,
          completedAt: remoteTask.completed_at,
        });
      }
    });

    lastSync = new Date();
    notifyListeners();
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
  }
}

// ============================================================
// SERVICIO DE DATOS SINCRONIZADO
// ============================================================

export const syncDataService = {
  // Inicializar datos locales + cargar desde Supabase
  init: async () => {
    dataService.init();
    if (isOnline) {
      // Primero enviar cambios pendientes
      await syncPendingChanges();
      // Luego cargar datos remotos
      await fetchTasksFromSupabase();
    }
  },

  // Forzar recarga desde Supabase
  refreshFromServer: async () => {
    if (isOnline) {
      await fetchTasksFromSupabase();
    }
  },

  // ============================================================
  // WORK ORDERS
  // ============================================================
  
  getWorkOrders: (): WorkOrder[] => {
    return dataService.getWorkOrders();
  },

  getTodayWorkOrder: (): WorkOrder | undefined => {
    return dataService.getTodayWorkOrder();
  },

  updateWorkOrder: async (id: string, data: Partial<WorkOrder> & { signatureUrl?: string }): Promise<void> => {
    // Actualizar local primero
    dataService.updateWorkOrder(id, data);
    
    // Agregar a cola de sync
    savePendingChange({
      type: 'workOrder',
      action: 'update',
      entityId: id,
      data: data as Record<string, unknown>,
    });
    
    // Intentar sync si online
    if (isOnline) {
      await syncPendingChanges();
    }
  },

  // ============================================================
  // TASKS
  // ============================================================

  getTasks: (workOrderId?: string): Task[] => {
    return dataService.getTasks(workOrderId);
  },

  updateTask: async (id: string, data: Partial<Task>): Promise<void> => {
    // Actualizar local primero
    dataService.updateTask(id, data);
    
    // Agregar a cola de sync
    savePendingChange({
      type: 'task',
      action: 'update',
      entityId: id,
      data: data as Record<string, unknown>,
    });
    
    // Intentar sync si online
    if (isOnline) {
      await syncPendingChanges();
    }
  },

  // ============================================================
  // ANOMALIES
  // ============================================================

  getAnomalies: (): Anomaly[] => {
    return dataService.getAnomalies();
  },

  addAnomaly: async (data: Omit<Anomaly, 'id' | 'createdAt'>): Promise<Anomaly> => {
    // Crear local primero
    const anomaly = dataService.addAnomaly(data);
    
    // Agregar a cola de sync
    savePendingChange({
      type: 'anomaly',
      action: 'create',
      entityId: anomaly.id,
      data: data as unknown as Record<string, unknown>,
    });
    
    // Intentar sync si online
    if (isOnline) {
      await syncPendingChanges();
    }
    
    return anomaly;
  },

  updateAnomaly: async (id: string, data: Partial<Anomaly>): Promise<void> => {
    dataService.updateAnomaly(id, data);
    
    savePendingChange({
      type: 'anomaly',
      action: 'update',
      entityId: id,
      data: data as Record<string, unknown>,
    });
    
    if (isOnline) {
      await syncPendingChanges();
    }
  },

  // ============================================================
  // DELEGADOS A dataService (datos estáticos)
  // ============================================================

  getPlants: dataService.getPlants,
  getAreas: dataService.getAreas,
  getMachines: dataService.getMachines,
  getComponents: dataService.getComponents,
  getLubricants: dataService.getLubricants,
  getFrequencies: dataService.getFrequencies,
  getLubricationPoints: dataService.getLubricationPoints,
  getUsers: dataService.getUsers,
  getCounts: dataService.getCounts,
  addPlant: dataService.addPlant,
  addArea: dataService.addArea,
  addMachine: dataService.addMachine,
  addComponent: dataService.addComponent,
  addLubricant: dataService.addLubricant,
  addLubricationPoint: dataService.addLubricationPoint,

  // ============================================================
  // SYNC UTILITIES
  // ============================================================

  getSyncStatus,
  onSyncStatusChange,
  syncNow: syncPendingChanges,
  getPendingCount: () => getPendingChanges().length,
};

// ============================================================
// PHOTO UPLOAD TO SUPABASE STORAGE
// ============================================================

export async function uploadPhotoToStorage(
  dataUrl: string,
  taskId: string,
  photoType: 'before' | 'after'
): Promise<string | null> {
  if (!isOnline) {
    // Si offline, retornar el dataUrl original (se subirá después)
    return dataUrl;
  }

  try {
    // Convertir dataUrl a Blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    
    // Comprimir si es muy grande (max 500KB)
    let finalBlob = blob;
    if (blob.size > 500000) {
      const canvas = document.createElement('canvas');
      const img = new Image();
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = dataUrl;
      });
      
      // Reducir tamaño manteniendo proporción
      const maxWidth = 1200;
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
      const compressedResponse = await fetch(compressedDataUrl);
      finalBlob = await compressedResponse.blob();
    }

    // Generar nombre único
    const timestamp = Date.now();
    const fileName = `tasks/${taskId}/${photoType}_${timestamp}.jpg`;

    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from('photos')
      .upload(fileName, finalBlob, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading photo:', error);
      return dataUrl; // Fallback a dataUrl si falla
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('photos')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Photo upload error:', error);
    return dataUrl; // Fallback a dataUrl
  }
}

// ============================================================
// REALTIME SUBSCRIPTIONS
// ============================================================

let tasksChannel: ReturnType<typeof supabase.channel> | null = null;

export function subscribeToTaskUpdates(
  callback: (task: { id: string; status: string; completedAt?: string }) => void
): () => void {
  if (typeof window === 'undefined') return () => {};
  
  tasksChannel = supabase
    .channel('tasks_realtime')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'tasks' },
      (payload) => {
        const task = payload.new as { id: string; status: string; completed_at?: string };
        callback({
          id: task.id,
          status: task.status,
          completedAt: task.completed_at,
        });
      }
    )
    .subscribe();

  return () => {
    if (tasksChannel) {
      supabase.removeChannel(tasksChannel);
      tasksChannel = null;
    }
  };
}

let workOrdersChannel: ReturnType<typeof supabase.channel> | null = null;

export function subscribeToWorkOrderUpdates(
  callback: (wo: { id: string; status: string; completedAt?: string }) => void
): () => void {
  if (typeof window === 'undefined') return () => {};
  
  workOrdersChannel = supabase
    .channel('work_orders_realtime')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'work_orders' },
      (payload) => {
        const wo = payload.new as { id: string; status: string; completed_at?: string };
        callback({
          id: wo.id,
          status: wo.status,
          completedAt: wo.completed_at,
        });
      }
    )
    .subscribe();

  return () => {
    if (workOrdersChannel) {
      supabase.removeChannel(workOrdersChannel);
      workOrdersChannel = null;
    }
  };
}
