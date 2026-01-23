// ============================================================
// PROGRAMA DE LUBRICACIÓN AISA - DATOS REALES
// Fuente: PROGRAMA_LUBRICACION_ENERO_2026.xlsx
//         PLAN_DETALLADO_LUBRICACION_AISA.xlsx
// ============================================================

import type { Plant, Area, Machine, Component, Lubricant, Frequency, LubricationPoint } from './types';

// ============================================================
// PLANTA ÚNICA: ASERRADERO AISA
// ============================================================

export const PLANTAS: Plant[] = [
  { id: 'planta-aisa', name: 'Aserradero AISA', createdAt: new Date().toISOString() },
];

// ============================================================
// CENTROS DE GESTIÓN (Áreas) - Según Manual
// ============================================================

export const CENTROS_GESTION: Area[] = [
  { id: 'cg-611', plantId: 'planta-aisa', name: 'CG 611 – Descortezado', createdAt: new Date().toISOString() },
  { id: 'cg-612', plantId: 'planta-aisa', name: 'CG 612 – Aserrío LG (Canter/Perfiladora)', createdAt: new Date().toISOString() },
  { id: 'cg-613', plantId: 'planta-aisa', name: 'CG 613 – Clasificación LG', createdAt: new Date().toISOString() },
];

// ============================================================
// MÁQUINAS/EQUIPOS - Según Programa Enero 2026
// ============================================================

export const EQUIPOS: Machine[] = [
  // CG 611 - Descortezado
  { id: 'eq-8001', areaId: 'cg-611', name: '8001 – Descortezador Línea Gruesa', make: 'Industrial', createdAt: new Date().toISOString() },
  { id: 'eq-8002', areaId: 'cg-611', name: '8002 – Descortezador Línea Delgada', make: 'Industrial', createdAt: new Date().toISOString() },
  
  // CG 612 - Aserrío (del Plan Detallado Cap 9)
  { id: 'eq-canter', areaId: 'cg-612', name: '9.1 Canter 1 y 2', make: 'LINCK', createdAt: new Date().toISOString() },
  { id: 'eq-perfiladora', areaId: 'cg-612', name: '9.2 Perfiladora LINCK', make: 'LINCK', createdAt: new Date().toISOString() },
  { id: 'eq-wd', areaId: 'cg-612', name: '9.3 Sistema WD', make: 'WD', createdAt: new Date().toISOString() },
];

// ============================================================
// COMPONENTES - Según Programa Enero 2026
// ============================================================

