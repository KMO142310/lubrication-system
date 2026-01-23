'use client';

import { supabase } from './supabase';
import { Task, WorkOrder, Anomaly } from './types';

// ============================================================
// SERVICIO DE SINCRONIZACIÓN EN TIEMPO REAL
// ============================================================

export interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  pendingChanges: number;
}

// ============================================================
// WORK ORDERS
// ============================================================

export async function syncWorkOrders(date?: string): Promise<WorkOrder[]> {
  const query = supabase
    .from('work_orders')
    .select('*')
    .order('scheduled_date', { ascending: false });

  if (date) {
    query.eq('scheduled_date', date);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching work orders:', error);
    return [];
  }

  return data?.map(wo => ({
    id: wo.id,
    scheduledDate: wo.scheduled_date,
    status: wo.status,
    technicianId: wo.technician_id,
    completedAt: wo.completed_at,
    signatureUrl: wo.signature_url,
    createdAt: wo.created_at,
  })) || [];
}

export async function updateWorkOrderSync(id: string, updates: Partial<WorkOrder> & { signatureUrl?: string }): Promise<boolean> {
  const { error } = await supabase
    .from('work_orders')
    .update({
      status: updates.status,
      completed_at: updates.completedAt,
      signature_url: updates.signatureUrl,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating work order:', error);
    return false;
  }

  return true;
}

// ============================================================
// TASKS
// ============================================================

export async function syncTasks(workOrderId?: string): Promise<Task[]> {
  const query = supabase
    .from('tasks')
    .select('*');

  if (workOrderId) {
    query.eq('work_order_id', workOrderId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }

  return data?.map(t => ({
    id: t.id,
    workOrderId: t.work_order_id,
    lubricationPointId: t.lubrication_point_id,
    status: t.status,
    quantityUsed: t.quantity_used,
    observations: t.observations,
    photoUrl: t.photo_url,
    completedAt: t.completed_at,
    createdAt: t.created_at,
  })) || [];
}

export async function updateTaskSync(id: string, updates: Partial<Task>): Promise<boolean> {
  const { error } = await supabase
    .from('tasks')
    .update({
      status: updates.status,
      quantity_used: updates.quantityUsed,
      observations: updates.observations,
      photo_url: updates.photoUrl,
      completed_at: updates.completedAt,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating task:', error);
    return false;
  }

  return true;
}

// ============================================================
// ANOMALIES
// ============================================================

export async function syncAnomalies(): Promise<Anomaly[]> {
  const { data, error } = await supabase
    .from('anomalies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching anomalies:', error);
    return [];
  }

  return data?.map(a => ({
    id: a.id,
    taskId: a.task_id,
    description: a.description,
    severity: a.severity,
    status: a.status,
    photoUrl: a.photo_url,
    reportedBy: a.reported_by,
    createdAt: a.created_at,
  })) || [];
}

export async function createAnomalySync(anomaly: Partial<Anomaly> & { taskId?: string }): Promise<string | null> {
  const { data, error } = await supabase
    .from('anomalies')
    .insert({
      task_id: anomaly.taskId,
      description: anomaly.description,
      severity: anomaly.severity,
      photo_url: anomaly.photoUrl,
      reported_by: anomaly.reportedBy,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating anomaly:', error);
    return null;
  }

  return data?.id || null;
}

// ============================================================
// REALTIME SUBSCRIPTIONS
// ============================================================

export function subscribeToWorkOrders(
  callback: (payload: { eventType: string; new: WorkOrder; old: WorkOrder }) => void
) {
  return supabase
    .channel('work_orders_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'work_orders' },
      (payload) => {
        callback({
          eventType: payload.eventType,
          new: payload.new as WorkOrder,
          old: payload.old as WorkOrder,
        });
      }
    )
    .subscribe();
}

export function subscribeToTasks(
  workOrderId: string,
  callback: (payload: { eventType: string; new: Task; old: Task }) => void
) {
  return supabase
    .channel(`tasks_${workOrderId}`)
    .on(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: 'tasks',
        filter: `work_order_id=eq.${workOrderId}`
      },
      (payload) => {
        callback({
          eventType: payload.eventType,
          new: payload.new as Task,
          old: payload.old as Task,
        });
      }
    )
    .subscribe();
}

export function subscribeToAnomalies(
  callback: (payload: { eventType: string; new: Anomaly; old: Anomaly }) => void
) {
  return supabase
    .channel('anomalies_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'anomalies' },
      (payload) => {
        callback({
          eventType: payload.eventType,
          new: payload.new as Anomaly,
          old: payload.old as Anomaly,
        });
      }
    )
    .subscribe();
}

// ============================================================
// AUDIT LOG
// ============================================================

export async function logAuditEvent(
  action: string,
  entityType: string,
  entityId: string,
  details?: Record<string, unknown>
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  await supabase.from('audit_logs').insert({
    user_id: user?.id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
  });
}

// ============================================================
// PHOTO UPLOAD
// ============================================================

export async function uploadPhoto(
  file: File | Blob,
  path: string
): Promise<string | null> {
  const fileName = `${path}/${Date.now()}.jpg`;
  
  const { data, error } = await supabase.storage
    .from('photos')
    .upload(fileName, file, {
      contentType: 'image/jpeg',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading photo:', error);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from('photos')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

// ============================================================
// OFFLINE SUPPORT
// ============================================================

const PENDING_CHANGES_KEY = 'aisa_pending_changes';

interface PendingChange {
  id: string;
  type: 'task' | 'workOrder' | 'anomaly';
  action: 'update' | 'create';
  data: Record<string, unknown>;
  timestamp: string;
}

export function savePendingChange(change: Omit<PendingChange, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  
  const pending = getPendingChanges();
  pending.push({
    ...change,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  });
  
  localStorage.setItem(PENDING_CHANGES_KEY, JSON.stringify(pending));
}

export function getPendingChanges(): PendingChange[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(PENDING_CHANGES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export async function syncPendingChanges(): Promise<number> {
  const pending = getPendingChanges();
  let synced = 0;

  for (const change of pending) {
    try {
      if (change.type === 'task' && change.action === 'update') {
        const success = await updateTaskSync(change.data.id as string, change.data as Partial<Task>);
        if (success) synced++;
      } else if (change.type === 'workOrder' && change.action === 'update') {
        const success = await updateWorkOrderSync(change.data.id as string, change.data as Partial<WorkOrder>);
        if (success) synced++;
      } else if (change.type === 'anomaly' && change.action === 'create') {
        const id = await createAnomalySync(change.data as Partial<Anomaly>);
        if (id) synced++;
      }
    } catch (error) {
      console.error('Error syncing change:', error);
    }
  }

  // Clear synced changes
  if (synced === pending.length) {
    localStorage.removeItem(PENDING_CHANGES_KEY);
  }

  return synced;
}

// ============================================================
// CONNECTION STATUS
// ============================================================

export function checkOnlineStatus(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

export function onOnlineStatusChange(callback: (isOnline: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
