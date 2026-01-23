// Real AISA Lubrication Data - Extracted from Official Documents
// Source: PLAN_DETALLADO_LUBRICACION_AISA.xlsx, PROGRAMA_LUBRICACION_ENERO_2026.xlsx, MANUAL_TECNICO_LUBRICACION_INDUSTRIAL_AISA_2026.pdf

import type { Plant, Area, Machine, Component, Lubricant, Frequency, LubricationPoint, WorkOrder, Task, Anomaly, User } from './types';
import { WD_MACHINES, WD_COMPONENTS, PERFILADORA_COMPONENTS, ADDITIONAL_LUBRICANTS, ADDITIONAL_FREQUENCIES, WD_LUBRICATION_POINTS, PERFILADORA_ADDITIONAL_POINTS } from './realdata';

// ============================================================
// STORAGE KEYS
// ============================================================
const STORAGE_KEYS = {
    plants: 'aisa_plants',
    areas: 'aisa_areas',
    machines: 'aisa_machines',
    components: 'aisa_components',
    lubricants: 'aisa_lubricants',
    frequencies: 'aisa_frequencies',
    lubricationPoints: 'aisa_lubrication_points',
    workOrders: 'aisa_work_orders',
    tasks: 'aisa_tasks',
    anomalies: 'aisa_anomalies',
    users: 'aisa_users',
    initialized: 'aisa_data_initialized_v3',
};

// ============================================================
// DEFAULT DATA - Real AISA Data
// ============================================================

const DEFAULT_PLANTS: Plant[] = [
    { id: 'plant-lg', name: 'Línea Gruesa', createdAt: new Date().toISOString() },
    { id: 'plant-ld', name: 'Línea Delgada', createdAt: new Date().toISOString() },
];

const DEFAULT_AREAS: Area[] = [
    // Línea Gruesa
    { id: 'area-cg611', plantId: 'plant-lg', name: 'CG 611 – Descortezado', createdAt: new Date().toISOString() },
    { id: 'area-cg612', plantId: 'plant-lg', name: 'CG 612 – Aserradero LG', createdAt: new Date().toISOString() },
    { id: 'area-cg613', plantId: 'plant-lg', name: 'CG 613 – Clasificación LG', createdAt: new Date().toISOString() },
    // Línea Delgada
    { id: 'area-cd621', plantId: 'plant-ld', name: 'CG 621 – Aserradero LD', createdAt: new Date().toISOString() },
    { id: 'area-cd622', plantId: 'plant-ld', name: 'CG 622 – Clasificación LD', createdAt: new Date().toISOString() },
];

const DEFAULT_MACHINES: Machine[] = [
    // Descortezado
    { id: 'maq-8001', areaId: 'area-cg611', name: '8001 – Descortezador Línea Gruesa', make: 'Industrial', createdAt: new Date().toISOString() },
    { id: 'maq-8002', areaId: 'area-cg611', name: '8002 – Descortezador Línea Delgada', make: 'Industrial', createdAt: new Date().toISOString() },
    // Aserradero LG
    { id: 'maq-canter1', areaId: 'area-cg612', name: 'Canter 1', make: 'LINCK', model: 'HPS-120', createdAt: new Date().toISOString() },
    { id: 'maq-canter2', areaId: 'area-cg612', name: 'Canter 2', make: 'LINCK', model: 'HPS-120', createdAt: new Date().toISOString() },
    { id: 'maq-perfiladora', areaId: 'area-cg612', name: 'Perfiladora LINCK', make: 'LINCK', createdAt: new Date().toISOString() },
    { id: 'maq-sierra-huincha', areaId: 'area-cg612', name: 'Sierra Huincha Principal LG', make: 'EWD', createdAt: new Date().toISOString() },
    // Clasificación
    { id: 'maq-clasificador', areaId: 'area-cg613', name: 'Clasificador de Tablas LG', createdAt: new Date().toISOString() },
    { id: 'maq-despuntador', areaId: 'area-cg613', name: 'Despuntador Automático', createdAt: new Date().toISOString() },
];