export const COMPONENTES: Component[] = [
  // 8001 – Descortezador Línea Gruesa
  { id: 'comp-8001-cadenas', machineId: 'eq-8001', name: 'Cadenas Descortezador LG', createdAt: new Date().toISOString() },
  { id: 'comp-8001-alim', machineId: 'eq-8001', name: 'Cadenas Alimentación LG', createdAt: new Date().toISOString() },
  { id: 'comp-8001-central', machineId: 'eq-8001', name: 'Central Hidráulica LG', createdAt: new Date().toISOString() },
  { id: 'comp-8001-cuchillos', machineId: 'eq-8001', name: 'Cuchillos Descortezador LG', createdAt: new Date().toISOString() },
  { id: 'comp-8001-rotor', machineId: 'eq-8001', name: 'Rotor Descortezador LG', createdAt: new Date().toISOString() },
  
  // 8002 – Descortezador Línea Delgada
  { id: 'comp-8002-cuchillos', machineId: 'eq-8002', name: 'Cuchillos Descortezador LD', createdAt: new Date().toISOString() },
  { id: 'comp-8002-cadenas', machineId: 'eq-8002', name: 'Cadenas Descortezador LD', createdAt: new Date().toISOString() },
  { id: 'comp-8002-central-izq', machineId: 'eq-8002', name: 'Central Hidráulica DAG Izq.', createdAt: new Date().toISOString() },
  { id: 'comp-8002-central-der', machineId: 'eq-8002', name: 'Central Hidráulica DAG Der.', createdAt: new Date().toISOString() },
  { id: 'comp-8002-rotor', machineId: 'eq-8002', name: 'Rotor Descortezador LD', createdAt: new Date().toISOString() },
  
  // 9.1 Canter - Transmisión (9.1.1)
  { id: 'comp-canter-eje', machineId: 'eq-canter', name: 'Eje Estriado (Drive Shaft)', createdAt: new Date().toISOString() },
  { id: 'comp-canter-polea-trans', machineId: 'eq-canter', name: 'Rodamiento Polea Transmisión', createdAt: new Date().toISOString() },
  { id: 'comp-canter-polea-dent', machineId: 'eq-canter', name: 'Rodamiento Polea Dentada', createdAt: new Date().toISOString() },
  { id: 'comp-canter-polea-tens', machineId: 'eq-canter', name: 'Rodamiento Polea Tensora', createdAt: new Date().toISOString() },
  
  // 9.1 Canter - Rodillos de Avance (9.1.2)
  { id: 'comp-canter-cardan', machineId: 'eq-canter', name: 'Cardán de Transmisión', createdAt: new Date().toISOString() },
  { id: 'comp-canter-eje-rod', machineId: 'eq-canter', name: 'Eje de Rodillos', createdAt: new Date().toISOString() },
  { id: 'comp-canter-rod-vert', machineId: 'eq-canter', name: 'Rodamiento Rodillos Vert.', createdAt: new Date().toISOString() },
  { id: 'comp-canter-reductores', machineId: 'eq-canter', name: 'Reductores de Avance', createdAt: new Date().toISOString() },
  
  // 9.2 Perfiladora LINCK
  { id: 'comp-perf-guias', machineId: 'eq-perfiladora', name: 'Guías Lineales BV y Ejes HV', createdAt: new Date().toISOString() },
  { id: 'comp-perf-ajuste', machineId: 'eq-perfiladora', name: 'Guía de Ajuste', createdAt: new Date().toISOString() },
  { id: 'comp-perf-conexion', machineId: 'eq-perfiladora', name: 'Eje de Conexión', createdAt: new Date().toISOString() },
  { id: 'comp-perf-husillo', machineId: 'eq-perfiladora', name: 'Husillo Roscado Trapezoidal', createdAt: new Date().toISOString() },
  { id: 'comp-perf-acople', machineId: 'eq-perfiladora', name: 'Acople Eje Estriado', createdAt: new Date().toISOString() },
  { id: 'comp-perf-pinones', machineId: 'eq-perfiladora', name: 'Piñones (Sprockets)', createdAt: new Date().toISOString() },
  { id: 'comp-perf-sinfin', machineId: 'eq-perfiladora', name: 'Engranaje Sinfín', createdAt: new Date().toISOString() },
  { id: 'comp-perf-rodillos', machineId: 'eq-perfiladora', name: 'Rodillos de Guía', createdAt: new Date().toISOString() },
  { id: 'comp-perf-polea', machineId: 'eq-perfiladora', name: 'Polea Eje Estriado', createdAt: new Date().toISOString() },
  { id: 'comp-perf-profiler', machineId: 'eq-perfiladora', name: 'Perfiladora (Profiler)', createdAt: new Date().toISOString() },
  { id: 'comp-perf-husillo-bolas', machineId: 'eq-perfiladora', name: 'Husillo de Bolas', createdAt: new Date().toISOString() },
  { id: 'comp-perf-rod-central', machineId: 'eq-perfiladora', name: 'Rodamiento Central BV', createdAt: new Date().toISOString() },
  { id: 'comp-perf-rod-bv', machineId: 'eq-perfiladora', name: 'Rodamientos BV-HV-HF', createdAt: new Date().toISOString() },
  
  // 9.3 Sistema WD
  { id: 'comp-wd-coj-sup', machineId: 'eq-wd', name: 'Cojinete Rodillos Avance Sup.', createdAt: new Date().toISOString() },
  { id: 'comp-wd-coj-inf', machineId: 'eq-wd', name: 'Cojinete Rodillos Avance Inf.', createdAt: new Date().toISOString() },
  { id: 'comp-wd-husillo', machineId: 'eq-wd', name: 'Cojinete Husillo Reg. Guía Madera', createdAt: new Date().toISOString() },
];

// ============================================================
// LUBRICANTES - Según Plan Detallado
// ============================================================

