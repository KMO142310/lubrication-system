// Type definitions for the Lubrication Management System

// ============================================================
// HIERARCHY: Plant > Area > Machine > Component > LubricationPoint
// ============================================================

export interface Plant {
    id: string;
    tenantId?: string;      // Multi-tenant isolation
    name: string;           // e.g., "Línea Gruesa", "Línea Delgada"
    createdAt: string;
}

export interface Area {
    id: string;
    tenantId?: string;
    plantId: string;
    name: string;           // e.g., "Sierra Principal", "Desbaste"
    contractorId?: string;  // ID of external company managing this area
    createdAt: string;
}

export interface Machine {
    id: string;
    tenantId?: string;
    areaId: string;
    name: string;           // e.g., "Sierra Huincha 1", "Transportador A"
    make?: string;
    model?: string;
    criticality?: 'A' | 'B' | 'C'; // A=High, B=Medium, C=Low
    createdAt: string;
}

export interface Component {
    id: string;
    tenantId?: string;
    machineId: string;
    name: string;           // e.g., "Caja Reductora", "Rodamiento Principal"
    createdAt: string;
}

export interface LubricationPoint {
    id: string;
    tenantId?: string;
    componentId: string;
    code: string;           // Unique identifier, e.g., "LG-SP-SH1-CR-01"
    description: string;
    lubricantId: string;
    method: 'manual' | 'automatico' | 'centralizado' | 'verificar' | 'engrasado' | 'nivel';
    quantity: number;       // ml or grams
    unit?: string;          // 'ml', 'g', 'oz', etc.
    frequencyId: string;
    createdAt: string;
}

// ============================================================
// LUBRICANTS & FREQUENCIES
// ============================================================

export interface Lubricant {
    id: string;
    tenantId?: string;
    name: string;           // e.g., "Shell Omala S2 G 220"
    type: 'aceite' | 'grasa';
    viscosity?: string;
    nlgiGrade?: string;     // For greases
    pricePerUnit?: number;
    currency?: 'CLP' | 'USD';
    createdAt: string;
}

export interface Frequency {
    id: string;
    tenantId?: string;
    name: string;           // e.g., "Diario", "Semanal", "Quincenal", "Mensual"
    days: number;           // Interval in days
    tardinessTolerance?: number; // Days allowed delay before critical
    createdAt: string;
}

// ============================================================
// WORK ORDERS & TASKS
// ============================================================

export type TaskStatus = 'pendiente' | 'en_progreso' | 'completado' | 'omitido';

export interface WorkOrder {
    id: string;
    tenantId?: string;
    scheduledDate: string;  // ISO date
    status: TaskStatus;
    technicianId?: string;
    createdAt: string;
    completedAt?: string;
}

export interface Task {
    id: string;
    tenantId?: string;
    workOrderId: string;
    lubricationPointId: string;
    status: TaskStatus;
    quantityUsed?: number;
    observations?: string;
    photoUrl?: string;
    completedAt?: string;
    syncedAt?: string;      // When synced to server (for offline support)
    createdAt: string;
}

// ============================================================
// ANOMALIES / FAILURE REPORTS
// ============================================================

export type AnomalySeverity = 'baja' | 'media' | 'alta' | 'critica';
export type AnomalyStatus = 'abierta' | 'en_revision' | 'resuelta';

export interface Anomaly {
    id: string;
    tenantId?: string;
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

export type UserRole = 'desarrollador' | 'supervisor' | 'lubricador' | 'supervisor_ext';

export interface User {
    id: string;
    tenantId?: string;
    name: string;
    email: string;
    role: UserRole;
    contractorId?: string;  // Link to external contractor company
    createdAt: string;
}

// ============================================================
// CONTRACTOR MANAGEMENT (Enterprise Feature)
// ============================================================

export interface Contractor {
    id: string;
    tenantId?: string;
    name: string;               // Company name, e.g., "Lubricación Profesional Ltda."
    rut: string;                // Chilean tax ID
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    address?: string;
    contractStart: string;      // ISO date
    contractEnd: string;        // ISO date
    status: 'active' | 'inactive' | 'suspended';
    certifications?: string[];  // ISO certifications, safety certs
    createdAt: string;
}

export interface Contract {
    id: string;
    tenantId?: string;
    contractorId: string;
    plantId: string;
    description: string;
    startDate: string;
    endDate: string;
    value?: number;             // Contract value in CLP
    slaCompliance: number;      // Target SLA percentage (e.g., 95)
    status: 'draft' | 'active' | 'completed' | 'terminated';
    createdAt: string;
}

// ============================================================
// COMPLIANCE & AUDIT (Enterprise Feature)
// ============================================================

export type AuditType = 'routine' | 'compliance' | 'incident' | 'certification';
export type AuditResult = 'passed' | 'failed' | 'conditional' | 'pending';

export interface ComplianceAudit {
    id: string;
    tenantId?: string;
    contractorId: string;
    auditorId: string;          // User who performed the audit
    auditType: AuditType;
    scheduledDate: string;
    completedDate?: string;
    result: AuditResult;
    score?: number;             // 0-100 score
    findings: string;
    correctiveActions?: string;
    nextAuditDate?: string;
    attachments?: string[];     // URLs to audit documents
    createdAt: string;
}

// ============================================================
// CONSUMPTION TRACKING & INVENTORY (Enterprise Feature)
// ============================================================

export interface InventoryItem {
    id: string;
    tenantId?: string;
    lubricantId: string;
    quantity: number;       // Current stock
    minStock: number;       // Reorder point
    maxStock: number;
    location?: string;      // e.g., "Bodega Central - Estante A"
    lastUpdated: string;
}

export interface LubricantConsumption {
    id: string;
    tenantId?: string;
    lubricantId: string;
    workOrderId: string;
    quantityUsed: number;
    unitCost?: number;
    recordedBy: string;         // User ID
    recordedAt: string;
}

export interface InventoryMovement {
    id: string;
    tenantId?: string;
    lubricantId: string;
    type: 'entrada' | 'salida' | 'ajuste';
    quantity: number;
    reason: string;
    reference?: string;         // Purchase order, work order, etc.
    recordedBy: string;
    createdAt: string;
}

// ============================================================
// KPI & METRICS (Enterprise Feature)
// ============================================================

export interface KPIMetric {
    id: string;
    tenantId?: string;
    period: string;             // YYYY-MM format
    contractorId?: string;
    plantId?: string;
    tasksCompleted: number;
    tasksTotal: number;
    complianceRate: number;     // Percentage
    avgResponseTime: number;    // Hours
    anomaliesReported: number;
    anomaliesResolved: number;
    lubricantCost: number;      // Total cost in CLP
    createdAt: string;
}

// ============================================================
// IOT & SENSORS (AISA Advanced)
// ============================================================

export interface Sensor {
    id: string;
    tenantId?: string;
    machineId: string;
    type: 'vibration' | 'temperature' | 'level';
    status: 'online' | 'offline' | 'alert';
    lastReading: number;
    unit: string;
    createdAt: string;
}

export interface SensorReading {
    id: string;
    tenantId?: string;
    sensorId: string;
    value: number;
    timestamp: string;
}
