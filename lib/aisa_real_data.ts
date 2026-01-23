// ============================================================
// AISA REAL DATA - Extracted from Excel Planillas
// Source: PLAN_DETALLADO_LUBRICACION_AISA.xlsx
//         PROGRAMA_LUBRICACION_ENERO_2026.xlsx
// ============================================================

import type { Plant, Area, Machine, Component, Lubricant, Frequency, LubricationPoint } from './types';

// ============================================================
// PLANTAS Y ÁREAS REALES
// ============================================================

export const AISA_PLANTS: Plant[] = [
  { id: 'plant-aisa', name: 'Aserradero AISA', createdAt: new Date().toISOString() },
];

export const AISA_AREAS: Area[] = [
  { id: 'area-cg611', plantId: 'plant-aisa', name: 'CG 611 - Descortezado', createdAt: new Date().toISOString() },
  { id: 'area-cg612', plantId: 'plant-aisa', name: 'CG 612 - Aserrío Principal', createdAt: new Date().toISOString() },
];

// ============================================================
// MÁQUINAS REALES (del Plan Detallado Cap 9)
// ============================================================

export const AISA_MACHINES: Machine[] = [
  // CG 611 - Descortezado
  { id: 'maq-8001', areaId: 'area-cg611', name: '8001 - Descortezador Línea Gruesa', make: 'AISA', createdAt: new Date().toISOString() },
  { id: 'maq-8002', areaId: 'area-cg611', name: '8002 - Descortezador Línea Delgada', make: 'AISA', createdAt: new Date().toISOString() },
  // CG 612 - Aserrío
  { id: 'maq-canter', areaId: 'area-cg612', name: '9.1 Canter 1 y 2', make: 'LINCK', createdAt: new Date().toISOString() },
  { id: 'maq-perfiladora', areaId: 'area-cg612', name: '9.2 Perfiladora LINCK', make: 'LINCK', createdAt: new Date().toISOString() },
  { id: 'maq-wd', areaId: 'area-cg612', name: '9.3 Sistema WD', make: 'WD', createdAt: new Date().toISOString() },
];

// ============================================================
// COMPONENTES REALES (del Plan Detallado)
// ============================================================