export const LUBRICANTES: Lubricant[] = [
  { id: 'lub-grasa-i-ii', name: 'Grasa I y II', type: 'grasa', nlgiGrade: '2', createdAt: new Date().toISOString() },
  { id: 'lub-kp2k', name: 'Grasa KP2K', type: 'grasa', nlgiGrade: '2', createdAt: new Date().toISOString() },
  { id: 'lub-aceite-150', name: 'Aceite 150', type: 'aceite', viscosity: 'ISO VG 150', createdAt: new Date().toISOString() },
  { id: 'lub-aceite-80w90', name: 'Aceite 80W-90', type: 'aceite', viscosity: '80W-90', createdAt: new Date().toISOString() },
  { id: 'lub-aceite-cadenas', name: 'Aceite para Cadenas', type: 'aceite', createdAt: new Date().toISOString() },
  { id: 'lub-aceite-hidraulico', name: 'Aceite Hidráulico', type: 'aceite', viscosity: 'ISO VG 46', createdAt: new Date().toISOString() },
  { id: 'lub-nbu15', name: 'ISOFLEX NBU 15', type: 'grasa', nlgiGrade: '1.5', createdAt: new Date().toISOString() },
];

// ============================================================
// FRECUENCIAS - Según Programa Enero 2026
// ============================================================

export const FRECUENCIAS: Frequency[] = [
  { id: 'freq-diario', name: 'Diario (Cada 8 hrs)', days: 1, createdAt: new Date().toISOString() },
  { id: 'freq-dia-medio', name: 'Día por Medio', days: 2, createdAt: new Date().toISOString() },
  { id: 'freq-semanal', name: 'Semanal (Cada 40 hrs)', days: 7, createdAt: new Date().toISOString() },
  { id: 'freq-quincenal', name: 'Quincenal (Cada 160 hrs)', days: 14, createdAt: new Date().toISOString() },
  { id: 'freq-mensual', name: 'Mensual', days: 30, createdAt: new Date().toISOString() },
  { id: 'freq-trimestral', name: 'Trimestral (Cada 3 meses)', days: 90, createdAt: new Date().toISOString() },
  { id: 'freq-semestral', name: 'Semestral (Cada 6 meses)', days: 180, createdAt: new Date().toISOString() },
  { id: 'freq-anual', name: 'Anual', days: 365, createdAt: new Date().toISOString() },
];

// ============================================================
// PUNTOS DE LUBRICACIÓN - Según Programa Enero 2026
// Organizados por frecuencia
// ============================================================

