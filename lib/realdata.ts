// Complete AISA Lubrication Data - All 55 Points + 42 Tasks
// Source: MANUAL_TECNICO_LUBRICACION_INDUSTRIAL_AISA_2026.pdf

import type { Machine, Component, Lubricant, Frequency, LubricationPoint } from './types';

// ============================================================
// ADDITIONAL MACHINES (WD System)
// ============================================================
export const WD_MACHINES: Machine[] = [
  { id: 'maq-wd-h84', areaId: 'area-cg612', name: 'WD - H84 Rodillos de Avance', make: 'WD', createdAt: new Date().toISOString() },
  { id: 'maq-wd-fr10', areaId: 'area-cg612', name: 'WD - FR10 Cilindros y Sierra', make: 'WD', createdAt: new Date().toISOString() },
  { id: 'maq-wd-fv20', areaId: 'area-cg612', name: 'WD - FV20 Husillos y Cajas', make: 'WD', createdAt: new Date().toISOString() },
];

// ============================================================
// ADDITIONAL COMPONENTS (WD System)  
// ============================================================
export const WD_COMPONENTS: Component[] = [
  // H84 Rodillos de Avance
  { id: 'comp-h84-1', machineId: 'maq-wd-h84', name: 'Cojinete rodillos avance superior', createdAt: new Date().toISOString() },
  { id: 'comp-h84-2', machineId: 'maq-wd-h84', name: 'Cojinete rodillos avance inferior', createdAt: new Date().toISOString() },
  { id: 'comp-h84-3', machineId: 'maq-wd-h84', name: 'Cojinete husillo reg. guía madera', createdAt: new Date().toISOString() },
  // FR10 Cilindros y Sierra
  { id: 'comp-fr10-1', machineId: 'maq-wd-fr10', name: 'Cojinetes cilindro inf. Extracción', createdAt: new Date().toISOString() },
  { id: 'comp-fr10-2', machineId: 'maq-wd-fr10', name: 'Cojinete estribo cilindro Extracción', createdAt: new Date().toISOString() },
  { id: 'comp-fr10-3', machineId: 'maq-wd-fr10', name: 'Cojinete cilindro sup. Extracción', createdAt: new Date().toISOString() },
  { id: 'comp-fr10-4', machineId: 'maq-wd-fr10', name: 'Cojinete bisagra puerta', createdAt: new Date().toISOString() },
  { id: 'comp-fr10-5', machineId: 'maq-wd-fr10', name: 'Cojinete cilindros sup. Introducción', createdAt: new Date().toISOString() },
  { id: 'comp-fr10-6', machineId: 'maq-wd-fr10', name: 'Cojinete estribo cilindros Introducción', createdAt: new Date().toISOString() },
  { id: 'comp-fr10-7', machineId: 'maq-wd-fr10', name: 'Cojinete cilindros inf. Introducción', createdAt: new Date().toISOString() },
  { id: 'comp-fr10-8', machineId: 'maq-wd-fr10', name: 'Cojinete husillo reg. guía', createdAt: new Date().toISOString() },
  { id: 'comp-fr10-9', machineId: 'maq-wd-fr10', name: 'Cojinete árbol cardan rodillo avance', createdAt: new Date().toISOString() },
  { id: 'comp-fr10-10', machineId: 'maq-wd-fr10', name: 'Cojinete árbol cardan y árbol sierra', createdAt: new Date().toISOString() },
  { id: 'comp-fr10-11', machineId: 'maq-wd-fr10', name: 'Empaquetadura laberíntica árbol sierra', createdAt: new Date().toISOString() },
  { id: 'comp-fr10-12', machineId: 'maq-wd-fr10', name: 'Cojinete árbol sierra inferior', createdAt: new Date().toISOString() },
  { id: 'comp-fr10-13', machineId: 'maq-wd-fr10', name: 'Cojinete árbol sierra exterior', createdAt: new Date().toISOString() },
  // FV20 Husillos y Cajas
  { id: 'comp-fv20-1', machineId: 'maq-wd-fv20', name: 'Cojinetes husillo ajuste soporte fijador', createdAt: new Date().toISOString() },
  { id: 'comp-fv20-2', machineId: 'maq-wd-fv20', name: 'Caja de bolas 1', createdAt: new Date().toISOString() },
  { id: 'comp-fv20-3', machineId: 'maq-wd-fv20', name: 'Caja de bolas 2', createdAt: new Date().toISOString() },
  { id: 'comp-fv20-4', machineId: 'maq-wd-fv20', name: 'Caja de bolas 3', createdAt: new Date().toISOString() },
  { id: 'comp-fv20-5', machineId: 'maq-wd-fv20', name: 'Rodillo presión soporte fijador', createdAt: new Date().toISOString() },
  { id: 'comp-fv20-6', machineId: 'maq-wd-fv20', name: 'Husillo de regulación 1', createdAt: new Date().toISOString() },
  { id: 'comp-fv20-7', machineId: 'maq-wd-fv20', name: 'Cojinete husillo guía madera 1', createdAt: new Date().toISOString() },
  { id: 'comp-fv20-8', machineId: 'maq-wd-fv20', name: 'Husillo de regulación 2', createdAt: new Date().toISOString() },
  { id: 'comp-fv20-9', machineId: 'maq-wd-fv20', name: 'Cojinete husillo guía madera 2', createdAt: new Date().toISOString() },
  { id: 'comp-fv20-10', machineId: 'maq-wd-fv20', name: 'Cojinete de cilindros 1', createdAt: new Date().toISOString() },
  { id: 'comp-fv20-11', machineId: 'maq-wd-fv20', name: 'Cojinete de cilindros 2', createdAt: new Date().toISOString() },
  { id: 'comp-fv20-12', machineId: 'maq-wd-fv20', name: 'Motor sierra 1', createdAt: new Date().toISOString() },
  { id: 'comp-fv20-13', machineId: 'maq-wd-fv20', name: 'Motor sierra 2', createdAt: new Date().toISOString() },
  { id: 'comp-fv20-14', machineId: 'maq-wd-fv20', name: 'Tope de línea cero', createdAt: new Date().toISOString() },
  { id: 'comp-fv20-15', machineId: 'maq-wd-fv20', name: 'Empaquetadura laberíntica', createdAt: new Date().toISOString() },
  { id: 'comp-fv20-16', machineId: 'maq-wd-fv20', name: 'Cojinete interior árbol sierra', createdAt: new Date().toISOString() },
  { id: 'comp-fv20-17', machineId: 'maq-wd-fv20', name: 'Cojinete exterior árbol sierra', createdAt: new Date().toISOString() },
];