const DEFAULT_COMPONENTS: Component[] = [
    // Descortezador LG (8001)
    { id: 'comp-8001-cadenas', machineId: 'maq-8001', name: 'Cadenas Descortezador LG', createdAt: new Date().toISOString() },
    { id: 'comp-8001-alimentacion', machineId: 'maq-8001', name: 'Cadenas Alimentación LG', createdAt: new Date().toISOString() },
    { id: 'comp-8001-hidraulica', machineId: 'maq-8001', name: 'Central Hidráulica LG', createdAt: new Date().toISOString() },
    { id: 'comp-8001-cuchillos', machineId: 'maq-8001', name: 'Cuchillos Descortezador LG', createdAt: new Date().toISOString() },
    { id: 'comp-8001-rotor', machineId: 'maq-8001', name: 'Rotor Descortezador LG', createdAt: new Date().toISOString() },
    { id: 'comp-8001-reductor', machineId: 'maq-8001', name: 'Reductor Descortezador LG', createdAt: new Date().toISOString() },
    // Descortezador LD (8002)
    { id: 'comp-8002-cuchillos', machineId: 'maq-8002', name: 'Cuchillos Descortezador LD', createdAt: new Date().toISOString() },
    { id: 'comp-8002-cadenas', machineId: 'maq-8002', name: 'Cadenas Descortezador LD', createdAt: new Date().toISOString() },
    { id: 'comp-8002-hidraulica-izq', machineId: 'maq-8002', name: 'Central Hidráulica DAG Izquierda', createdAt: new Date().toISOString() },
    { id: 'comp-8002-hidraulica-der', machineId: 'maq-8002', name: 'Central Hidráulica DAG Derecha', createdAt: new Date().toISOString() },
    { id: 'comp-8002-rotor', machineId: 'maq-8002', name: 'Rotor Descortezador LD', createdAt: new Date().toISOString() },
    // Canter 1 y 2
    { id: 'comp-canter-eje', machineId: 'maq-canter1', name: 'Eje Estriado (Drive Shaft)', createdAt: new Date().toISOString() },
    { id: 'comp-canter-polea-trans', machineId: 'maq-canter1', name: 'Rodamiento Polea Transmisión', createdAt: new Date().toISOString() },
    { id: 'comp-canter-polea-dent', machineId: 'maq-canter1', name: 'Rodamiento Polea Dentada', createdAt: new Date().toISOString() },
    { id: 'comp-canter-polea-tens', machineId: 'maq-canter1', name: 'Rodamiento Polea Tensora', createdAt: new Date().toISOString() },
    { id: 'comp-canter-cardan', machineId: 'maq-canter1', name: 'Cardán de Transmisión', createdAt: new Date().toISOString() },
    { id: 'comp-canter-eje-rodillos', machineId: 'maq-canter1', name: 'Eje de Rodillos Verticales', createdAt: new Date().toISOString() },
    { id: 'comp-canter-rod-rodillos', machineId: 'maq-canter1', name: 'Rodamiento Rodillos Verticales', createdAt: new Date().toISOString() },
    { id: 'comp-canter-reductores', machineId: 'maq-canter1', name: 'Reductores de Avance', createdAt: new Date().toISOString() },
    // Perfiladora LINCK
    { id: 'comp-perf-guias', machineId: 'maq-perfiladora', name: 'Guías Lineales BV y Ejes HV', createdAt: new Date().toISOString() },
    { id: 'comp-perf-ajuste', machineId: 'maq-perfiladora', name: 'Guía de Ajuste', createdAt: new Date().toISOString() },
    { id: 'comp-perf-conexion', machineId: 'maq-perfiladora', name: 'Eje de Conexión', createdAt: new Date().toISOString() },
    { id: 'comp-perf-husillo', machineId: 'maq-perfiladora', name: 'Husillo Roscado Trapezoidal', createdAt: new Date().toISOString() },
];