export const PUNTOS_LUBRICACION: LubricationPoint[] = [
  // ============================================================
  // 4.1.1 TAREAS DIARIAS – DESCORTEZADO (CG 611)
  // ============================================================
  
  // 8001 – Descortezador Línea Gruesa
  { 
    id: 'lp-3100', 
    componentId: 'comp-8001-cadenas', 
    code: '3100', 
    description: 'Cadenas Descortezador LG – Aceitado', 
    lubricantId: 'lub-aceite-cadenas', 
    method: 'manual', 
    quantity: 100, 
    frequencyId: 'freq-diario', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'lp-3200', 
    componentId: 'comp-8001-alim', 
    code: '3200', 
    description: 'Cadenas Alimentación LG – Aceitado', 
    lubricantId: 'lub-aceite-cadenas', 
    method: 'manual', 
    quantity: 100, 
    frequencyId: 'freq-diario', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'lp-3002', 
    componentId: 'comp-8001-central', 
    code: '3002', 
    description: 'Central Hidráulica LG – Verificar nivel', 
    lubricantId: 'lub-aceite-hidraulico', 
    method: 'verificar', 
    quantity: 0, 
    frequencyId: 'freq-diario', 
    createdAt: new Date().toISOString() 
  },
  
  // 8002 – Descortezador Línea Delgada
  { 
    id: 'lp-2100-eng', 
    componentId: 'comp-8002-cuchillos', 
    code: '2100', 
    description: 'Cuchillos Descortezador LD – Engrasado', 
    lubricantId: 'lub-grasa-i-ii', 
    method: 'engrasado', 
    quantity: 50, 
    frequencyId: 'freq-diario', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'lp-2100-ace', 
    componentId: 'comp-8002-cadenas', 
    code: '2100', 
    description: 'Cadenas Descortezador LD – Aceitado', 
    lubricantId: 'lub-aceite-cadenas', 
    method: 'manual', 
    quantity: 100, 
    frequencyId: 'freq-diario', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'lp-1350', 
    componentId: 'comp-8002-central-izq', 
    code: '1350', 
    description: 'Central Hidráulica DAG Izq. – Verificar nivel', 
    lubricantId: 'lub-aceite-hidraulico', 
    method: 'verificar', 
    quantity: 0, 
    frequencyId: 'freq-diario', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'lp-1810', 
    componentId: 'comp-8002-central-der', 
    code: '1810', 
    description: 'Central Hidráulica DAG Der. – Verificar nivel', 
    lubricantId: 'lub-aceite-hidraulico', 
    method: 'verificar', 
    quantity: 0, 
    frequencyId: 'freq-diario', 
    createdAt: new Date().toISOString() 
  },
  
  // ============================================================
  // 4.1.2 TAREAS DÍA POR MEDIO – DESCORTEZADO
  // ============================================================
  { 
    id: 'lp-3000-cuch', 
    componentId: 'comp-8001-cuchillos', 
    code: '3000', 
    description: 'Cuchillos Descortezador LG – Engrasado', 
    lubricantId: 'lub-grasa-i-ii', 
    method: 'engrasado', 
    quantity: 50, 
    frequencyId: 'freq-dia-medio', 
    createdAt: new Date().toISOString() 
  },
  
  // ============================================================
  // 4.1.3 TAREAS QUINCENALES – DESCORTEZADO
  // ============================================================
  { 
    id: 'lp-3000-rotor', 
    componentId: 'comp-8001-rotor', 
    code: '3000', 
    description: 'Rotor Descortezador LG – Lavado + cambio aceite', 
    lubricantId: 'lub-aceite-80w90', 
    method: 'manual', 
    quantity: 2000, 
    frequencyId: 'freq-quincenal', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'lp-2100-rotor', 
    componentId: 'comp-8002-rotor', 
    code: '2100', 
    description: 'Rotor Descortezador LD – Lavado + cambio aceite', 
    lubricantId: 'lub-aceite-80w90', 
    method: 'manual', 
    quantity: 2000, 
    frequencyId: 'freq-quincenal', 
    createdAt: new Date().toISOString() 
  },
  
  // ============================================================
  // 9.1 CANTER 1 Y 2 – Plan Detallado Cap 9
  // ============================================================
  
  // 9.1.1 Transmisión – Cada 8 horas
  { 
    id: 'lp-911-b', 
    componentId: 'comp-canter-eje', 
    code: '9.1.1-B', 
    description: 'Eje Estriado (2 pts) – 120 gr', 
    lubricantId: 'lub-grasa-i-ii', 
    method: 'manual', 
    quantity: 120, 
    frequencyId: 'freq-diario', 
    createdAt: new Date().toISOString() 
  },
  
  // 9.1.1 Transmisión – Mensual
  { 
    id: 'lp-911-a', 
    componentId: 'comp-canter-polea-trans', 
    code: '9.1.1-A', 
    description: 'Rodamiento Polea Transmisión (2 pts) – 100 gr', 
    lubricantId: 'lub-grasa-i-ii', 
    method: 'manual', 
    quantity: 100, 
    frequencyId: 'freq-mensual', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'lp-911-c', 
    componentId: 'comp-canter-polea-dent', 
    code: '9.1.1-C', 
    description: 'Rodamiento Polea Dentada (2 pts) – 200 gr', 
    lubricantId: 'lub-grasa-i-ii', 
    method: 'manual', 
    quantity: 200, 
    frequencyId: 'freq-mensual', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'lp-911-d', 
    componentId: 'comp-canter-polea-tens', 
    code: '9.1.1-D', 
    description: 'Rodamiento Polea Tensora (2 pts) – 80 gr', 
    lubricantId: 'lub-grasa-i-ii', 
    method: 'manual', 
    quantity: 80, 
    frequencyId: 'freq-mensual', 
    createdAt: new Date().toISOString() 
  },
  
  // 9.1.2 Rodillos de Avance – Cada 40 horas (Semanal)
  { 
    id: 'lp-912-b', 
    componentId: 'comp-canter-cardan', 
    code: '9.1.2-B', 
    description: 'Cardán de Transmisión (4 pts) – 80 gr', 
    lubricantId: 'lub-grasa-i-ii', 
    method: 'manual', 
    quantity: 80, 
    frequencyId: 'freq-semanal', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'lp-912-c', 
    componentId: 'comp-canter-eje-rod', 
    code: '9.1.2-C', 
    description: 'Eje de Rodillos (2 pts) – 80 gr', 
    lubricantId: 'lub-grasa-i-ii', 
    method: 'manual', 
    quantity: 80, 
    frequencyId: 'freq-semanal', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'lp-912-d', 
    componentId: 'comp-canter-rod-vert', 
    code: '9.1.2-D', 
    description: 'Rodamiento Rodillos Vert. (4 pts) – 80 gr', 
    lubricantId: 'lub-grasa-i-ii', 
    method: 'manual', 
    quantity: 80, 
    frequencyId: 'freq-semanal', 
    createdAt: new Date().toISOString() 
  },
  
  // ============================================================
  // 9.2 PERFILADORA LINCK – Plan Detallado Cap 9
  // ============================================================
  
  // 9.2.1 Cada 8 horas (Diario)
  { 
    id: 'lp-921-10', 
    componentId: 'comp-perf-guias', 
    code: '9.2.1-10', 
    description: 'Guías Lineales BV y Ejes HV (16 pts) – 10 gr', 
    lubricantId: 'lub-kp2k', 
    method: 'manual', 
    quantity: 10, 
    frequencyId: 'freq-diario', 
    createdAt: new Date().toISOString() 
  },
  
  // 9.2.2 Cada 40 horas (Semanal)
  { 
    id: 'lp-922-4', 
    componentId: 'comp-perf-ajuste', 
    code: '9.2.2-4', 
    description: 'Guía de Ajuste (2 pts) – 10 gr', 
    lubricantId: 'lub-kp2k', 
    method: 'manual', 
    quantity: 10, 
    frequencyId: 'freq-semanal', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'lp-922-5', 
    componentId: 'comp-perf-conexion', 
    code: '9.2.2-5', 
    description: 'Eje de Conexión (8 pts) – 10 gr', 
    lubricantId: 'lub-kp2k', 
    method: 'manual', 
    quantity: 10, 
    frequencyId: 'freq-semanal', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'lp-922-7', 
    componentId: 'comp-perf-husillo', 
    code: '9.2.2-7', 
    description: 'Husillo Roscado Trapezoidal (2 pts) – 10 gr', 
    lubricantId: 'lub-kp2k', 
    method: 'manual', 
    quantity: 10, 
    frequencyId: 'freq-semanal', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'lp-922-8', 
    componentId: 'comp-perf-acople', 
    code: '9.2.2-8', 
    description: 'Acople Eje Estriado (4 pts) – 10 gr', 
    lubricantId: 'lub-kp2k', 
    method: 'manual', 
    quantity: 10, 
    frequencyId: 'freq-semanal', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'lp-922-14', 
    componentId: 'comp-perf-pinones', 
    code: '9.2.2-14', 
    description: 'Piñones Sprockets (2 pts) – 10 gr', 
    lubricantId: 'lub-kp2k', 
    method: 'manual', 
    quantity: 10, 
    frequencyId: 'freq-semanal', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'lp-922-17', 
    componentId: 'comp-perf-sinfin', 
    code: '9.2.2-17', 
    description: 'Engranaje Sinfín (4 pts) – 10 gr', 
    lubricantId: 'lub-kp2k', 
    method: 'manual', 
    quantity: 10, 
    frequencyId: 'freq-semanal', 
    createdAt: new Date().toISOString() 
  },
  
  // 9.2.3 Cada 160 horas (Quincenal)
  { 
    id: 'lp-923-1', 
    componentId: 'comp-perf-rodillos', 
    code: '9.2.3-1', 
    description: 'Rodillos de Guía (2 pts) – 10 gr', 
    lubricantId: 'lub-kp2k', 
    method: 'manual', 
    quantity: 10, 
    frequencyId: 'freq-quincenal', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'lp-923-6', 
    componentId: 'comp-perf-polea', 
    code: '9.2.3-6', 
    description: 'Polea Eje Estriado (6 pts) – 10 gr', 
    lubricantId: 'lub-kp2k', 
    method: 'manual', 
    quantity: 10, 
    frequencyId: 'freq-quincenal', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'lp-923-9', 
    componentId: 'comp-perf-profiler', 
    code: '9.2.3-9', 
    description: 'Perfiladora Profiler (8 pts) – 10 gr', 
    lubricantId: 'lub-kp2k', 
    method: 'manual', 
    quantity: 10, 
    frequencyId: 'freq-quincenal', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'lp-923-11', 
    componentId: 'comp-perf-husillo-bolas', 
    code: '9.2.3-11', 
    description: 'Husillo de Bolas (6 pts) – 5 gr', 
    lubricantId: 'lub-kp2k', 
    method: 'manual', 
    quantity: 5, 
    frequencyId: 'freq-quincenal', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'lp-923-12', 
    componentId: 'comp-perf-rod-central', 
    code: '9.2.3-12', 
    description: 'Rodamiento Central BV (2 pts) – 10 gr', 
    lubricantId: 'lub-kp2k', 
    method: 'manual', 
    quantity: 10, 
    frequencyId: 'freq-quincenal', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'lp-923-13', 
    componentId: 'comp-perf-rod-bv', 
    code: '9.2.3-13', 
    description: 'Rodamientos BV-HV-HF (12 pts) – 10 gr', 
    lubricantId: 'lub-kp2k', 
    method: 'manual', 
    quantity: 10, 
    frequencyId: 'freq-quincenal', 
    createdAt: new Date().toISOString() 
  },
  
  // ============================================================
  // 9.3 SISTEMA WD – Plan Detallado Cap 9
  // ============================================================
  
  // 9.3.1 Trimestral
  { 
    id: 'lp-931-1', 
    componentId: 'comp-wd-coj-sup', 
    code: '9.3.1-1', 
    description: 'Cojinete Rodillos Avance Sup. (Der./Izq.)', 
    lubricantId: 'lub-kp2k', 
    method: 'manual', 
    quantity: 10, 
    frequencyId: 'freq-trimestral', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'lp-931-2', 
    componentId: 'comp-wd-coj-inf', 
    code: '9.3.1-2', 
    description: 'Cojinete Rodillos Avance Inf. (Der./Izq.)', 
    lubricantId: 'lub-kp2k', 
    method: 'manual', 
    quantity: 10, 
    frequencyId: 'freq-trimestral', 
    createdAt: new Date().toISOString() 
  },
  
  // 9.3.1 Semestral
  { 
    id: 'lp-931-3', 
    componentId: 'comp-wd-husillo', 
    code: '9.3.1-3', 
    description: 'Cojinete Husillo Reg. Guía Madera (Superior)', 
    lubricantId: 'lub-kp2k', 
    method: 'manual', 
    quantity: 10, 
    frequencyId: 'freq-semestral', 
    createdAt: new Date().toISOString() 
  },
];

