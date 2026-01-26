import Dexie, { Table } from 'dexie';

// Interfaces alineadas con Supabase pero optimizadas para local
export interface OfflineTask {
    id: string; // UUID
    work_order_id: string;
    lubrication_point_id: string;
    status: 'pendiente' | 'completado' | 'omitido';
    quantity_used: number; // local mutation
    photo_local_url?: string; // blob url temporal
    notes?: string;
    sync_status: 'synced' | 'pending_update' | 'pending_upload';
    updated_at: string;
}

export interface OfflineWorkOrder {
    id: string;
    scheduled_date: string;
    status: string;
    sync_status: 'synced' | 'pending';
}

export interface SyncQueueItem {
    id?: number; // Auto-increment
    resource: 'tasks' | 'anomalies' | 'photos';
    action: 'create' | 'update';
    payload: any;
    created_at: number;
    retry_count: number;
}

export class AisaOfflineDB extends Dexie {
    tasks!: Table<OfflineTask, string>;
    workOrders!: Table<OfflineWorkOrder, string>;
    syncQueue!: Table<SyncQueueItem, number>;

    constructor() {
        super('AisaOfflineDB');
        this.version(1).stores({
            tasks: 'id, work_order_id, status, sync_status',
            workOrders: 'id, scheduled_date, sync_status',
            syncQueue: '++id, resource, created_at' // Cola FIFO
        });
    }
}

export const dbLocal = new AisaOfflineDB();