const DEFAULT_LUBRICANTS: Lubricant[] = [
    { id: 'lub-grasa-i-ii', name: 'Grasa I y II (SKF LGMT 2)', type: 'grasa', nlgiGrade: '2', createdAt: new Date().toISOString() },
    { id: 'lub-kp2k', name: 'KP2K (Grasa Alta Presión)', type: 'grasa', nlgiGrade: '2', createdAt: new Date().toISOString() },
    { id: 'lub-aceite-150', name: 'Aceite 150 (Shell Omala S2 G 150)', type: 'aceite', viscosity: 'ISO VG 150', createdAt: new Date().toISOString() },
    { id: 'lub-80w90', name: 'Aceite 80W-90 (Transmisión)', type: 'aceite', viscosity: '80W-90', createdAt: new Date().toISOString() },
    { id: 'lub-tellus-46', name: 'Shell Tellus S2 M 46 (Hidráulico)', type: 'aceite', viscosity: 'ISO VG 46', createdAt: new Date().toISOString() },
    { id: 'lub-cadenas', name: 'Aceite para Cadenas (Shell Tonna S3 M)', type: 'aceite', viscosity: 'ISO VG 68', createdAt: new Date().toISOString() },
];

const DEFAULT_FREQUENCIES: Frequency[] = [
    { id: 'freq-8hrs', name: 'Cada 8 Horas (Diario)', days: 1, createdAt: new Date().toISOString() },
    { id: 'freq-40hrs', name: 'Cada 40 Horas (Semanal)', days: 5, createdAt: new Date().toISOString() },
    { id: 'freq-dia-medio', name: 'Día por Medio', days: 2, createdAt: new Date().toISOString() },
    { id: 'freq-quincenal', name: 'Quincenal', days: 14, createdAt: new Date().toISOString() },
    { id: 'freq-mensual', name: 'Mensual', days: 30, createdAt: new Date().toISOString() },
    { id: 'freq-7000hrs', name: 'Cada 7000 Horas (Anual)', days: 365, createdAt: new Date().toISOString() },
];