// ============================================================
// FUNCIÓN PARA OBTENER TAREAS DEL DÍA
// ============================================================

export function getTareasDiarias(): LubricationPoint[] {
  return PUNTOS_LUBRICACION.filter(lp => lp.frequencyId === 'freq-diario');
}

export function getTareasDiaPorMedio(fecha: Date): LubricationPoint[] {
  const day = fecha.getDate();
  // Día impar = se ejecuta
  if (day % 2 === 1) {
    return PUNTOS_LUBRICACION.filter(lp => lp.frequencyId === 'freq-dia-medio');
  }
  return [];
}

export function getTareasSemanales(): LubricationPoint[] {
  return PUNTOS_LUBRICACION.filter(lp => lp.frequencyId === 'freq-semanal');
}

export function getTareasQuincenales(): LubricationPoint[] {
  return PUNTOS_LUBRICACION.filter(lp => lp.frequencyId === 'freq-quincenal');
}

// Resumen de tareas
export const RESUMEN_TAREAS = {
  diarias: PUNTOS_LUBRICACION.filter(lp => lp.frequencyId === 'freq-diario').length,
  diaPorMedio: PUNTOS_LUBRICACION.filter(lp => lp.frequencyId === 'freq-dia-medio').length,
  semanales: PUNTOS_LUBRICACION.filter(lp => lp.frequencyId === 'freq-semanal').length,
  quincenales: PUNTOS_LUBRICACION.filter(lp => lp.frequencyId === 'freq-quincenal').length,
  mensuales: PUNTOS_LUBRICACION.filter(lp => lp.frequencyId === 'freq-mensual').length,
  trimestrales: PUNTOS_LUBRICACION.filter(lp => lp.frequencyId === 'freq-trimestral').length,
  semestrales: PUNTOS_LUBRICACION.filter(lp => lp.frequencyId === 'freq-semestral').length,
  total: PUNTOS_LUBRICACION.length,
};
