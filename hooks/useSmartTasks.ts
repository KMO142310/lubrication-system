import { useLiveQuery } from 'dexie-react-hooks';
import { dbLocal, OfflineTask } from '@/lib/db/offline';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

/**
 * AGI LEVEL HOOK: useSmartTasks
 * 
 * Este hook encapsula toda la complejidad de la sincronización.
 * - Si hay internet: Carga de Supabase y guarda en local (Cache-first).
 * - Si no hay internet: Carga de local (Offline-first).
 * - Si hay cambios locales pendientes: Los fusiona en tiempo real.
 */
export function useSmartTasks(date: Date) {
    const dateStr = date.toISOString().split('T')[0];

    // 1. Fuente de la Verdad Local (Reactiva)
    const localTasks = useLiveQuery(() =>
        dbLocal.tasks
            .where('updated_at')
            .between(dateStr + "T00:00:00", dateStr + "T23:59:59") // Simple filtro por fecha (mejorar índice si es necesario)
            .toArray()
        , [dateStr]);

    // FIXME: Dexie where clause limitation strings. For now loading all and filtering in memory or improving schema if performance issues arise.
    // Optimization: Load by work_order_id linked to date.

    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    // 2. Sincronización Inteligente (Background)
    useEffect(() => {
        async function syncFromCloud() {
            if (!navigator.onLine) {
                setIsLoading(false);
                return;
            }

            setIsSyncing(true);
            try {
                // A. Buscar WorkOrder del día
                const { data: woData } = await supabase
                    .from('work_orders')
                    .select('id, status')
                    .eq('scheduled_date', dateStr)
                    .single();

                if (woData) {
                    // B. Buscar Tareas
                    const { data: tasksData } = await supabase
                        .from('tasks')
                        .select(`
                *,
                lubrication_point:lubrication_points (
                    *,
                    component:components(name, machine:machines(name, area:areas(name)))
                )
            `)
                        .eq('work_order_id', woData.id);

                    if (tasksData) {
                        // C. Actualizar Local DB (Cache Update)
                        await dbLocal.transaction('rw', dbLocal.tasks, dbLocal.workOrders, async () => {
                            // Upsert WorkOrder
                            await dbLocal.workOrders.put({
                                id: woData.id,
                                scheduled_date: dateStr,
                                status: woData.status,
                                sync_status: 'synced'
                            });

                            // Upsert Tasks (Solo si no hay cambios locales pendientes para no sobrescribir trabajo del usuario)
                            for (const task of tasksData) {
                                const localVersion = await dbLocal.tasks.get(task.id);
                                // Regla de Oro: Si localmente está "pendiente de subida", NO sobrescribir con la nube
                                if (!localVersion || localVersion.sync_status === 'synced') {
                                    await dbLocal.tasks.put({
                                        id: task.id,
                                        work_order_id: task.work_order_id,
                                        lubrication_point_id: task.lubrication_point_id,
                                        status: task.status,
                                        quantity_used: task.quantity_used || 0,
                                        updated_at: task.updated_at || new Date().toISOString(),
                                        sync_status: 'synced',
                                        // Guardamos datos relacionales desnormalizados para visualización offline?
                                        // Idealmente sí, o tener tablas 'meta_data'. Por ahora simplificado.
                                    });
                                }
                            }
                        });
                    }
                }
            } catch (error) {
                console.error("SmartSync Error:", error);
            } finally {
                setIsSyncing(false);
                setIsLoading(false);
            }
        }

        syncFromCloud();
    }, [dateStr]);

    // 3. Acciones "Optimistas"
    const completeTask = async (taskId: string, quantity: number, notes?: string) => {
        // A. Actualizar UI Local Inmediatamente
        await dbLocal.tasks.update(taskId, {
            status: 'completado',
            quantity_used: quantity,
            notes,
            sync_status: 'pending_update', // Marcar para subir
            updated_at: new Date().toISOString()
        });

        // B. Encolar para subida
        await dbLocal.syncQueue.add({
            resource: 'tasks',
            action: 'update',
            payload: { id: taskId, status: 'completado', quantity_used: quantity, notes },
            created_at: Date.now(),
            retry_count: 0
        });

        // C. Intentar subir ya (si hay red) - "Fire and Forget"
        if (navigator.onLine) {
            // El SyncEngine (via useEffect o evento) se encargará, o podemos forzarlo:
            // import { processSyncQueue } from './sync-engine'; processSyncQueue();
        }
    };

    return {
        tasks: localTasks,
        isLoading,
        isSyncing,
        completeTask
    };
}
