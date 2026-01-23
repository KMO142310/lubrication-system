// Type definitions for the Lubrication Management System

// ============================================================
// HIERARCHY: Plant > Area > Machine > Component > LubricationPoint
// ============================================================

export interface Plant {
    id: string;
    name: string;           // e.g., "Línea Gruesa", "Línea Delgada"
    createdAt: string;
}

export interface Area {
    id: string;
    plantId: string;
    name: string;           // e.g., "Sierra Principal", "Desbaste"
    createdAt: string;
}

export interface Machine {
    id: string;
    areaId: string;
    name: string;           // e.g., "Sierra Huincha 1", "Transportador A"
    make?: string;
    model?: string;
    createdAt: string;
}

export interface Component {
    id: string;
    machineId: string;
    name: string;           // e.g., "Caja Reductora", "Rodamiento Principal"
    createdAt: string;
}

export interface LubricationPoint {
    id: string;
    componentId: string;
    code: string;           // Unique identifier, e.g., "LG-SP-SH1-CR-01"
    description: string;
    lubricantId: string;
    method: 'manual' | 'automatico' | 'centralizado';
    quantity: number;       // ml or grams
    frequencyId: string;
    createdAt: string;
}

// ============================================================
// LUBRICANTS & FREQUENCIES
// ============================================================

export interface Lubricant {
    id: string;
    name: string;           // e.g., "Shell Omala S2 G 220"
    type: 'aceite' | 'grasa';
    viscosity?: string;
    nlgiGrade?: string;     // For greases
    createdAt: string;
}

export interface Frequency {
    id: string;
    name: string;           // e.g., "Diario", "Semanal", "Quincenal", "Mensual"
    days: number;           // Interval in days
    createdAt: string;
}

// ============================================================
// WORK ORDERS & TASKS
// ============================================================

export type TaskStatus = 'pendiente' | 'en_progreso' | 'completado' | 'omitido';

export interface WorkOrder {
    id: string;
    scheduledDate: string;  // ISO date
    status: TaskStatus;
    technicianId?: string;
    createdAt: string;
    completedAt?: string;
}

export interface Task {
    id: string;
    workOrderId: string;
    lubricationPointId: string;
    status: TaskStatus;
    quantityUsed?: number;
    observations?: string;
    photoUrl?: string;
    completedAt?: string;
    createdAt: string;
}

// ============================================================
// ANOMALIES / FAILURE REPORTS
// ============================================================

export type AnomalySeverity = 'baja' | 'media' | 'alta' | 'critica';
export type AnomalyStatus = 'abierta' | 'en_revision' | 'resuelta';

export interface Anomaly {
    id: string;
    lubricationPointId?: string;
    machineId?: string;
    reportedBy: string;     // Technician ID
    description: string;
    severity: AnomalySeverity;
    status: AnomalyStatus;
    photoUrl?: string;
    resolution?: string;
    createdAt: string;
    resolvedAt?: string;
}

// ============================================================
// USERS
// ============================================================

export type UserRole = 'admin' | 'supervisor' | 'tecnico';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string;
}