const DEFAULT_LUBRICATION_POINTS: LubricationPoint[] = [
    // Descortezador LG - Diario
    { id: 'lp-3100', componentId: 'comp-8001-cadenas', code: '3100', description: 'Aceitado cadenas descortezador LG', lubricantId: 'lub-cadenas', method: 'manual', quantity: 50, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
    { id: 'lp-3200', componentId: 'comp-8001-alimentacion', code: '3200', description: 'Aceitado cadenas alimentación LG', lubricantId: 'lub-cadenas', method: 'manual', quantity: 50, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
    { id: 'lp-3002', componentId: 'comp-8001-hidraulica', code: '3002', description: 'Verificar nivel central hidráulica LG', lubricantId: 'lub-tellus-46', method: 'manual', quantity: 0, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
    // Descortezador LG - Día por medio
    { id: 'lp-3000-eng', componentId: 'comp-8001-cuchillos', code: '3000', description: 'Engrasado cuchillos descortezador LG', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 80, frequencyId: 'freq-dia-medio', createdAt: new Date().toISOString() },
    // Descortezador LG - Quincenal
    { id: 'lp-3000-rotor', componentId: 'comp-8001-rotor', code: '3000-R', description: 'Lavado + cambio aceite 80W-90 rotor LG', lubricantId: 'lub-80w90', method: 'manual', quantity: 2000, frequencyId: 'freq-quincenal', createdAt: new Date().toISOString() },
    // Descortezador LG - Mensual
    { id: 'lp-3000-red', componentId: 'comp-8001-reductor', code: '3000-RED', description: 'Revisión nivel aceite reductor LG', lubricantId: 'lub-aceite-150', method: 'manual', quantity: 0, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },

    // Descortezador LD - Diario
    { id: 'lp-2100-eng', componentId: 'comp-8002-cuchillos', code: '2100', description: 'Engrasado cuchillos descortezador LD', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 60, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
    { id: 'lp-2100-cad', componentId: 'comp-8002-cadenas', code: '2100-CAD', description: 'Aceitado cadenas descortezador LD', lubricantId: 'lub-cadenas', method: 'manual', quantity: 50, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
    { id: 'lp-1350', componentId: 'comp-8002-hidraulica-izq', code: '1350', description: 'Verificar nivel central hidráulica DAG izq.', lubricantId: 'lub-tellus-46', method: 'manual', quantity: 0, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
    { id: 'lp-1810', componentId: 'comp-8002-hidraulica-der', code: '1810', description: 'Verificar nivel central hidráulica DAG der.', lubricantId: 'lub-tellus-46', method: 'manual', quantity: 0, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
    // Descortezador LD - Quincenal
    { id: 'lp-2100-rotor', componentId: 'comp-8002-rotor', code: '2100-R', description: 'Lavado + cambio aceite 80W-90 rotor LD', lubricantId: 'lub-80w90', method: 'manual', quantity: 1500, frequencyId: 'freq-quincenal', createdAt: new Date().toISOString() },

    // Canter 1 y 2 - Cada 8 hrs
    { id: 'lp-c-eje', componentId: 'comp-canter-eje', code: 'C-9.1.1-B', description: 'Engrasado eje estriado Canter', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 120, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
    // Canter - Mensual
    { id: 'lp-c-polea-trans', componentId: 'comp-canter-polea-trans', code: 'C-9.1.1-A', description: 'Engrasado rodamiento polea transmisión', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 100, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },
    { id: 'lp-c-polea-dent', componentId: 'comp-canter-polea-dent', code: 'C-9.1.1-C', description: 'Engrasado rodamiento polea dentada', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 200, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },
    { id: 'lp-c-polea-tens', componentId: 'comp-canter-polea-tens', code: 'C-9.1.1-D', description: 'Engrasado rodamiento polea tensora', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 80, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },
    // Canter - Cada 40 hrs
    { id: 'lp-c-cardan', componentId: 'comp-canter-cardan', code: 'C-9.1.2-B', description: 'Engrasado cardán de transmisión', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 80, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
    { id: 'lp-c-eje-rod', componentId: 'comp-canter-eje-rodillos', code: 'C-9.1.2-C', description: 'Engrasado eje de rodillos', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 80, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
    { id: 'lp-c-rod-rod', componentId: 'comp-canter-rod-rodillos', code: 'C-9.1.2-D', description: 'Engrasado rodamiento rodillos verticales', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 80, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
    // Canter - Anual
    { id: 'lp-c-reductores', componentId: 'comp-canter-reductores', code: 'C-9.1.2-A', description: 'Cambio aceite reductores de avance', lubricantId: 'lub-aceite-150', method: 'manual', quantity: 1900, frequencyId: 'freq-7000hrs', createdAt: new Date().toISOString() },

    // Perfiladora LINCK - Cada 8 hrs
    { id: 'lp-p-guias', componentId: 'comp-perf-guias', code: 'P-9.2.1-10', description: 'Engrasado guías lineales BV y ejes HV (16 pts)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
    // Perfiladora - Cada 40 hrs
    { id: 'lp-p-ajuste', componentId: 'comp-perf-ajuste', code: 'P-9.2.2-4', description: 'Engrasado guía de ajuste', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
    { id: 'lp-p-conexion', componentId: 'comp-perf-conexion', code: 'P-9.2.2-5', description: 'Engrasado eje de conexión (8 pts)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
    { id: 'lp-p-husillo', componentId: 'comp-perf-husillo', code: 'P-9.2.2-7', description: 'Engrasado husillo roscado trapezoidal', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
];

const DEFAULT_USERS: User[] = [
    { id: 'user-1', name: 'Omar Alexis', email: 'omar@aisa.cl', role: 'admin', createdAt: new Date().toISOString() },
    { id: 'user-2', name: 'Juan Pérez', email: 'juan@lubricacion.cl', role: 'tecnico', createdAt: new Date().toISOString() },
    { id: 'user-3', name: 'Carlos Muñoz', email: 'supervisor@aisa.cl', role: 'supervisor', createdAt: new Date().toISOString() },
];

// ============================================================
// DATA SERVICE
// ============================================================

function getFromStorage<T>(key: string, defaultValue: T[]): T[] {
    if (typeof window === 'undefined') return defaultValue;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
}

function saveToStorage<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
}

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function initializeData(): void {
    if (typeof window === 'undefined') return;

    const initialized = localStorage.getItem(STORAGE_KEYS.initialized);
    if (initialized) return;

    // Merge all machines including WD system
    const allMachines = [...DEFAULT_MACHINES, ...WD_MACHINES];
    // Merge all components including WD and additional Perfiladora
    const allComponents = [...DEFAULT_COMPONENTS, ...WD_COMPONENTS, ...PERFILADORA_COMPONENTS];
    // Merge all lubricants including NBU 15
    const allLubricants = [...DEFAULT_LUBRICANTS, ...ADDITIONAL_LUBRICANTS];
    // Merge all frequencies including trimestral, semestral, anual
    const allFrequencies = [...DEFAULT_FREQUENCIES, ...ADDITIONAL_FREQUENCIES];
    // Merge all lubrication points (55 total)
    const allLubricationPoints = [...DEFAULT_LUBRICATION_POINTS, ...WD_LUBRICATION_POINTS, ...PERFILADORA_ADDITIONAL_POINTS];

    saveToStorage(STORAGE_KEYS.plants, DEFAULT_PLANTS);
    saveToStorage(STORAGE_KEYS.areas, DEFAULT_AREAS);
    saveToStorage(STORAGE_KEYS.machines, allMachines);
    saveToStorage(STORAGE_KEYS.components, allComponents);
    saveToStorage(STORAGE_KEYS.lubricants, allLubricants);
    saveToStorage(STORAGE_KEYS.frequencies, allFrequencies);
    saveToStorage(STORAGE_KEYS.lubricationPoints, allLubricationPoints);
    saveToStorage(STORAGE_KEYS.users, DEFAULT_USERS);

    // Generate work orders for the current week
    generateWeeklyWorkOrders();

    localStorage.setItem(STORAGE_KEYS.initialized, 'true');
}

function generateWeeklyWorkOrders(): void {
    const workOrders: WorkOrder[] = [];
    const tasks: Task[] = [];
    const points = DEFAULT_LUBRICATION_POINTS;
    const frequencies = DEFAULT_FREQUENCIES;

    const today = new Date();

    for (let i = -1; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const dayOfWeek = date.getDay();

        const dailyPoints = points.filter(p => {
            const freq = frequencies.find(f => f.id === p.frequencyId);
            if (!freq) return false;
            if (freq.days === 1) return true; // Daily
            if (freq.days === 2 && dayOfWeek % 2 === 0) return true; // Every other day
            if (freq.days === 5 && dayOfWeek === 1) return true; // Weekly on Monday
            if (freq.days === 14 && date.getDate() <= 7) return true; // First week of the month
            if (freq.days === 30 && date.getDate() === 1) return true; // Monthly
            return false;
        });

        if (dailyPoints.length > 0) {
            const woId = `wo-${dateStr}`;
            workOrders.push({
                id: woId,
                scheduledDate: dateStr,
                status: i < 0 ? 'completado' : 'pendiente',
                technicianId: 'user-2',
                createdAt: new Date().toISOString(),
                completedAt: i < 0 ? new Date().toISOString() : undefined,
            });

            dailyPoints.forEach(point => {
                tasks.push({
                    id: `task-${woId}-${point.id}`,
                    workOrderId: woId,
                    lubricationPointId: point.id,
                    status: i < 0 ? 'completado' : 'pendiente',
                    quantityUsed: i < 0 ? point.quantity : undefined,
                    completedAt: i < 0 ? new Date().toISOString() : undefined,
                    createdAt: new Date().toISOString(),
                });
            });
        }
    }

    saveToStorage(STORAGE_KEYS.workOrders, workOrders);
    saveToStorage(STORAGE_KEYS.tasks, tasks);
    saveToStorage(STORAGE_KEYS.anomalies, []);
}

export const dataService = {
    init: initializeData,
    resetData: () => {
        if (typeof window === 'undefined') return;
        Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
        initializeData();
    },

    // Plants
    getPlants: (): Plant[] => getFromStorage(STORAGE_KEYS.plants, DEFAULT_PLANTS),

    // Areas
    getAreas: (plantId?: string): Area[] => {
        const areas = getFromStorage(STORAGE_KEYS.areas, DEFAULT_AREAS);
        return plantId ? areas.filter(a => a.plantId === plantId) : areas;
    },

    // Machines
    getMachines: (areaId?: string): Machine[] => {
        const machines = getFromStorage(STORAGE_KEYS.machines, DEFAULT_MACHINES);
        return areaId ? machines.filter(m => m.areaId === areaId) : machines;
    },

    // Components
    getComponents: (machineId?: string): Component[] => {
        const components = getFromStorage(STORAGE_KEYS.components, DEFAULT_COMPONENTS);
        return machineId ? components.filter(c => c.machineId === machineId) : components;
    },

    // Lubricants
    getLubricants: (): Lubricant[] => getFromStorage(STORAGE_KEYS.lubricants, DEFAULT_LUBRICANTS),
    addLubricant: (data: Omit<Lubricant, 'id' | 'createdAt'>): Lubricant => {
        const lubricants = getFromStorage(STORAGE_KEYS.lubricants, DEFAULT_LUBRICANTS);
        const newLub: Lubricant = { ...data, id: generateId(), createdAt: new Date().toISOString() };
        saveToStorage(STORAGE_KEYS.lubricants, [...lubricants, newLub]);
        return newLub;
    },

    // Frequencies
    getFrequencies: (): Frequency[] => getFromStorage(STORAGE_KEYS.frequencies, DEFAULT_FREQUENCIES),

    // Lubrication Points
    getLubricationPoints: (componentId?: string): LubricationPoint[] => {
        const points = getFromStorage(STORAGE_KEYS.lubricationPoints, DEFAULT_LUBRICATION_POINTS);
        return componentId ? points.filter(p => p.componentId === componentId) : points;
    },
    addLubricationPoint: (data: Omit<LubricationPoint, 'id' | 'createdAt'>): LubricationPoint => {
        const points = getFromStorage(STORAGE_KEYS.lubricationPoints, DEFAULT_LUBRICATION_POINTS);
        const newPoint: LubricationPoint = { ...data, id: generateId(), createdAt: new Date().toISOString() };
        saveToStorage(STORAGE_KEYS.lubricationPoints, [...points, newPoint]);
        return newPoint;
    },

    // Work Orders
    getWorkOrders: (): WorkOrder[] => {
        initializeData();
        return getFromStorage(STORAGE_KEYS.workOrders, []);
    },
    getTodayWorkOrder: (): WorkOrder | undefined => {
        const today = new Date().toISOString().split('T')[0];
        const workOrders = getFromStorage<WorkOrder>(STORAGE_KEYS.workOrders, []);
        return workOrders.find(wo => wo.scheduledDate === today);
    },
    updateWorkOrder: (id: string, data: Partial<WorkOrder>): void => {
        const workOrders = getFromStorage<WorkOrder>(STORAGE_KEYS.workOrders, []);
        const updated = workOrders.map(wo => wo.id === id ? { ...wo, ...data } : wo);
        saveToStorage(STORAGE_KEYS.workOrders, updated);
    },

    // Tasks
    getTasks: (workOrderId?: string): Task[] => {
        initializeData();
        const tasks = getFromStorage<Task>(STORAGE_KEYS.tasks, []);
        return workOrderId ? tasks.filter(t => t.workOrderId === workOrderId) : tasks;
    },
    updateTask: (id: string, data: Partial<Task>): void => {
        const tasks = getFromStorage<Task>(STORAGE_KEYS.tasks, []);
        const updated = tasks.map(t => t.id === id ? { ...t, ...data } : t);
        saveToStorage(STORAGE_KEYS.tasks, updated);
    },

    // Anomalies
    getAnomalies: (): Anomaly[] => getFromStorage(STORAGE_KEYS.anomalies, []),
    addAnomaly: (data: Omit<Anomaly, 'id' | 'createdAt'>): Anomaly => {
        const anomalies = getFromStorage<Anomaly>(STORAGE_KEYS.anomalies, []);
        const newAnomaly: Anomaly = { ...data, id: generateId(), createdAt: new Date().toISOString() };
        saveToStorage(STORAGE_KEYS.anomalies, [...anomalies, newAnomaly]);
        return newAnomaly;
    },
    updateAnomaly: (id: string, data: Partial<Anomaly>): void => {
        const anomalies = getFromStorage<Anomaly>(STORAGE_KEYS.anomalies, []);
        const updated = anomalies.map(a => a.id === id ? { ...a, ...data } : a);
        saveToStorage(STORAGE_KEYS.anomalies, updated);
    },

    // Users
    getUsers: (): User[] => getFromStorage(STORAGE_KEYS.users, DEFAULT_USERS),

    // Add methods for creating new entities
    addPlant: (data: Omit<Plant, 'id' | 'createdAt'>): Plant => {
        const plants = getFromStorage(STORAGE_KEYS.plants, DEFAULT_PLANTS);
        const newPlant: Plant = { ...data, id: generateId(), createdAt: new Date().toISOString() };
        saveToStorage(STORAGE_KEYS.plants, [...plants, newPlant]);
        return newPlant;
    },
    addArea: (data: Omit<Area, 'id' | 'createdAt'>): Area => {
        const areas = getFromStorage(STORAGE_KEYS.areas, DEFAULT_AREAS);
        const newArea: Area = { ...data, id: generateId(), createdAt: new Date().toISOString() };
        saveToStorage(STORAGE_KEYS.areas, [...areas, newArea]);
        return newArea;
    },
    addMachine: (data: Omit<Machine, 'id' | 'createdAt'>): Machine => {
        const machines = getFromStorage(STORAGE_KEYS.machines, DEFAULT_MACHINES);
        const newMachine: Machine = { ...data, id: generateId(), createdAt: new Date().toISOString() };
        saveToStorage(STORAGE_KEYS.machines, [...machines, newMachine]);
        return newMachine;
    },
    addComponent: (data: Omit<Component, 'id' | 'createdAt'>): Component => {
        const components = getFromStorage(STORAGE_KEYS.components, DEFAULT_COMPONENTS);
        const newComponent: Component = { ...data, id: generateId(), createdAt: new Date().toISOString() };
        saveToStorage(STORAGE_KEYS.components, [...components, newComponent]);
        return newComponent;
    },

    // Counts for dashboard
    getCounts: () => {
        initializeData();
        return {
            plants: getFromStorage(STORAGE_KEYS.plants, DEFAULT_PLANTS).length,
            areas: getFromStorage(STORAGE_KEYS.areas, DEFAULT_AREAS).length,
            machines: getFromStorage(STORAGE_KEYS.machines, DEFAULT_MACHINES).length,
            components: getFromStorage(STORAGE_KEYS.components, DEFAULT_COMPONENTS).length,
            lubricationPoints: getFromStorage(STORAGE_KEYS.lubricationPoints, DEFAULT_LUBRICATION_POINTS).length,
            lubricants: getFromStorage(STORAGE_KEYS.lubricants, DEFAULT_LUBRICANTS).length,
        };
    },
};
