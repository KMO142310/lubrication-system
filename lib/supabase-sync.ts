/**
 * AISA Supabase Sync Service
 * Real-time synchronization with Supabase
 * Phase 1.1 of ROADMAP_ENTERPRISE.md
 */

import { supabase } from './supabase';
import type { WorkOrder, Task, Anomaly } from './types';

// ============================================================
// SYNC STATE
// ============================================================
type SyncStatus = 'idle' | 'syncing' | 'online' | 'offline' | 'error';
type SyncListener = (status: SyncStatus) => void;

let currentStatus: SyncStatus = 'idle';
const listeners: Set<SyncListener> = new Set();

function notifyListeners(status: SyncStatus) {
    currentStatus = status;
    listeners.forEach(fn => fn(status));
}

export function subscribeSyncStatus(fn: SyncListener): () => void {
    listeners.add(fn);
    fn(currentStatus); // Initial call
    return () => listeners.delete(fn);
}

export function getSyncStatus(): SyncStatus {
    return currentStatus;
}

// ============================================================
// OFFLINE QUEUE
// ============================================================
interface QueuedAction {
    id: string;
    type: 'insert' | 'update' | 'delete';
    table: string;
    data: Record<string, unknown>;
    timestamp: number;
}

const QUEUE_KEY = 'aisa_offline_queue';

