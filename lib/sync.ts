'use client';

// ============================================================
// SINCRONIZACIÓN DIRECTA CON SUPABASE
// Solución simple y funcional
// ============================================================

import { supabase } from './supabase';

// ============================================================
// GUARDAR TAREA COMPLETADA EN SUPABASE
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
}): Promise<{ success: boolean; error?: string }> {
  
  try {
    console.log('📤 Enviando tarea a Supabase:', task.id);
    
    const { error } = await supabase
      .from('tasks')
      .upsert({
        id: task.id,
        work_order_id: task.workOrderId,
        lubrication_point_id: task.lubricationPointId,
        status: task.status,
        quantity_used: task.quantityUsed || 0,
        observations: task.observations || '',
        photo_url: task.photoUrl || '',
        completed_at: task.completedAt || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      });

    if (error) {
      console.error('❌ Error Supabase:', error.message);
      return { success: false, error: error.message };
    }

    console.log('✅ Tarea sincronizada:', task.id);
    return { success: true };
    
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : 'Error desconocido';
    console.error('❌ Error de red:', errorMsg);
    return { success: false, error: errorMsg };
  }
}

// ============================================================
// OBTENER TAREAS COMPLETADAS DESDE SUPABASE
// ============================================================

export async function getCompletedTasksFromServer(): Promise<{
  id: string;
  status: string;
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
// VERIFICAR CONEXIÓN
// ============================================================

export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}