// Additional Perfiladora LINCK components
export const PERFILADORA_COMPONENTS: Component[] = [
  { id: 'comp-perf-acople', machineId: 'maq-perfiladora', name: 'Acople eje estriado', createdAt: new Date().toISOString() },
  { id: 'comp-perf-pinones', machineId: 'maq-perfiladora', name: 'Piñones (sprockets)', createdAt: new Date().toISOString() },
  { id: 'comp-perf-sinfin', machineId: 'maq-perfiladora', name: 'Engranaje sinfín', createdAt: new Date().toISOString() },
  { id: 'comp-perf-rodillos', machineId: 'maq-perfiladora', name: 'Rodillos de guía', createdAt: new Date().toISOString() },
  { id: 'comp-perf-polea', machineId: 'maq-perfiladora', name: 'Polea eje estriado', createdAt: new Date().toISOString() },
  { id: 'comp-perf-profiler', machineId: 'maq-perfiladora', name: 'Perfiladora (profiler)', createdAt: new Date().toISOString() },
  { id: 'comp-perf-husillo-bolas', machineId: 'maq-perfiladora', name: 'Husillo de bolas', createdAt: new Date().toISOString() },
  { id: 'comp-perf-rod-central', machineId: 'maq-perfiladora', name: 'Rodamiento central BV', createdAt: new Date().toISOString() },
  { id: 'comp-perf-rod-bv', machineId: 'maq-perfiladora', name: 'Rodamientos BV-HV-HF', createdAt: new Date().toISOString() },
];

// ============================================================
// ADDITIONAL LUBRICANTS
// ============================================================
export const ADDITIONAL_LUBRICANTS: Lubricant[] = [
  { id: 'lub-nbu15', name: 'ISOFLEX NBU 15', type: 'grasa', nlgiGrade: '1.5', createdAt: new Date().toISOString() },
];

// ============================================================
// ADDITIONAL FREQUENCIES
// ============================================================
export const ADDITIONAL_FREQUENCIES: Frequency[] = [
  { id: 'freq-160hrs', name: 'Cada 160 Horas (Quincenal)', days: 20, createdAt: new Date().toISOString() },
  { id: 'freq-trimestral', name: 'Cada 3 Meses (Trimestral)', days: 90, createdAt: new Date().toISOString() },
  { id: 'freq-semestral', name: 'Cada 6 Meses (Semestral)', days: 180, createdAt: new Date().toISOString() },
  { id: 'freq-anual', name: 'Anual', days: 365, createdAt: new Date().toISOString() },
];

