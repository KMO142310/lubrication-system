// ============================================================
// AISA LUBRICATION DATA SERVICE
// Fuente: PROGRAMA_LUBRICACION_ENERO_2026.xlsx
//         PLAN_DETALLADO_LUBRICACION_AISA.xlsx
// ============================================================

import type { Plant, Area, Machine, Component, Lubricant, Frequency, LubricationPoint, WorkOrder, Task, Anomaly, User } from './types';
import { PLANTA_AISA, CENTROS_GESTION, EQUIPOS, COMPONENTES, LUBRICANTES, FRECUENCIAS, PUNTOS_LUBRICACION, getTareasPorFecha } from './datos_completos_aisa';

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
    initialized: 'aisa_data_initialized_v12', // 3 plantas, áreas correctas, responsive
};

// ============================================================
// DEFAULT DATA - Datos Reales del Programa AISA
// ============================================================

// Constantes de datos reales

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

    // Usar datos reales del programa AISA
    saveToStorage(STORAGE_KEYS.plants, PLANTA_AISA);
    saveToStorage(STORAGE_KEYS.areas, CENTROS_GESTION);
    saveToStorage(STORAGE_KEYS.machines, EQUIPOS);
    saveToStorage(STORAGE_KEYS.components, COMPONENTES);
    saveToStorage(STORAGE_KEYS.lubricants, LUBRICANTES);
    saveToStorage(STORAGE_KEYS.frequencies, FRECUENCIAS);
    saveToStorage(STORAGE_KEYS.lubricationPoints, PUNTOS_LUBRICACION);
    saveToStorage(STORAGE_KEYS.users, DEFAULT_USERS);

    // Generate work orders for the current week
    generateWeeklyWorkOrders();

    localStorage.setItem(STORAGE_KEYS.initialized, 'true');
}