export const AISA_COMPONENTS: Component[] = [
  // 8001 - Descortezador Línea Gruesa
  { id: 'comp-8001-cadenas', machineId: 'maq-8001', name: 'Cadenas Descortezador LG', createdAt: new Date().toISOString() },
  { id: 'comp-8001-alim', machineId: 'maq-8001', name: 'Cadenas alimentación LG', createdAt: new Date().toISOString() },
  { id: 'comp-8001-central', machineId: 'maq-8001', name: 'Central hidráulica LG', createdAt: new Date().toISOString() },
  
  // 8002 - Descortezador Línea Delgada
  { id: 'comp-8002-cuchillos', machineId: 'maq-8002', name: 'Cuchillos Descortezador LD', createdAt: new Date().toISOString() },
  { id: 'comp-8002-cadenas', machineId: 'maq-8002', name: 'Cadenas Descortezador LD', createdAt: new Date().toISOString() },
  { id: 'comp-8002-central-izq', machineId: 'maq-8002', name: 'Central hidráulica DAG izq.', createdAt: new Date().toISOString() },
  { id: 'comp-8002-central-der', machineId: 'maq-8002', name: 'Central hidráulica DAG der.', createdAt: new Date().toISOString() },
  
  // 9.1 Canter - Transmisión
  { id: 'comp-canter-eje', machineId: 'maq-canter', name: 'Eje estriado', createdAt: new Date().toISOString() },
  { id: 'comp-canter-polea-trans', machineId: 'maq-canter', name: 'Rodamiento polea transmisión', createdAt: new Date().toISOString() },
  { id: 'comp-canter-polea-dent', machineId: 'maq-canter', name: 'Rodamiento polea dentada', createdAt: new Date().toISOString() },
  { id: 'comp-canter-polea-tens', machineId: 'maq-canter', name: 'Rodamiento polea tensora', createdAt: new Date().toISOString() },
  { id: 'comp-canter-cardan', machineId: 'maq-canter', name: 'Cardan de transmisión', createdAt: new Date().toISOString() },
  { id: 'comp-canter-eje-rod', machineId: 'maq-canter', name: 'Eje de rodillos', createdAt: new Date().toISOString() },
  { id: 'comp-canter-rod-vert', machineId: 'maq-canter', name: 'Rodamiento rodillos vert.', createdAt: new Date().toISOString() },
  { id: 'comp-canter-reductor', machineId: 'maq-canter', name: 'Reductores de avance', createdAt: new Date().toISOString() },
  
  // 9.2 Perfiladora LINCK
  { id: 'comp-perf-guias', machineId: 'maq-perfiladora', name: 'Guías lineales BV y ejes HV', createdAt: new Date().toISOString() },
  { id: 'comp-perf-guia-ajuste', machineId: 'maq-perfiladora', name: 'Guía de ajuste', createdAt: new Date().toISOString() },
  { id: 'comp-perf-eje-conexion', machineId: 'maq-perfiladora', name: 'Eje de conexión', createdAt: new Date().toISOString() },
  { id: 'comp-perf-husillo', machineId: 'maq-perfiladora', name: 'Husillo roscado trapezoidal', createdAt: new Date().toISOString() },
  { id: 'comp-perf-acople', machineId: 'maq-perfiladora', name: 'Acople eje estriado', createdAt: new Date().toISOString() },
  { id: 'comp-perf-pinones', machineId: 'maq-perfiladora', name: 'Piñones (sprockets)', createdAt: new Date().toISOString() },
  { id: 'comp-perf-sinfin', machineId: 'maq-perfiladora', name: 'Engranaje sinfín', createdAt: new Date().toISOString() },
  { id: 'comp-perf-rodillos', machineId: 'maq-perfiladora', name: 'Rodillos de guía', createdAt: new Date().toISOString() },
  { id: 'comp-perf-polea', machineId: 'maq-perfiladora', name: 'Polea eje estriado', createdAt: new Date().toISOString() },
  { id: 'comp-perf-profiler', machineId: 'maq-perfiladora', name: 'Perfiladora (profiler)', createdAt: new Date().toISOString() },
  { id: 'comp-perf-husillo-bolas', machineId: 'maq-perfiladora', name: 'Husillo de bolas', createdAt: new Date().toISOString() },
  { id: 'comp-perf-rod-central', machineId: 'maq-perfiladora', name: 'Rodamiento central BV', createdAt: new Date().toISOString() },
  { id: 'comp-perf-rod-bv', machineId: 'maq-perfiladora', name: 'Rodamientos BV-HV-HF', createdAt: new Date().toISOString() },
  
  // 9.3 WD
  { id: 'comp-wd-coj-sup', machineId: 'maq-wd', name: 'Cojinete rodillos avance sup.', createdAt: new Date().toISOString() },
  { id: 'comp-wd-coj-inf', machineId: 'maq-wd', name: 'Cojinete rodillos avance inf.', createdAt: new Date().toISOString() },
  { id: 'comp-wd-husillo', machineId: 'maq-wd', name: 'Cojinete husillo reg. guía madera', createdAt: new Date().toISOString() },
];

// ============================================================
// LUBRICANTES REALES
// ============================================================

export const AISA_LUBRICANTS: Lubricant[] = [
  { id: 'lub-grasa-i-ii', name: 'Grasa I y II', type: 'grasa', createdAt: new Date().toISOString() },
  { id: 'lub-aceite-150', name: 'Aceite 150', type: 'aceite', viscosity: '150', createdAt: new Date().toISOString() },
  { id: 'lub-kp2k', name: 'Grasa KP2K', type: 'grasa', nlgiGrade: '2', createdAt: new Date().toISOString() },
  { id: 'lub-nbu15', name: 'ISOFLEX NBU 15', type: 'grasa', nlgiGrade: '1.5', createdAt: new Date().toISOString() },
  { id: 'lub-aceite-hidraulico', name: 'Aceite Hidráulico', type: 'aceite', createdAt: new Date().toISOString() },
];

// ============================================================
// FRECUENCIAS REALES (del Plan Detallado)
// ============================================================