function getQueue(): QueuedAction[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function addToQueue(action: Omit<QueuedAction, 'id' | 'timestamp'>) {
    const queue = getQueue();
    queue.push({
        ...action,
        id: `q-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        timestamp: Date.now()
    });
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

function clearQueue() {
    localStorage.removeItem(QUEUE_KEY);
}

async function processQueue(): Promise<void> {
    const queue = getQueue();
    if (queue.length === 0) return;

    notifyListeners('syncing');

    for (const action of queue) {
        try {
            if (action.type === 'insert') {
                await supabase.from(action.table).insert(action.data);
            } else if (action.type === 'update') {
                const { id, ...rest } = action.data;
                await supabase.from(action.table).update(rest).eq('id', id);
            } else if (action.type === 'delete') {
                await supabase.from(action.table).delete().eq('id', action.data.id);
            }
        } catch (err) {
            console.error('Queue processing error:', err);
            notifyListeners('error');
            return;
        }
    }

    clearQueue();
    notifyListeners('online');
}

// ============================================================
// SYNC FUNCTIONS
// ============================================================

export async function syncWorkOrders(): Promise<WorkOrder[]> {
    try {
        notifyListeners('syncing');
        const { data, error } = await supabase
            .from('work_orders')
            .select('*')
            .order('scheduled_date', { ascending: false });

        if (error) throw error;
        notifyListeners('online');

        // Transform snake_case to camelCase
        return (data || []).map(row => ({
            id: row.id,
            scheduledDate: row.scheduled_date,
            status: row.status,
            technicianId: row.technician_id,
            supervisorId: row.supervisor_id,
            signedAt: row.signed_at,
            signatureData: row.signature_data,
            notes: row.notes,
            createdAt: row.created_at
        }));
    } catch (err) {
        console.error('Sync work_orders failed:', err);
        notifyListeners('offline');
        return [];
    }
}

export async function syncTasks(workOrderId?: string): Promise<Task[]> {
    try {
        notifyListeners('syncing');
        let query = supabase.from('tasks').select('*');
        if (workOrderId) {
            query = query.eq('work_order_id', workOrderId);
        }

        const { data, error } = await query;
        if (error) throw error;
        notifyListeners('online');

        return (data || []).map(row => ({
            id: row.id,
            workOrderId: row.work_order_id,
            lubricationPointId: row.lubrication_point_id,
            status: row.status,
            quantityUsed: row.quantity_used,
            observations: row.observations,
            photoUrl: row.photo_url,
            completedAt: row.completed_at,
            createdAt: row.created_at
        }));
    } catch (err) {
        console.error('Sync tasks failed:', err);
        notifyListeners('offline');
        return [];
    }
}

export async function syncAnomalies(): Promise<Anomaly[]> {
    try {
        notifyListeners('syncing');
        const { data, error } = await supabase
            .from('anomalies')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        notifyListeners('online');

        return (data || []).map(row => ({
            id: row.id,
            lubricationPointId: row.lubrication_point_id,
            machineId: row.machine_id,
            reportedBy: row.reported_by || 'unknown',
            description: row.description,
            severity: row.severity,
            status: row.status,
            photoUrl: row.photo_url,
            resolution: row.resolution,
            createdAt: row.created_at,
            resolvedAt: row.resolved_at
        }));
    } catch (err) {
        console.error('Sync anomalies failed:', err);
        notifyListeners('offline');
        return [];
    }
}

// ============================================================
// PUSH FUNCTIONS (with offline queue)
// ============================================================

export async function updateTask(id: string, data: Partial<Task>): Promise<boolean> {
    const payload = {
        id,
        status: data.status,
        completed_at: data.completedAt,
        photo_url: data.photoUrl,
        observations: data.observations,
        quantity_used: data.quantityUsed
    };

    try {
        const { error } = await supabase
            .from('tasks')
            .update(payload)
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Update task failed, queuing:', err);
        addToQueue({ type: 'update', table: 'tasks', data: payload });
        notifyListeners('offline');
        return false;
    }
}

export async function createAnomaly(data: Omit<Anomaly, 'id' | 'createdAt'>): Promise<string | null> {
    const payload = {
        lubrication_point_id: data.lubricationPointId,
        machine_id: data.machineId,
        reported_by: data.reportedBy,
        severity: data.severity,
        description: data.description,
        photo_url: data.photoUrl,
        status: data.status || 'abierta'
    };

    try {
        const { data: inserted, error } = await supabase
            .from('anomalies')
            .insert(payload)
            .select()
            .single();

        if (error) throw error;
        return inserted?.id || null;
    } catch (err) {
        console.error('Create anomaly failed, queuing:', err);
        addToQueue({ type: 'insert', table: 'anomalies', data: payload });
        notifyListeners('offline');
        return null;
    }
}

// ============================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================

let realtimeChannel: ReturnType<typeof supabase.channel> | null = null;

export function subscribeToRealtime(
    onTaskUpdate?: (task: Task) => void,
    onAnomalyInsert?: (anomaly: Anomaly) => void
) {
    if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
    }

    realtimeChannel = supabase
        .channel('aisa-realtime')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tasks' }, (payload) => {
            if (onTaskUpdate && payload.new) {
                const row = payload.new;
                onTaskUpdate({
                    id: row.id,
                    workOrderId: row.work_order_id,
                    lubricationPointId: row.lubrication_point_id,
                    status: row.status,
                    quantityUsed: row.quantity_used,
                    observations: row.observations,
                    photoUrl: row.photo_url,
                    completedAt: row.completed_at,
                    createdAt: row.created_at
                });
            }
        })
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'anomalies' }, (payload) => {
            if (onAnomalyInsert && payload.new) {
                const row = payload.new;
                onAnomalyInsert({
                    id: row.id,
                    lubricationPointId: row.lubrication_point_id,
                    machineId: row.machine_id,
                    reportedBy: row.reported_by || 'unknown',
                    severity: row.severity,
                    description: row.description,
                    photoUrl: row.photo_url,
                    status: row.status,
                    createdAt: row.created_at
                });
            }
        })
        .subscribe((status) => {
            console.log('Realtime status:', status);
            if (status === 'SUBSCRIBED') {
                notifyListeners('online');
            }
        });

    return () => {
        if (realtimeChannel) {
            supabase.removeChannel(realtimeChannel);
            realtimeChannel = null;
        }
    };
}

// ============================================================
// CONNECTIVITY CHECK
// ============================================================

export function startConnectivityMonitor() {
    if (typeof window === 'undefined') return () => { };

    const handleOnline = async () => {
        notifyListeners('syncing');
        await processQueue();
    };

    const handleOffline = () => {
        notifyListeners('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (navigator.onLine) {
        processQueue();
    } else {
        notifyListeners('offline');
    }

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
}

// ============================================================
// FULL SYNC (Pull all data)
// ============================================================

export async function fullSync(): Promise<{
    workOrders: WorkOrder[];
    tasks: Task[];
    anomalies: Anomaly[];
}> {
    const [workOrders, tasks, anomalies] = await Promise.all([
        syncWorkOrders(),
        syncTasks(),
        syncAnomalies()
    ]);

    return { workOrders, tasks, anomalies };
}
