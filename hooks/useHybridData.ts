'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { dataService } from '@/lib/data';

type DataSource = 'supabase' | 'local' | 'checking';

interface HybridDataState {
    source: DataSource;
    isOnline: boolean;
    lastSync: Date | null;
    error: string | null;
}

/**
 * Hook para data híbrida: intenta Supabase, fallback a localStorage
 * Configuración: NEXT_PUBLIC_USE_REAL_DATA=true para forzar Supabase
 */
export function useHybridData() {
    const [state, setState] = useState<HybridDataState>({
        source: 'checking',
        isOnline: false,
        lastSync: null,
        error: null,
    });

    // Check Supabase connection
    useEffect(() => {
        const checkConnection = async () => {
            try {
                // Quick connectivity test
                const { error } = await supabase.from('plants').select('id').limit(1);

                if (error) {
                    console.log('[HybridData] Supabase not available:', error.message);
                    setState(prev => ({ ...prev, source: 'local', isOnline: false }));
                } else {
                    console.log('[HybridData] Supabase connected');
                    setState(prev => ({ ...prev, source: 'supabase', isOnline: true }));
                }
            } catch (e) {
                console.log('[HybridData] Connection check failed:', e);
                setState(prev => ({ ...prev, source: 'local', isOnline: false }));
            }
        };

        checkConnection();

        // Re-check when online status changes
        const handleOnline = () => checkConnection();
        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
    }, []);

    // Fetch data with fallback
    const fetchWithFallback = useCallback(async <T>(
        supabaseQuery: () => Promise<{ data: T | null; error: unknown }>,
        localFallback: () => T
    ): Promise<T> => {
        if (state.source === 'supabase' && state.isOnline) {
            try {
                const { data, error } = await supabaseQuery();
                if (error) throw error;
                if (data) return data;
            } catch (e) {
                console.log('[HybridData] Supabase failed, using local:', e);
            }
        }
        return localFallback();
    }, [state.source, state.isOnline]);

    // Get tasks
    const getTasks = useCallback(() => {
        return fetchWithFallback(
            async () => {
                const { data, error } = await supabase
                    .from('tasks')
                    .select('*')
                    .order('created_at', { ascending: false });
                return { data, error };
            },
            () => dataService.getTasks()
        );
    }, [fetchWithFallback]);

    // Get machines
    const getMachines = useCallback(() => {
        return fetchWithFallback(
            async () => {
                const { data, error } = await supabase
                    .from('machines')
                    .select('*')
                    .order('name');
                return { data, error };
            },
            () => dataService.getMachines()
        );
    }, [fetchWithFallback]);

    // Get lubrication points
    const getLubricationPoints = useCallback(() => {
        return fetchWithFallback(
            async () => {
                const { data, error } = await supabase
                    .from('lubrication_points')
                    .select('*');
                return { data, error };
            },
            () => dataService.getLubricationPoints()
        );
    }, [fetchWithFallback]);

    // Complete task with sync
    const completeTask = useCallback(async (
        taskId: string,
        data: { quantityUsed?: number; photoUrl?: string; observations?: string }
    ) => {
        if (state.source === 'supabase' && state.isOnline) {
            try {
                const { error } = await supabase
                    .from('tasks')
                    .update({
                        status: 'completado',
                        quantity_used: data.quantityUsed,
                        photo_url: data.photoUrl,
                        observations: data.observations,
                        completed_at: new Date().toISOString(),
                    })
                    .eq('id', taskId);

                if (!error) {
                    setState(prev => ({ ...prev, lastSync: new Date() }));
                    return true;
                }
            } catch (e) {
                console.log('[HybridData] Supabase update failed:', e);
            }
        }

        // Fallback to local
        dataService.updateTask(taskId, {
            ...data,
            status: 'completado',
            completedAt: new Date().toISOString(),
        });
        return true;
    }, [state.source, state.isOnline]);

    // Sync local to Supabase
    const syncToSupabase = useCallback(async () => {
        if (!state.isOnline) return false;

        try {
            // Get local tasks that need syncing
            const localTasks = dataService.getTasks()
                .filter(t => t.status === 'completado' && !t.syncedAt);

            for (const task of localTasks) {
                const { error } = await supabase
                    .from('tasks')
                    .upsert({
                        id: task.id,
                        lubrication_point_id: task.lubricationPointId,
                        status: task.status,
                        quantity_used: task.quantityUsed,
                        observations: task.observations,
                        completed_at: task.completedAt,
                    });

                if (!error) {
                    dataService.updateTask(task.id, { syncedAt: new Date().toISOString() });
                }
            }

            setState(prev => ({ ...prev, lastSync: new Date() }));
            return true;
        } catch (e) {
            console.error('[HybridData] Sync failed:', e);
            return false;
        }
    }, [state.isOnline]);

    return {
        ...state,
        getTasks,
        getMachines,
        getLubricationPoints,
        completeTask,
        syncToSupabase,
    };
}
