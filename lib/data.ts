// ============================================================
// AISA LUBRICATION DATA SERVICE
// Fuente: PROGRAMA_LUBRICACION_ENERO_2026.xlsx
//         PLAN_DETALLADO_LUBRICACION_AISA.xlsx
// ============================================================

import type { Plant, Area, Machine, Component, Lubricant, Frequency, LubricationPoint, WorkOrder, Task, Anomaly, User } from './types';
import { PLANTA_AISA, CENTROS_GESTION, EQUIPOS, COMPONENTES, LUBRICANTES, FRECUENCIAS, PUNTOS_LUBRICACION } from './datos_completos_aisa';
import { FORESA_EQUIPMENT_DATA, LUBRICATION_POINTS as NEW_POINTS } from './equipment-data';

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
    { id: 'user-dev-1', name: 'Desarrollador AISA', email: 'dev@aisa.cl', role: 'desarrollador', createdAt: new Date().toISOString() },
    { id: 'user-lub-1', name: 'Omar Alexis', email: 'omar@aisa.cl', role: 'lubricador', createdAt: new Date().toISOString() },
    { id: 'user-sup-1', name: 'Enrique Gonzáles M.', email: 'supervisor@aisa.cl', role: 'supervisor', createdAt: new Date().toISOString() },
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

// Versión de datos - incrementar para forzar reset en clientes
const DATA_VERSION = 'v4.0.0-grimme-force';

function initializeData(): void {
    if (typeof window === 'undefined') return;

    // FORZAR RESET TOTAL - siempre limpiar y recargar datos frescos
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
    localStorage.removeItem('aisa_data_version');
    localStorage.removeItem('aisa_data_initialized_v12');

    // Usar datos reales del programa AISA
    const existingPlants = PLANTA_AISA;
    const existingAreas = CENTROS_GESTION;
    const existingMachines = EQUIPOS;
    // ... items existing

    // IMPORTAR DATOS EXTRACTADOS DE WHATSAPP (EQUIPMENT-DATA)
    // IMPORTAR DATOS EXTRACTADOS DE WHATSAPP (EQUIPMENT-DATA)
    // (Importado arriba)

    // Transformar y fusionar datos Foresa

    // Transformar y fusionar datos Foresa
    const newPlants: any[] = [];
    const newAreas: any[] = [];
    const newMachines: any[] = [];
    const newComponents: any[] = [];
    const newPoints: any[] = [];

    FORESA_EQUIPMENT_DATA.forEach((mc: any) => {
        // Management Center -> Plant/Area Group
        const plantId = `plant-${mc.code}`;
        newPlants.push({ id: plantId, name: mc.name, createdAt: new Date().toISOString() });

        mc.costCenters.forEach((cc: any) => {
            const areaId = `area-${cc.code}`;
            newAreas.push({ id: areaId, plantId: plantId, name: cc.name, code: cc.code, createdAt: new Date().toISOString() });

            cc.equipment.forEach((eq: any) => {
                const machineId = `mac-${eq.code}`;
                newMachines.push({
                    id: machineId,
                    areaId: areaId,
                    name: eq.name,
                    code: eq.code,
                    createdAt: new Date().toISOString()
                });

                // Crear componente default "General" o "Principal"
                const compId = `comp-${eq.code}`;
                newComponents.push({
                    id: compId,
                    machineId: machineId,
                    name: 'Principal',
                    createdAt: new Date().toISOString()
                });

                // Asignar puntos de lubricación
                // (Simplificación: Asignamos puntos "estándar" a cada máquina nueva para demostración)
                NEW_POINTS.slice(0, 3).forEach((p: any, idx: number) => {
                    newPoints.push({
                        id: `lp-${eq.code}-${idx}`,
                        componentId: compId,
                        code: `L${idx + 1}`,
                        description: p.description,
                        lubricantId: 'lub-1', // Default
                        frequencyId: 'freq-sem', // Semanal
                        method: 'manual',
                        quantity: 10,
                        createdAt: new Date().toISOString()
                    });
                });
            });
        });
    });

    saveToStorage(STORAGE_KEYS.plants, [...PLANTA_AISA, ...newPlants]);
    saveToStorage(STORAGE_KEYS.areas, [...CENTROS_GESTION, ...newAreas]);
    saveToStorage(STORAGE_KEYS.machines, [...EQUIPOS, ...newMachines]);
    saveToStorage(STORAGE_KEYS.components, [...COMPONENTES, ...newComponents]);
    saveToStorage(STORAGE_KEYS.lubricants, LUBRICANTES);
    saveToStorage(STORAGE_KEYS.frequencies, FRECUENCIAS);
    saveToStorage(STORAGE_KEYS.lubricationPoints, [...PUNTOS_LUBRICACION, ...newPoints]);
    saveToStorage(STORAGE_KEYS.users, DEFAULT_USERS);

    // Generate work orders for the current week - TODAS PENDIENTES
    generateWeeklyWorkOrders();

    localStorage.setItem(STORAGE_KEYS.initialized, 'true');
    localStorage.setItem('aisa_data_version', DATA_VERSION);
}