// ============================================================
// WD LUBRICATION POINTS (33 additional points)
// ============================================================
export const WD_LUBRICATION_POINTS: LubricationPoint[] = [
  // H84 - 3 points
  { id: 'lp-h84-1', componentId: 'comp-h84-1', code: 'WD-H84-1', description: 'Cojinete rodillos avance sup.', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-h84-2', componentId: 'comp-h84-2', code: 'WD-H84-2', description: 'Cojinete rodillos avance inf.', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-h84-3', componentId: 'comp-h84-3', code: 'WD-H84-3', description: 'Cojinete husillo reg. guía madera', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-semestral', createdAt: new Date().toISOString() },
  // FR10 - 13 points
  { id: 'lp-fr10-1', componentId: 'comp-fr10-1', code: 'WD-FR10-1', description: 'Cojinetes cilindro inf. Extracción', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-fr10-2', componentId: 'comp-fr10-2', code: 'WD-FR10-2', description: 'Cojinete estribo cilindro Extracción', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-semestral', createdAt: new Date().toISOString() },
  { id: 'lp-fr10-3', componentId: 'comp-fr10-3', code: 'WD-FR10-3', description: 'Cojinete cilindro sup. Extracción', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-fr10-4', componentId: 'comp-fr10-4', code: 'WD-FR10-4', description: 'Cojinete bisagra puerta', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-anual', createdAt: new Date().toISOString() },
  { id: 'lp-fr10-5', componentId: 'comp-fr10-5', code: 'WD-FR10-5', description: 'Cojinete cilindros sup. Introducción', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-fr10-6', componentId: 'comp-fr10-6', code: 'WD-FR10-6', description: 'Cojinete estribo cilindros Introducción', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-semestral', createdAt: new Date().toISOString() },
  { id: 'lp-fr10-7', componentId: 'comp-fr10-7', code: 'WD-FR10-7', description: 'Cojinete cilindros inf. Introducción', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-fr10-8', componentId: 'comp-fr10-8', code: 'WD-FR10-8', description: 'Cojinete husillo reg. guía', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-semestral', createdAt: new Date().toISOString() },
  { id: 'lp-fr10-9', componentId: 'comp-fr10-9', code: 'WD-FR10-9', description: 'Cojinete árbol cardan rodillo avance', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-fr10-10', componentId: 'comp-fr10-10', code: 'WD-FR10-10', description: 'Cojinete árbol cardan y árbol sierra', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },
  { id: 'lp-fr10-11', componentId: 'comp-fr10-11', code: 'WD-FR10-11', description: 'Empaquetadura laberíntica árbol sierra', lubricantId: 'lub-nbu15', method: 'manual', quantity: 4, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-fr10-12', componentId: 'comp-fr10-12', code: 'WD-FR10-12', description: 'Cojinete árbol sierra inferior', lubricantId: 'lub-nbu15', method: 'manual', quantity: 10, frequencyId: 'freq-anual', createdAt: new Date().toISOString() },
  { id: 'lp-fr10-13', componentId: 'comp-fr10-13', code: 'WD-FR10-13', description: 'Cojinete árbol sierra exterior', lubricantId: 'lub-nbu15', method: 'manual', quantity: 8, frequencyId: 'freq-anual', createdAt: new Date().toISOString() },
  // FV20 - 17 points
  { id: 'lp-fv20-1', componentId: 'comp-fv20-1', code: 'WD-FV20-1', description: 'Cojinetes husillo ajuste soporte fijador', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-fv20-2', componentId: 'comp-fv20-2', code: 'WD-FV20-2', description: 'Caja de bolas 1', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-fv20-3', componentId: 'comp-fv20-3', code: 'WD-FV20-3', description: 'Caja de bolas 2', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-fv20-4', componentId: 'comp-fv20-4', code: 'WD-FV20-4', description: 'Caja de bolas 3', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-fv20-5', componentId: 'comp-fv20-5', code: 'WD-FV20-5', description: 'Rodillo presión soporte fijador', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-fv20-6', componentId: 'comp-fv20-6', code: 'WD-FV20-6', description: 'Husillo de regulación 1', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-fv20-7', componentId: 'comp-fv20-7', code: 'WD-FV20-7', description: 'Cojinete husillo guía madera 1', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-fv20-8', componentId: 'comp-fv20-8', code: 'WD-FV20-8', description: 'Husillo de regulación 2', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-fv20-9', componentId: 'comp-fv20-9', code: 'WD-FV20-9', description: 'Cojinete husillo guía madera 2', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-fv20-10', componentId: 'comp-fv20-10', code: 'WD-FV20-10', description: 'Cojinete de cilindros 1', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-fv20-11', componentId: 'comp-fv20-11', code: 'WD-FV20-11', description: 'Cojinete de cilindros 2', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-fv20-12', componentId: 'comp-fv20-12', code: 'WD-FV20-12', description: 'Motor sierra 1', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-fv20-13', componentId: 'comp-fv20-13', code: 'WD-FV20-13', description: 'Motor sierra 2', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-fv20-14', componentId: 'comp-fv20-14', code: 'WD-FV20-14', description: 'Tope de línea cero', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-semestral', createdAt: new Date().toISOString() },
  { id: 'lp-fv20-15', componentId: 'comp-fv20-15', code: 'WD-FV20-C', description: 'Empaquetadura laberíntica', lubricantId: 'lub-nbu15', method: 'manual', quantity: 4, frequencyId: 'freq-semestral', createdAt: new Date().toISOString() },
  { id: 'lp-fv20-16', componentId: 'comp-fv20-16', code: 'WD-FV20-A', description: 'Cojinete interior árbol sierra', lubricantId: 'lub-nbu15', method: 'manual', quantity: 10, frequencyId: 'freq-anual', createdAt: new Date().toISOString() },
  { id: 'lp-fv20-17', componentId: 'comp-fv20-17', code: 'WD-FV20-B', description: 'Cojinete exterior árbol sierra', lubricantId: 'lub-nbu15', method: 'manual', quantity: 8, frequencyId: 'freq-anual', createdAt: new Date().toISOString() },
];

// Perfiladora LINCK additional points (9 points for 160hrs frequency)
export const PERFILADORA_ADDITIONAL_POINTS: LubricationPoint[] = [
  { id: 'lp-p-acople', componentId: 'comp-perf-acople', code: 'P-9.2.2-8', description: 'Engrasado acople eje estriado (4 pts)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
  { id: 'lp-p-pinones', componentId: 'comp-perf-pinones', code: 'P-9.2.2-14', description: 'Engrasado piñones (sprockets)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
  { id: 'lp-p-sinfin', componentId: 'comp-perf-sinfin', code: 'P-9.2.2-17', description: 'Engrasado engranaje sinfín (4 pts)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
  { id: 'lp-p-rodillos', componentId: 'comp-perf-rodillos', code: 'P-9.2.3-1', description: 'Engrasado rodillos de guía', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-160hrs', createdAt: new Date().toISOString() },
  { id: 'lp-p-polea', componentId: 'comp-perf-polea', code: 'P-9.2.3-6', description: 'Engrasado polea eje estriado (6 pts)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-160hrs', createdAt: new Date().toISOString() },
  { id: 'lp-p-profiler', componentId: 'comp-perf-profiler', code: 'P-9.2.3-9', description: 'Engrasado perfiladora (8 pts)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-160hrs', createdAt: new Date().toISOString() },
  { id: 'lp-p-husillo-b', componentId: 'comp-perf-husillo-bolas', code: 'P-9.2.3-11', description: 'Engrasado husillo de bolas (6 pts)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 5, frequencyId: 'freq-160hrs', createdAt: new Date().toISOString() },
  { id: 'lp-p-rod-cent', componentId: 'comp-perf-rod-central', code: 'P-9.2.3-12', description: 'Engrasado rodamiento central BV', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-160hrs', createdAt: new Date().toISOString() },
  { id: 'lp-p-rod-bv', componentId: 'comp-perf-rod-bv', code: 'P-9.2.3-13', description: 'Engrasado rodamientos BV-HV-HF (12 pts)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-160hrs', createdAt: new Date().toISOString() },
];

// Total: 55 lubrication points
// - Canter 1 y 2: 8 points (existing)
// - Perfiladora LINCK: 14 points (4 existing + 9 new + 1 existing)
// - WD H84: 3 points (new)
// - WD FR10: 13 points (new)
// - WD FV20: 17 points (new)