function generateWeeklyWorkOrders(): void {
    const workOrders: WorkOrder[] = [];
    const tasks: Task[] = [];
    const points = PUNTOS_LUBRICACION;
    const frequencies = FRECUENCIAS;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Generar desde el 20 de enero hasta el 31 de enero 2026 (solo días relevantes)
    const startDate = new Date(2026, 0, 20); // 20 enero 2026
    const endDate = new Date(2026, 0, 31);   // 31 enero 2026
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dateStr = date.toISOString().split('T')[0];
        const dayOfWeek = date.getDay();
        const dateOnly = new Date(date);
        dateOnly.setHours(0, 0, 0, 0);
        const isPast = dateOnly < today; // Solo marcar como completado si realmente pasó

        const dailyPoints = points.filter((p: LubricationPoint) => {
            const freq = frequencies.find((f: Frequency) => f.id === p.frequencyId);
            if (!freq) return false;
            
            // Diario (cada 8 horas)
            if (freq.days === 1) return true;
            
            // Día por medio
            if (freq.days === 2 && date.getDate() % 2 === 1) return true;
            
            // Semanal (cada 40 horas) - Lunes
            if (freq.days === 7 && dayOfWeek === 1) return true;
            
            // Quincenal (cada 160 horas) - 1er y 15to día del mes
            if (freq.days === 14 && (date.getDate() === 1 || date.getDate() === 15)) return true;
            
            // Mensual - 1er día del mes
            if (freq.days === 30 && date.getDate() === 1) return true;
            
            return false;
        });

        if (dailyPoints.length > 0) {
            const woId = `wo-${dateStr}`;
            workOrders.push({
                id: woId,
                scheduledDate: dateStr,
                status: isPast ? 'completado' : 'pendiente',
                technicianId: 'user-2',
                createdAt: new Date().toISOString(),
                completedAt: isPast ? new Date().toISOString() : undefined,
            });

            dailyPoints.forEach((point: LubricationPoint) => {
                tasks.push({
                    id: `task-${woId}-${point.id}`,
                    workOrderId: woId,
                    lubricationPointId: point.id,
                    status: isPast ? 'completado' : 'pendiente',
                    quantityUsed: isPast ? point.quantity : undefined,
                    completedAt: isPast ? new Date().toISOString() : undefined,
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
    getPlants: (): Plant[] => getFromStorage(STORAGE_KEYS.plants, PLANTA_AISA),

    // Areas
    getAreas: (plantId?: string): Area[] => {
        const areas = getFromStorage(STORAGE_KEYS.areas, CENTROS_GESTION);
        return plantId ? areas.filter(a => a.plantId === plantId) : areas;
    },

    // Machines
    getMachines: (areaId?: string): Machine[] => {
        const machines = getFromStorage(STORAGE_KEYS.machines, EQUIPOS);
        return areaId ? machines.filter(m => m.areaId === areaId) : machines;
    },

    // Components
    getComponents: (machineId?: string): Component[] => {
        const components = getFromStorage(STORAGE_KEYS.components, COMPONENTES);
        return machineId ? components.filter(c => c.machineId === machineId) : components;
    },

    // Lubricants
    getLubricants: (): Lubricant[] => getFromStorage(STORAGE_KEYS.lubricants, LUBRICANTES),
    addLubricant: (data: Omit<Lubricant, 'id' | 'createdAt'>): Lubricant => {
        const lubricants = getFromStorage(STORAGE_KEYS.lubricants, LUBRICANTES);
        const newLub: Lubricant = { ...data, id: generateId(), createdAt: new Date().toISOString() };
        saveToStorage(STORAGE_KEYS.lubricants, [...lubricants, newLub]);
        return newLub;
    },

    // Frequencies
    getFrequencies: (): Frequency[] => getFromStorage(STORAGE_KEYS.frequencies, FRECUENCIAS),

    // Lubrication Points
    getLubricationPoints: (componentId?: string): LubricationPoint[] => {
        const points = getFromStorage(STORAGE_KEYS.lubricationPoints, PUNTOS_LUBRICACION);
        return componentId ? points.filter(p => p.componentId === componentId) : points;
    },
    addLubricationPoint: (data: Omit<LubricationPoint, 'id' | 'createdAt'>): LubricationPoint => {
        const points = getFromStorage(STORAGE_KEYS.lubricationPoints, PUNTOS_LUBRICACION);
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
        const plants = getFromStorage(STORAGE_KEYS.plants, PLANTA_AISA);
        const newPlant: Plant = { ...data, id: generateId(), createdAt: new Date().toISOString() };
        saveToStorage(STORAGE_KEYS.plants, [...plants, newPlant]);
        return newPlant;
    },
    addArea: (data: Omit<Area, 'id' | 'createdAt'>): Area => {
        const areas = getFromStorage(STORAGE_KEYS.areas, CENTROS_GESTION);
        const newArea: Area = { ...data, id: generateId(), createdAt: new Date().toISOString() };
        saveToStorage(STORAGE_KEYS.areas, [...areas, newArea]);
        return newArea;
    },
    addMachine: (data: Omit<Machine, 'id' | 'createdAt'>): Machine => {
        const machines = getFromStorage(STORAGE_KEYS.machines, EQUIPOS);
        const newMachine: Machine = { ...data, id: generateId(), createdAt: new Date().toISOString() };
        saveToStorage(STORAGE_KEYS.machines, [...machines, newMachine]);
        return newMachine;
    },
    addComponent: (data: Omit<Component, 'id' | 'createdAt'>): Component => {
        const components = getFromStorage(STORAGE_KEYS.components, COMPONENTES);
        const newComponent: Component = { ...data, id: generateId(), createdAt: new Date().toISOString() };
        saveToStorage(STORAGE_KEYS.components, [...components, newComponent]);
        return newComponent;
    },

    // Counts for dashboard
    getCounts: () => {
        initializeData();
        return {
            plants: getFromStorage(STORAGE_KEYS.plants, PLANTA_AISA).length,
            areas: getFromStorage(STORAGE_KEYS.areas, CENTROS_GESTION).length,
            machines: getFromStorage(STORAGE_KEYS.machines, EQUIPOS).length,
            components: getFromStorage(STORAGE_KEYS.components, COMPONENTES).length,
            lubricationPoints: getFromStorage(STORAGE_KEYS.lubricationPoints, PUNTOS_LUBRICACION).length,
            lubricants: getFromStorage(STORAGE_KEYS.lubricants, LUBRICANTES).length,
        };
    },
};
