import { useLiveQuery } from 'dexie-react-hooks';
import { dbLocal } from '@/lib/db/offline';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { OfflineTask } from '@/lib/db/offline';
import { supabase } from '@/lib/supabase';
import { useEffect, useState, useCallback } from 'react';

/**
 * AGI LEVEL HOOK: useSmartTasks (v2 - Defensive)
 * 
 * Este hook encapsula toda la complejidad de la sincronización.
 * - Si hay internet: Carga de Supabase y guarda en local (Cache-first).
 * - Si no hay internet: Carga de local (Offline-first).
 * - Si hay cambios locales pendientes: Los fusiona en tiempo real.
 * 
 * v2: Manejo defensivo de errores de Dexie (tablas vacías, índices faltantes).
 */
export function useSmartTasks(date: Date) {
    const dateStr = date.toISOString().split('T')[0];

    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [dbReady, setDbReady] = useState(false);

    // Verificar que Dexie está inicializado
    useEffect(() => {
        async function checkDb() {
            try {
                // Forzar apertura de la base de datos
                await dbLocal.open();
                setDbReady(true);
            } catch (error) {
                console.error('❌ Error inicializando Dexie:', error);
                // Si falla, intentamos recrear la DB
                try {
                    await dbLocal.delete();
                    await dbLocal.open();
                    setDbReady(true);
                } catch (e2) {
                    console.error('❌ Error crítico en Dexie:', e2);
                    setDbReady(false);
                }
            }
        }
        checkDb();
    }, []);

    // Fallback: Si Dexie lanza error de esquema en el mount, borramos DB
    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            if (event.message?.includes('KeyPath') || event.message?.includes('SchemaError')) {
                console.warn('🔄 Detectado error de esquema, recreando DB...');
                dbLocal.delete().then(() => {
                    window.location.reload();
                });
            }
        };
        window.addEventListener('error', handleError);
        return () => window.removeEventListener('error', handleError);
    }, []);

    // 1. Fuente de la Verdad Local (Reactiva) - Con fallback defensivo
    const localTasks = useLiveQuery(
        async () => {
            if (!dbReady) return [];
            try {
                // Cargar todas las tareas (simplificado para evitar errores de índice)
                const allTasks = await dbLocal.tasks.toArray();
                return allTasks;
            } catch (error) {
                console.error('❌ Error leyendo tareas locales:', error);
                return [];
            }
        },
        [dbReady], // Dependencia en dbReady
        [] // Valor por defecto mientras carga
    );

    // 2. Sincronización Inteligente (Background)
    useEffect(() => {
        if (!dbReady) return;

        async function syncFromCloud() {
            if (!navigator.onLine) {
                setIsLoading(false);
                return;
            }

            setIsSyncing(true);
            try {
                // A. Buscar WorkOrder del día
                const { data: woData, error: woError } = await supabase
                    .from('work_orders')
                    .select('id, status')
                    .eq('scheduled_date', dateStr)
                    .maybeSingle(); // Usar maybeSingle para evitar error si no existe

                if (woError) {
                    console.warn('⚠️ No se encontró WorkOrder para hoy:', woError.message);
                }

                if (woData) {
                    // B. Buscar Tareas
                    const { data: tasksData } = await supabase
                        .from('tasks')
                        .select('*')
                        .eq('work_order_id', woData.id);

                    if (tasksData && tasksData.length > 0) {
                        // C. Actualizar Local DB (Cache Update)
                        await dbLocal.transaction('rw', dbLocal.tasks, dbLocal.workOrders, async () => {
                            // Upsert WorkOrder
                            await dbLocal.workOrders.put({
                                id: woData.id,
                                scheduled_date: dateStr,
                                status: woData.status,
                                sync_status: 'synced'
                            });

                            // Upsert Tasks
                            for (const task of tasksData) {
                                const localVersion = await dbLocal.tasks.get(task.id);
                                if (!localVersion || localVersion.sync_status === 'synced') {
                                    await dbLocal.tasks.put({
                                        id: task.id,
                                        work_order_id: task.work_order_id,
                                        lubrication_point_id: task.lubrication_point_id,
                                        status: task.status,
                                        quantity_used: task.quantity_used || 0,
                                        updated_at: task.updated_at || new Date().toISOString(),
                                        sync_status: 'synced',
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
    }, [dateStr, dbReady]);

    // 3. Acciones "Optimistas"
    const completeTask = useCallback(async (taskId: string, quantity: number, notes?: string) => {
        if (!dbReady) {
            console.warn('DB no lista, reintentando...');
            return;
        }

        try {
            // A. Actualizar UI Local Inmediatamente
            await dbLocal.tasks.update(taskId, {
                status: 'completado',
                quantity_used: quantity,
                notes,
                sync_status: 'pending_update',
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
        } catch (error) {
            console.error('Error completando tarea:', error);
        }
    }, [dbReady]);

    return {
        tasks: localTasks || [],
        isLoading: isLoading || !dbReady,
        isSyncing,
        completeTask
    };
}