// Phase 3: Sync from Real API
async function syncFromApi(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
        const response = await fetch('/api/sync/pull');
        if (!response.ok) throw new Error('Failed to fetch from API');

        const { data } = await response.json();

        // Save REAL data to local storage (Client Cache)
        if (data.users?.length) saveToStorage(STORAGE_KEYS.users, data.users);
        if (data.plants?.length) saveToStorage(STORAGE_KEYS.plants, data.plants);
        if (data.areas?.length) saveToStorage(STORAGE_KEYS.areas, data.areas);
        if (data.machines?.length) saveToStorage(STORAGE_KEYS.machines, data.machines);
        if (data.components?.length) saveToStorage(STORAGE_KEYS.components, data.components);
        if (data.lubricants?.length) saveToStorage(STORAGE_KEYS.lubricants, data.lubricants);
        if (data.frequencies?.length) saveToStorage(STORAGE_KEYS.frequencies, data.frequencies);
        if (data.lubricationPoints?.length) saveToStorage(STORAGE_KEYS.lubricationPoints, data.lubricationPoints);

        console.log('🔄 Data synchronized from SQLite API');
    } catch (err) {
        console.error('Offline or API Error, using cached/mock data:', err);
    }
}

function generateWeeklyWorkOrders(): void {
    const workOrders: WorkOrder[] = [];
    const tasks: Task[] = [];
    const points = PUNTOS_LUBRICACION;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateStr = today.toISOString().split('T')[0];

    // HOY: Crear orden de trabajo con las 3 tareas específicas
    const woId = `wo-${dateStr}`;
    workOrders.push({
        id: woId,
        scheduledDate: dateStr,
        status: 'pendiente',
        technicianId: 'user-lub-1',
        createdAt: new Date().toISOString(),
    });

    // 3 TAREAS DEL SÁBADO 24 ENERO 2026
    const tareasHoy = [
        'lp-3000-rotor',      // Cambio aceite rotor descortezador LG
        'lp-grimme-ejes',     // Engrasar ejes Grimme
        'lp-8001-rodamientos' // Engrasar rodamientos y soportes LG
    ];

    tareasHoy.forEach(pointId => {
        const point = points.find((p: LubricationPoint) => p.id === pointId);
        if (point) {
            tasks.push({
                id: `task-${woId}-${point.id}`,
                workOrderId: woId,
                lubricationPointId: point.id,
                status: 'pendiente',
                createdAt: new Date().toISOString(),
            });
            console.log('✅ Tarea creada:', point.id, point.description);
        } else {
            console.log('❌ Punto no encontrado:', pointId);
        }
    });

    saveToStorage(STORAGE_KEYS.workOrders, workOrders);
    saveToStorage(STORAGE_KEYS.tasks, tasks);
    saveToStorage(STORAGE_KEYS.anomalies, []);

    console.log('📋 Orden de trabajo creada:', woId, 'con', tasks.length, 'tareas');
}

export const dataService = {
    init: async () => {
        initializeData();
        await syncFromApi(); // Try to fetch fresh data
    },
    resetData: () => {
        if (typeof window === 'undefined') return;
        Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
        initializeData();
    },

    // Plants
    getPlants: (): Plant[] => getFromStorage(STORAGE_KEYS.plants, PLANTA_AISA),

    // Areas
    getAreas: (plantId?: string, userContext?: User): Area[] => {
        const areas = getFromStorage(STORAGE_KEYS.areas, CENTROS_GESTION);
        let filtered = areas;

        // Filter by Plant
        if (plantId) {
            filtered = filtered.filter(a => a.plantId === plantId);
        }

        // Filter by Contractor (if user is external supervisor)
        if (userContext?.role === 'supervisor_ext' && userContext.contractorId) {
            filtered = filtered.filter(a => a.contractorId === userContext.contractorId);
        }

        return filtered;
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

    // Inventory (Mock Implementation)
    getInventory: (): import('./types').InventoryItem[] => {
        const lubricants = getFromStorage<Lubricant>(STORAGE_KEYS.lubricants, LUBRICANTES);
        // Generar inventario mock derivado de los lubricantes si no existe
        return lubricants.map(lub => ({
            id: `inv-${lub.id}`,
            lubricantId: lub.id,
            quantity: Math.floor(Math.random() * 200) + 50, // Mock stock
            minStock: 50,
            maxStock: 500,
            location: 'Bodega Central',
            lastUpdated: new Date().toISOString(),
        }));
    },

    // IoT (Mock Implementation)
    getSensors: (): import('./types').Sensor[] => {
        const machines = getFromStorage(STORAGE_KEYS.machines, EQUIPOS);
        return machines.slice(0, 5).map((m, idx) => ({
            id: `sens-${m.id}`,
            machineId: m.id,
            type: idx % 2 === 0 ? 'vibration' : 'temperature',
            status: Math.random() > 0.8 ? 'alert' : 'online',
            lastReading: idx % 2 === 0 ? (2 + Math.random()) : (45 + Math.random() * 10),
            unit: idx % 2 === 0 ? 'mm/s' : '°C',
            createdAt: new Date().toISOString(),
        }));
    },
};
