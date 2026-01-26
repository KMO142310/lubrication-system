import { dbLocal, SyncQueueItem } from './db/offline';
import { supabase } from './supabase';

const MAX_RETRIES = 3;

/**
 * Procesa la cola de sincronización (Outbox Pattern)
 * Sube cambios locales a Supabase uno por uno.
 */
export async function processSyncQueue() {
    if (!navigator.onLine) return; // No intentar si estamos offline

    const pendingItems = await dbLocal.syncQueue.toArray();
    if (pendingItems.length === 0) return;

    console.log(`🔄 Sync Engine: Procesando ${pendingItems.length} cambios pendientes...`);

    for (const item of pendingItems) {
        try {
            await processItem(item);
            // Si éxito, borrar de la cola
            await dbLocal.syncQueue.delete(item.id!);
        } catch (error) {
            console.error(`❌ Sync Error (ID: ${item.id}):`, error);
            // Incrementar retry count o mover a "Dead Letter Queue" si falla mucho
            if (item.retry_count >= MAX_RETRIES) {
                // Opcional: Marcar como fallido permanente para revisión manual
                console.warn('⚠️ Item excedió reintentos máximos');
            } else {
                await dbLocal.syncQueue.update(item.id!, { retry_count: item.retry_count + 1 });
            }
        }
    }
}

async function processItem(item: SyncQueueItem) {
    if (item.resource === 'tasks' && item.action === 'update') {
        // Ejemplo: Actualizar tarea completada
        const { error } = await supabase
            .from('tasks')
            .update({
                status: item.payload.status,
                quantity_used: item.payload.quantity_used,
                completed_at: new Date().toISOString()
            })
            .eq('id', item.payload.id);

        if (error) throw error;
    }
    // Agregar más casos según necesidad (create anomaly, etc)
}

// Hook para iniciar sync cuando vuelve internet
if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        console.log('🌐 Conexión restaurada. Iniciando sincronización...');
        processSyncQueue();
    });
}