export const AISA_FREQUENCIES: Frequency[] = [
  { id: 'freq-8hrs', name: 'Cada 8 horas (Diario)', days: 1, createdAt: new Date().toISOString() },
  { id: 'freq-40hrs', name: 'Cada 40 horas (Semanal)', days: 5, createdAt: new Date().toISOString() },
  { id: 'freq-160hrs', name: 'Cada 160 horas (Quincenal)', days: 20, createdAt: new Date().toISOString() },
  { id: 'freq-mensual', name: 'Mensual', days: 30, createdAt: new Date().toISOString() },
  { id: 'freq-trimestral', name: 'Cada 3 meses', days: 90, createdAt: new Date().toISOString() },
  { id: 'freq-semestral', name: 'Cada 6 meses', days: 180, createdAt: new Date().toISOString() },
  { id: 'freq-anual', name: 'Anual', days: 365, createdAt: new Date().toISOString() },
  { id: 'freq-7000hrs', name: 'Cada 7000 horas', days: 875, createdAt: new Date().toISOString() },
];

// ============================================================
// PUNTOS DE LUBRICACIÓN REALES
// ============================================================

export const AISA_LUBRICATION_POINTS: LubricationPoint[] = [
  // DESCORTEZADO - Tareas Diarias
  { id: 'lp-8001-1', componentId: 'comp-8001-cadenas', code: '3100', description: 'Aceitado cadenas descortezador LG', lubricantId: 'lub-aceite-hidraulico', method: 'manual', quantity: 50, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  { id: 'lp-8001-2', componentId: 'comp-8001-alim', code: '3200', description: 'Aceitado cadenas alimentación LG', lubricantId: 'lub-aceite-hidraulico', method: 'manual', quantity: 50, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  { id: 'lp-8001-3', componentId: 'comp-8001-central', code: '3002', description: 'Verificar nivel central hidráulica LG', lubricantId: 'lub-aceite-hidraulico', method: 'verificar', quantity: 0, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  { id: 'lp-8002-1', componentId: 'comp-8002-cuchillos', code: '2100-A', description: 'Engrasado cuchillos descortezador LD', lubricantId: 'lub-grasa-i-ii', method: 'engrasado', quantity: 30, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  { id: 'lp-8002-2', componentId: 'comp-8002-cadenas', code: '2100-B', description: 'Aceitado cadenas descortezador LD', lubricantId: 'lub-aceite-hidraulico', method: 'manual', quantity: 50, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  { id: 'lp-8002-3', componentId: 'comp-8002-central-izq', code: '1350', description: 'Verificar nivel central DAG izq.', lubricantId: 'lub-aceite-hidraulico', method: 'verificar', quantity: 0, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  { id: 'lp-8002-4', componentId: 'comp-8002-central-der', code: '1810', description: 'Verificar nivel central DAG der.', lubricantId: 'lub-aceite-hidraulico', method: 'verificar', quantity: 0, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  
  // CANTER 1 y 2 - Transmisión (9.1.1)
  { id: 'lp-canter-1', componentId: 'comp-canter-eje', code: '9.1.1-B', description: 'Engrasado eje estriado', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 120, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  { id: 'lp-canter-2', componentId: 'comp-canter-polea-trans', code: '9.1.1-A', description: 'Rodamiento polea transmisión', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 100, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },
  { id: 'lp-canter-3', componentId: 'comp-canter-polea-dent', code: '9.1.1-C', description: 'Rodamiento polea dentada', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 200, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },
  { id: 'lp-canter-4', componentId: 'comp-canter-polea-tens', code: '9.1.1-D', description: 'Rodamiento polea tensora', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 80, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },
  
  // CANTER - Rodillos de Avance (9.1.2)
  { id: 'lp-canter-5', componentId: 'comp-canter-cardan', code: '9.1.2-B', description: 'Cardan de transmisión (4 pts)', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 80, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
  { id: 'lp-canter-6', componentId: 'comp-canter-eje-rod', code: '9.1.2-C', description: 'Eje de rodillos (2 pts)', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 80, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
  { id: 'lp-canter-7', componentId: 'comp-canter-rod-vert', code: '9.1.2-D', description: 'Rodamiento rodillos vert. (4 pts)', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 80, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
  { id: 'lp-canter-8', componentId: 'comp-canter-reductor', code: '9.1.2-A', description: 'Reductores de avance (2 pts)', lubricantId: 'lub-aceite-150', method: 'nivel', quantity: 1900, frequencyId: 'freq-7000hrs', createdAt: new Date().toISOString() },
  
  // PERFILADORA LINCK - Cada 8 hrs (9.2.1)
  { id: 'lp-perf-1', componentId: 'comp-perf-guias', code: '9.2.1-10', description: 'Guías lineales BV y ejes HV (16 pts)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  
  // PERFILADORA - Cada 40 hrs (9.2.2)
  { id: 'lp-perf-2', componentId: 'comp-perf-guia-ajuste', code: '9.2.2-4', description: 'Guía de ajuste (2 pts)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
  { id: 'lp-perf-3', componentId: 'comp-perf-eje-conexion', code: '9.2.2-5', description: 'Eje de conexión (8 pts)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
  { id: 'lp-perf-4', componentId: 'comp-perf-husillo', code: '9.2.2-7', description: 'Husillo roscado trapezoidal (2 pts)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
  { id: 'lp-perf-5', componentId: 'comp-perf-acople', code: '9.2.2-8', description: 'Acople eje estriado (4 pts)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
  { id: 'lp-perf-6', componentId: 'comp-perf-pinones', code: '9.2.2-14', description: 'Piñones (sprockets) (2 pts)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
  { id: 'lp-perf-7', componentId: 'comp-perf-sinfin', code: '9.2.2-17', description: 'Engranaje sinfín (4 pts)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
  
  // PERFILADORA - Cada 160 hrs (9.2.3)
  { id: 'lp-perf-8', componentId: 'comp-perf-rodillos', code: '9.2.3-1', description: 'Rodillos de guía (2 pts)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-160hrs', createdAt: new Date().toISOString() },
  { id: 'lp-perf-9', componentId: 'comp-perf-polea', code: '9.2.3-6', description: 'Polea eje estriado (6 pts)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-160hrs', createdAt: new Date().toISOString() },
  { id: 'lp-perf-10', componentId: 'comp-perf-profiler', code: '9.2.3-9', description: 'Perfiladora profiler (8 pts)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-160hrs', createdAt: new Date().toISOString() },
  { id: 'lp-perf-11', componentId: 'comp-perf-husillo-bolas', code: '9.2.3-11', description: 'Husillo de bolas (6 pts)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 5, frequencyId: 'freq-160hrs', createdAt: new Date().toISOString() },
  { id: 'lp-perf-12', componentId: 'comp-perf-rod-central', code: '9.2.3-12', description: 'Rodamiento central BV (2 pts)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-160hrs', createdAt: new Date().toISOString() },
  { id: 'lp-perf-13', componentId: 'comp-perf-rod-bv', code: '9.2.3-13', description: 'Rodamientos BV-HV-HF (12 pts)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-160hrs', createdAt: new Date().toISOString() },
  
  // WD - H84 (9.3.1)
  { id: 'lp-wd-1', componentId: 'comp-wd-coj-sup', code: '9.3.1-1', description: 'Cojinete rodillos avance sup.', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-wd-2', componentId: 'comp-wd-coj-inf', code: '9.3.1-2', description: 'Cojinete rodillos avance inf.', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-wd-3', componentId: 'comp-wd-husillo', code: '9.3.1-3', description: 'Cojinete husillo reg. guía madera', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-semestral', createdAt: new Date().toISOString() },
];

// ============================================================
// RESUMEN DE DATOS
// ============================================================

export const DATA_SUMMARY = {
  totalPlants: AISA_PLANTS.length,
  totalAreas: AISA_AREAS.length,
  totalMachines: AISA_MACHINES.length,
  totalComponents: AISA_COMPONENTS.length,
  totalLubricationPoints: AISA_LUBRICATION_POINTS.length,
  totalLubricants: AISA_LUBRICANTS.length,
  
  // Tareas por frecuencia
  dailyTasks: AISA_LUBRICATION_POINTS.filter(lp => lp.frequencyId === 'freq-8hrs').length,
  weeklyTasks: AISA_LUBRICATION_POINTS.filter(lp => lp.frequencyId === 'freq-40hrs').length,
  biweeklyTasks: AISA_LUBRICATION_POINTS.filter(lp => lp.frequencyId === 'freq-160hrs').length,
  monthlyTasks: AISA_LUBRICATION_POINTS.filter(lp => lp.frequencyId === 'freq-mensual').length,
};
