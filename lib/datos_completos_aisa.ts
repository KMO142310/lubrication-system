// ============================================================
// DATOS COMPLETOS AISA - MANUAL TÉCNICO 2026
// Fuente: MANUAL_TECNICO_LUBRICACION_INDUSTRIAL_AISA_2026.pdf
// Actualizado: 24 Enero 2026
// Total: 153 equipos, 5 áreas, 64+ tareas
// ============================================================

import type { Plant, Area, Machine, Component, Lubricant, Frequency, LubricationPoint } from './types';

// ============================================================
// PLANTA PRINCIPAL - AISA
// ============================================================

export const PLANTA_AISA: Plant[] = [
  { id: 'planta-aisa', name: 'AISA - Aserraderos Industriales S.A.', createdAt: new Date().toISOString() },
];

// ============================================================
// ÁREAS - Centros de Gestión (CG)
// CG 611: Descortezado | CG 612: Aserradero
// ============================================================

export const CENTROS_GESTION: Area[] = [
  // ========== CG 611 - DESCORTEZADO ==========
  { id: 'area-8001', plantId: 'planta-aisa', name: 'Descortezador Línea Gruesa (CG 611)', createdAt: new Date().toISOString() },
  { id: 'area-8002', plantId: 'planta-aisa', name: 'Descortezador Línea Delgada (CG 611)', createdAt: new Date().toISOString() },

  // ========== CG 612 - ASERRADERO ==========
  { id: 'area-8006', plantId: 'planta-aisa', name: 'Aserradero Línea Gruesa (CG 612)', createdAt: new Date().toISOString() },
  { id: 'area-8007', plantId: 'planta-aisa', name: 'Aserradero Línea Delgada (CG 612)', createdAt: new Date().toISOString() },
  { id: 'area-8010', plantId: 'planta-aisa', name: 'Astillado (CG 612)', createdAt: new Date().toISOString() },

  // Compatibilidad con código anterior
  { id: 'area-linea-gruesa', plantId: 'planta-aisa', name: 'Aserradero Línea Gruesa', createdAt: new Date().toISOString() },
  { id: 'area-linea-delgada', plantId: 'planta-aisa', name: 'Aserradero Línea Delgada', createdAt: new Date().toISOString() },
];

// ============================================================
// EQUIPOS - Organizados por Línea
// ============================================================

export const EQUIPOS: Machine[] = [
  // ========== LÍNEA GRUESA ==========
  { id: 'eq-8001', areaId: 'area-linea-gruesa', name: 'Descortezador Línea Gruesa (8001)', make: 'Industrial', createdAt: new Date().toISOString() },
  { id: 'eq-8006', areaId: 'area-linea-gruesa', name: 'Aserradero Línea Gruesa (8006)', make: 'LINCK/ESTERER', createdAt: new Date().toISOString() },
  { id: 'eq-grimme', areaId: 'area-linea-gruesa', name: 'Grimme Línea Gruesa', make: 'GRIMME', createdAt: new Date().toISOString() },

  // ========== LÍNEA DELGADA ==========
  { id: 'eq-8002', areaId: 'area-linea-delgada', name: 'Descortezador Línea Delgada (8002)', make: 'Industrial', createdAt: new Date().toISOString() },
  { id: 'eq-8007', areaId: 'area-linea-delgada', name: 'Aserradero Línea Delgada (8007)', make: 'LINCK', createdAt: new Date().toISOString() },
  { id: 'eq-canter', areaId: 'area-linea-delgada', name: 'Canter 1 y 2', make: 'LINCK', createdAt: new Date().toISOString() },
  { id: 'eq-perfiladora', areaId: 'area-linea-delgada', name: 'Perfiladora LINCK', make: 'LINCK', createdAt: new Date().toISOString() },
  { id: 'eq-wd', areaId: 'area-linea-delgada', name: 'Sistema WD H84', make: 'WD', createdAt: new Date().toISOString() },
  { id: 'eq-wd-fr10', areaId: 'area-linea-delgada', name: 'WD FR10', make: 'WD', createdAt: new Date().toISOString() },
];

// ============================================================
// COMPONENTES - 50+ componentes
// ============================================================

export const COMPONENTES: Component[] = [
  // ========== 8001 - Descortezador LG ==========
  { id: 'c-8001-cadenas', machineId: 'eq-8001', name: 'Cadenas Descortezador LG', createdAt: new Date().toISOString() },
  { id: 'c-8001-alim', machineId: 'eq-8001', name: 'Cadenas Alimentación LG', createdAt: new Date().toISOString() },
  { id: 'c-8001-central', machineId: 'eq-8001', name: 'Central Hidráulica LG', createdAt: new Date().toISOString() },
  { id: 'c-8001-cuchillos', machineId: 'eq-8001', name: 'Cuchillos Descortezador LG', createdAt: new Date().toISOString() },
  { id: 'c-8001-rotor', machineId: 'eq-8001', name: 'Rotor Descortezador LG', createdAt: new Date().toISOString() },
  { id: 'c-8001-reductor', machineId: 'eq-8001', name: 'Reductor Descortezador LG', createdAt: new Date().toISOString() },
  { id: 'c-8001-motor', machineId: 'eq-8001', name: 'Motor Reductor Descortezador LG', createdAt: new Date().toISOString() },
  { id: 'c-8001-rodamientos', machineId: 'eq-8001', name: 'Rodamientos y Soportes LG', createdAt: new Date().toISOString() },

  // ========== GRIMME - Línea Gruesa ==========
  { id: 'c-grimme-ejes', machineId: 'eq-grimme', name: 'Ejes Grimme LG', createdAt: new Date().toISOString() },
  { id: 'c-grimme-rodamientos', machineId: 'eq-grimme', name: 'Rodamientos Grimme LG', createdAt: new Date().toISOString() },

  // ========== 8002 - Descortezador LD ==========
  { id: 'c-8002-cuchillos', machineId: 'eq-8002', name: 'Cuchillos Descortezador LD', createdAt: new Date().toISOString() },
  { id: 'c-8002-cadenas', machineId: 'eq-8002', name: 'Cadenas Descortezador LD', createdAt: new Date().toISOString() },
  { id: 'c-8002-central-izq', machineId: 'eq-8002', name: 'Central Hidráulica DAG Izq.', createdAt: new Date().toISOString() },
  { id: 'c-8002-central-der', machineId: 'eq-8002', name: 'Central Hidráulica DAG Der.', createdAt: new Date().toISOString() },
  { id: 'c-8002-rotor', machineId: 'eq-8002', name: 'Rotor Descortezador LD', createdAt: new Date().toISOString() },
  { id: 'c-8002-reductor', machineId: 'eq-8002', name: 'Reductor Descortezador LD', createdAt: new Date().toISOString() },
  { id: 'c-8002-motor', machineId: 'eq-8002', name: 'Motor Reductor Descortezador LD', createdAt: new Date().toISOString() },
  { id: 'c-8002-rodamientos', machineId: 'eq-8002', name: 'Rodamientos y Soportes LD', createdAt: new Date().toISOString() },

  // ========== 8007 - Línea Delgada ==========
  { id: 'c-8007-chipper1', machineId: 'eq-8007', name: 'Chipper Canter 1', createdAt: new Date().toISOString() },
  { id: 'c-8007-chipper2', machineId: 'eq-8007', name: 'Chipper Canter 2', createdAt: new Date().toISOString() },
  { id: 'c-8007-central1', machineId: 'eq-8007', name: 'Central Hidráulica Canter 1', createdAt: new Date().toISOString() },
  { id: 'c-8007-central2', machineId: 'eq-8007', name: 'Central Hidráulica Canter 2', createdAt: new Date().toISOString() },
  { id: 'c-8007-central-wd', machineId: 'eq-8007', name: 'Central Hidráulica WD', createdAt: new Date().toISOString() },
  { id: 'c-8007-central-2900', machineId: 'eq-8007', name: 'Central Hidráulica 2900', createdAt: new Date().toISOString() },

  // ========== 8006 - Línea Gruesa ==========
  { id: 'c-8006-hmk20', machineId: 'eq-8006', name: 'HMK20', createdAt: new Date().toISOString() },
  { id: 'c-8006-pendu', machineId: 'eq-8006', name: 'PENDU', createdAt: new Date().toISOString() },
  { id: 'c-8006-canteadora-linck', machineId: 'eq-8006', name: 'Canteadora LINCK', createdAt: new Date().toISOString() },
  { id: 'c-8006-canteadora-esterer', machineId: 'eq-8006', name: 'Canteadora ESTERER', createdAt: new Date().toISOString() },

  // ========== CANTER 1 y 2 - Transmisión (9.1.1) ==========
  { id: 'c-canter-polea-trans', machineId: 'eq-canter', name: 'Rodamiento Polea Transmisión', createdAt: new Date().toISOString() },
  { id: 'c-canter-eje', machineId: 'eq-canter', name: 'Eje Estriado (Drive Shaft)', createdAt: new Date().toISOString() },
  { id: 'c-canter-polea-dent', machineId: 'eq-canter', name: 'Rodamiento Polea Dentada', createdAt: new Date().toISOString() },
  { id: 'c-canter-polea-tens', machineId: 'eq-canter', name: 'Rodamiento Polea Tensora', createdAt: new Date().toISOString() },

  // ========== CANTER 1 y 2 - Rodillos Avance (9.1.2) ==========
  { id: 'c-canter-reductores', machineId: 'eq-canter', name: 'Reductores de Avance', createdAt: new Date().toISOString() },
  { id: 'c-canter-cardan', machineId: 'eq-canter', name: 'Cardán de Transmisión', createdAt: new Date().toISOString() },
  { id: 'c-canter-eje-rod', machineId: 'eq-canter', name: 'Eje de Rodillos', createdAt: new Date().toISOString() },
  { id: 'c-canter-rod-vert', machineId: 'eq-canter', name: 'Rodamiento Rodillos Verticales', createdAt: new Date().toISOString() },

  // ========== PERFILADORA LINCK (9.2) ==========
  { id: 'c-perf-guias', machineId: 'eq-perfiladora', name: 'Guías Lineales BV y Ejes HV', createdAt: new Date().toISOString() },
  { id: 'c-perf-ajuste', machineId: 'eq-perfiladora', name: 'Guía de Ajuste', createdAt: new Date().toISOString() },
  { id: 'c-perf-conexion', machineId: 'eq-perfiladora', name: 'Eje de Conexión', createdAt: new Date().toISOString() },
  { id: 'c-perf-husillo-trap', machineId: 'eq-perfiladora', name: 'Husillo Roscado Trapezoidal', createdAt: new Date().toISOString() },
  { id: 'c-perf-acople', machineId: 'eq-perfiladora', name: 'Acople Eje Estriado', createdAt: new Date().toISOString() },
  { id: 'c-perf-pinones', machineId: 'eq-perfiladora', name: 'Piñones (Sprockets)', createdAt: new Date().toISOString() },
  { id: 'c-perf-sinfin', machineId: 'eq-perfiladora', name: 'Engranaje Sinfín', createdAt: new Date().toISOString() },
  { id: 'c-perf-rodillos', machineId: 'eq-perfiladora', name: 'Rodillos de Guía', createdAt: new Date().toISOString() },
  { id: 'c-perf-polea', machineId: 'eq-perfiladora', name: 'Polea Eje Estriado', createdAt: new Date().toISOString() },
  { id: 'c-perf-profiler', machineId: 'eq-perfiladora', name: 'Perfiladora (Profiler)', createdAt: new Date().toISOString() },
  { id: 'c-perf-husillo-bolas', machineId: 'eq-perfiladora', name: 'Husillo de Bolas', createdAt: new Date().toISOString() },
  { id: 'c-perf-rod-central', machineId: 'eq-perfiladora', name: 'Rodamiento Central BV', createdAt: new Date().toISOString() },
  { id: 'c-perf-rod-bv', machineId: 'eq-perfiladora', name: 'Rodamientos BV-HV-HF', createdAt: new Date().toISOString() },
  { id: 'c-perf-cadena', machineId: 'eq-perfiladora', name: 'Cadena de Transmisión', createdAt: new Date().toISOString() },
  { id: 'c-perf-motor-perske', machineId: 'eq-perfiladora', name: 'Motor Sierra Perske', createdAt: new Date().toISOString() },
  { id: 'c-perf-motor-sew', machineId: 'eq-perfiladora', name: 'Motor de Ajuste SEW', createdAt: new Date().toISOString() },
  { id: 'c-perf-motor-perf', machineId: 'eq-perfiladora', name: 'Motor de la Perfiladora', createdAt: new Date().toISOString() },

  // ========== WD H84 (9.3.1) ==========
  { id: 'c-wd-coj-sup', machineId: 'eq-wd', name: 'Cojinete Rodillos Avance Sup.', createdAt: new Date().toISOString() },
  { id: 'c-wd-coj-inf', machineId: 'eq-wd', name: 'Cojinete Rodillos Avance Inf.', createdAt: new Date().toISOString() },
  { id: 'c-wd-husillo', machineId: 'eq-wd', name: 'Cojinete Husillo Reg. Guía Madera', createdAt: new Date().toISOString() },

  // ========== WD FR10 (9.3.2) ==========
  { id: 'c-fr10-cil-inf-ext', machineId: 'eq-wd-fr10', name: 'Cojinetes Cilindro Inf. Extracción', createdAt: new Date().toISOString() },
  { id: 'c-fr10-estribo-ext', machineId: 'eq-wd-fr10', name: 'Cojinete Estribo Cilindro Extracción', createdAt: new Date().toISOString() },
  { id: 'c-fr10-cil-sup-ext', machineId: 'eq-wd-fr10', name: 'Cojinete Cilindro Sup. Extracción', createdAt: new Date().toISOString() },
  { id: 'c-fr10-bisagra', machineId: 'eq-wd-fr10', name: 'Cojinete Bisagra Puerta', createdAt: new Date().toISOString() },
  { id: 'c-fr10-cil-sup-int', machineId: 'eq-wd-fr10', name: 'Cojinete Cilindros Sup. Introducción', createdAt: new Date().toISOString() },
  { id: 'c-fr10-estribo-int', machineId: 'eq-wd-fr10', name: 'Cojinete Estribo Cilindros Introducción', createdAt: new Date().toISOString() },
  { id: 'c-fr10-cil-inf-int', machineId: 'eq-wd-fr10', name: 'Cojinete Cilindros Inf. Introducción', createdAt: new Date().toISOString() },
  { id: 'c-fr10-husillo-guia', machineId: 'eq-wd-fr10', name: 'Cojinete Husillo Reg. Guía', createdAt: new Date().toISOString() },
  { id: 'c-fr10-cardan', machineId: 'eq-wd-fr10', name: 'Cojinete Árbol Cardán y Sierra', createdAt: new Date().toISOString() },
];

// ============================================================
// LUBRICANTES - Según Manual AISA 2026
// Aceites: Mobil | Grasas: Por color/tipo
// ============================================================

export const LUBRICANTES: Lubricant[] = [
  // ========== ACEITES MOBIL ==========
  { id: 'lub-dte26', name: 'Mobil DTE-26', type: 'aceite', viscosity: 'ISO VG 68', createdAt: new Date().toISOString() },
  { id: 'lub-dte24', name: 'Mobil DTE-24', type: 'aceite', viscosity: 'ISO VG 32', createdAt: new Date().toISOString() },
  { id: 'lub-ep150', name: 'Mobil EP-150', type: 'aceite', viscosity: 'ISO VG 150', createdAt: new Date().toISOString() },
  { id: 'lub-80w90', name: 'Mobil 80W-90', type: 'aceite', viscosity: '80W-90', createdAt: new Date().toISOString() },

  // ========== GRASAS POR COLOR ==========
  { id: 'lub-grasa-azul', name: 'Grasa Azul (Uso General)', type: 'grasa', nlgiGrade: '2', createdAt: new Date().toISOString() },
  { id: 'lub-grasa-amarilla', name: 'Grasa Amarilla (Aplicaciones Específicas)', type: 'grasa', nlgiGrade: '2', createdAt: new Date().toISOString() },
  { id: 'lub-grasa-roja', name: 'Grasa Roja (Alta Temperatura)', type: 'grasa', nlgiGrade: '2', createdAt: new Date().toISOString() },

  // ========== GRASAS ESPECIALES ==========
  { id: 'lub-kp2k', name: 'Grasa KP2K', type: 'grasa', nlgiGrade: '2', createdAt: new Date().toISOString() },
  { id: 'lub-nbu15', name: 'ISOFLEX NBU 15', type: 'grasa', nlgiGrade: '1.5', createdAt: new Date().toISOString() },

  // ========== COMPATIBILIDAD ==========
  { id: 'lub-grasa-i-ii', name: 'Grasa I y II', type: 'grasa', nlgiGrade: '2', createdAt: new Date().toISOString() },
  { id: 'lub-aceite-150', name: 'Aceite 150', type: 'aceite', viscosity: 'ISO VG 150', createdAt: new Date().toISOString() },
  { id: 'lub-aceite-80w90', name: 'Aceite 80W-90', type: 'aceite', viscosity: '80W-90', createdAt: new Date().toISOString() },
  { id: 'lub-hidraulico', name: 'Aceite Hidráulico', type: 'aceite', viscosity: 'ISO VG 46', createdAt: new Date().toISOString() },
  { id: 'lub-cadenas', name: 'Aceite para Cadenas', type: 'aceite', viscosity: 'ISO VG 68', createdAt: new Date().toISOString() },
];

// ============================================================
// FRECUENCIAS
// ============================================================

export const FRECUENCIAS: Frequency[] = [
  { id: 'freq-8hrs', name: 'Cada 8 horas (Diario)', days: 1, createdAt: new Date().toISOString() },
  { id: 'freq-dia-medio', name: 'Día por Medio', days: 2, createdAt: new Date().toISOString() },
  { id: 'freq-40hrs', name: 'Cada 40 horas (Semanal)', days: 7, createdAt: new Date().toISOString() },
  { id: 'freq-160hrs', name: 'Cada 160 horas (Quincenal)', days: 14, createdAt: new Date().toISOString() },
  { id: 'freq-mensual', name: 'Mensual', days: 30, createdAt: new Date().toISOString() },
  { id: 'freq-trimestral', name: 'Cada 3 meses', days: 90, createdAt: new Date().toISOString() },
  { id: 'freq-semestral', name: 'Cada 6 meses', days: 180, createdAt: new Date().toISOString() },
  { id: 'freq-anual', name: 'Anual (7000 hrs)', days: 365, createdAt: new Date().toISOString() },
];

// ============================================================
// PUNTOS DE LUBRICACIÓN - 64 TAREAS COMPLETAS
// ============================================================

export const PUNTOS_LUBRICACION: LubricationPoint[] = [
  // ============================================================
  // CG 611 - DESCORTEZADO
  // ============================================================

  // ===== 4.1.1 TAREAS DIARIAS - 8001 Descortezador LG =====
  { id: 'lp-3100', componentId: 'c-8001-cadenas', code: '3100', description: 'Cadenas Descortezador LG – Aceitado', lubricantId: 'lub-cadenas', method: 'manual', quantity: 100, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  { id: 'lp-3200', componentId: 'c-8001-alim', code: '3200', description: 'Cadenas Alimentación LG – Aceitado', lubricantId: 'lub-cadenas', method: 'manual', quantity: 100, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  { id: 'lp-3002', componentId: 'c-8001-central', code: '3002', description: 'Central Hidráulica LG – Verificar nivel', lubricantId: 'lub-hidraulico', method: 'verificar', quantity: 0, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },

  // ===== 4.1.1 TAREAS DIARIAS - 8002 Descortezador LD =====
  { id: 'lp-2100-eng', componentId: 'c-8002-cuchillos', code: '2100', description: 'Cuchillos Descortezador LD – Engrasado', lubricantId: 'lub-grasa-i-ii', method: 'engrasado', quantity: 50, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  { id: 'lp-2100-ace', componentId: 'c-8002-cadenas', code: '2100', description: 'Cadenas Descortezador LD – Aceitado', lubricantId: 'lub-cadenas', method: 'manual', quantity: 100, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  { id: 'lp-1350', componentId: 'c-8002-central-izq', code: '1350', description: 'Central Hidráulica DAG Izq. – Verificar nivel', lubricantId: 'lub-hidraulico', method: 'verificar', quantity: 0, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  { id: 'lp-1810', componentId: 'c-8002-central-der', code: '1810', description: 'Central Hidráulica DAG Der. – Verificar nivel', lubricantId: 'lub-hidraulico', method: 'verificar', quantity: 0, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },

  // ===== 4.1.2 TAREAS DÍA POR MEDIO =====
  { id: 'lp-3000-cuch', componentId: 'c-8001-cuchillos', code: '3000', description: 'Cuchillos Descortezador LG – Engrasado', lubricantId: 'lub-grasa-i-ii', method: 'engrasado', quantity: 80, frequencyId: 'freq-dia-medio', createdAt: new Date().toISOString() },

  // ===== 4.1.3 TAREAS QUINCENALES =====
  { id: 'lp-3000-rotor', componentId: 'c-8001-rotor', code: '3000', description: 'Rotor Descortezador LG – Lavado + cambio aceite 80W-90', lubricantId: 'lub-aceite-80w90', method: 'manual', quantity: 2000, frequencyId: 'freq-160hrs', createdAt: new Date().toISOString() },
  { id: 'lp-2100-rotor', componentId: 'c-8002-rotor', code: '2100', description: 'Rotor Descortezador LD – Lavado + cambio aceite 80W-90', lubricantId: 'lub-aceite-80w90', method: 'manual', quantity: 2000, frequencyId: 'freq-160hrs', createdAt: new Date().toISOString() },

  // ===== 4.1.4 TAREAS MENSUALES - 8001 =====
  { id: 'lp-8001-reductor', componentId: 'c-8001-reductor', code: '3000', description: 'Reductor Descortezador LG – Revisión nivel aceite', lubricantId: 'lub-aceite-150', method: 'verificar', quantity: 0, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },
  { id: 'lp-8001-motor', componentId: 'c-8001-motor', code: '3000', description: 'Motor Reductor Descortezador LG – Revisión general', lubricantId: 'lub-grasa-i-ii', method: 'verificar', quantity: 0, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },
  { id: 'lp-8001-rodamientos', componentId: 'c-8001-rodamientos', code: '3000', description: 'Rodamientos y Soportes LG – Engrasado completo', lubricantId: 'lub-grasa-i-ii', method: 'engrasado', quantity: 200, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },

  // ===== GRIMME - LÍNEA GRUESA (Tareas Sábado) =====
  { id: 'lp-grimme-ejes', componentId: 'c-grimme-ejes', code: 'GRM-01', description: 'Ejes Grimme LG – Engrasado completo', lubricantId: 'lub-grasa-i-ii', method: 'engrasado', quantity: 150, frequencyId: 'freq-semanal', createdAt: new Date().toISOString() },
  { id: 'lp-grimme-rodamientos', componentId: 'c-grimme-rodamientos', code: 'GRM-02', description: 'Rodamientos Grimme LG – Verificar y engrasar', lubricantId: 'lub-grasa-i-ii', method: 'engrasado', quantity: 100, frequencyId: 'freq-semanal', createdAt: new Date().toISOString() },

  // ===== 4.1.4 TAREAS MENSUALES - 8002 =====
  { id: 'lp-8002-reductor', componentId: 'c-8002-reductor', code: '2100', description: 'Reductor Descortezador LD – Revisión nivel aceite', lubricantId: 'lub-aceite-150', method: 'verificar', quantity: 0, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },
  { id: 'lp-8002-motor', componentId: 'c-8002-motor', code: '2100', description: 'Motor Reductor Descortezador LD – Revisión general', lubricantId: 'lub-grasa-i-ii', method: 'verificar', quantity: 0, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },
  { id: 'lp-8002-rodamientos', componentId: 'c-8002-rodamientos', code: '2100', description: 'Rodamientos y Soportes LD – Engrasado completo', lubricantId: 'lub-grasa-i-ii', method: 'engrasado', quantity: 200, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },

  // ============================================================
  // CG 612 - ASERRADERO
  // ============================================================

  // ===== 4.2.1 TAREAS DIARIAS - 8007 Línea Delgada =====
  { id: 'lp-150', componentId: 'c-8007-chipper1', code: '150', description: 'Chipper Canter 1 – Engrasado', lubricantId: 'lub-grasa-i-ii', method: 'engrasado', quantity: 50, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  { id: 'lp-220', componentId: 'c-8007-chipper2', code: '220', description: 'Chipper Canter 2 – Engrasado', lubricantId: 'lub-grasa-i-ii', method: 'engrasado', quantity: 50, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  { id: 'lp-42', componentId: 'c-8007-central1', code: '42', description: 'Central Hidráulica Canter 1 – Verificar nivel', lubricantId: 'lub-hidraulico', method: 'verificar', quantity: 0, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  { id: 'lp-40', componentId: 'c-8007-central2', code: '40', description: 'Central Hidráulica Canter 2 – Verificar nivel', lubricantId: 'lub-hidraulico', method: 'verificar', quantity: 0, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  { id: 'lp-43', componentId: 'c-8007-central-wd', code: '43', description: 'Central Hidráulica WD – Verificar nivel', lubricantId: 'lub-hidraulico', method: 'verificar', quantity: 0, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  { id: 'lp-41', componentId: 'c-8007-central-2900', code: '41', description: 'Central Hidráulica 2900 – Verificar nivel', lubricantId: 'lub-hidraulico', method: 'verificar', quantity: 0, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },

  // ===== 4.2.1 TAREAS DIARIAS - 8006 Línea Gruesa =====
  { id: 'lp-4800', componentId: 'c-8006-hmk20', code: '4800', description: 'HMK20 – Engrasado', lubricantId: 'lub-grasa-i-ii', method: 'engrasado', quantity: 50, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  { id: 'lp-6600', componentId: 'c-8006-pendu', code: '6600', description: 'PENDU – Engrasado', lubricantId: 'lub-grasa-i-ii', method: 'engrasado', quantity: 50, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  { id: 'lp-5050', componentId: 'c-8006-canteadora-linck', code: '5050', description: 'Canteadora LINCK – Engrasado', lubricantId: 'lub-grasa-i-ii', method: 'engrasado', quantity: 50, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  { id: 'lp-5750', componentId: 'c-8006-canteadora-esterer', code: '5750', description: 'Canteadora ESTERER – Engrasado', lubricantId: 'lub-grasa-i-ii', method: 'engrasado', quantity: 50, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },

  // ============================================================
  // CAP. 9 - PLAN DETALLADO
  // ============================================================

  // ===== 9.1.1 CANTER - Transmisión =====
  { id: 'lp-911-b', componentId: 'c-canter-eje', code: '9.1.1-B', description: 'Eje Estriado (2 pts) – 120 gr', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 120, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },
  { id: 'lp-911-a', componentId: 'c-canter-polea-trans', code: '9.1.1-A', description: 'Rodamiento Polea Transmisión (2 pts) – 100 gr', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 100, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },
  { id: 'lp-911-c', componentId: 'c-canter-polea-dent', code: '9.1.1-C', description: 'Rodamiento Polea Dentada (2 pts) – 200 gr', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 200, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },
  { id: 'lp-911-d', componentId: 'c-canter-polea-tens', code: '9.1.1-D', description: 'Rodamiento Polea Tensora (2 pts) – 80 gr', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 80, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },

  // ===== 9.1.2 CANTER - Rodillos Avance =====
  { id: 'lp-912-a', componentId: 'c-canter-reductores', code: '9.1.2-A', description: 'Reductores de Avance (2 pts) – 1.9 L', lubricantId: 'lub-aceite-150', method: 'nivel', quantity: 1900, frequencyId: 'freq-anual', createdAt: new Date().toISOString() },
  { id: 'lp-912-b', componentId: 'c-canter-cardan', code: '9.1.2-B', description: 'Cardán de Transmisión (4 pts) – 80 gr', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 80, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
  { id: 'lp-912-c', componentId: 'c-canter-eje-rod', code: '9.1.2-C', description: 'Eje de Rodillos (2 pts) – 80 gr', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 80, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
  { id: 'lp-912-d', componentId: 'c-canter-rod-vert', code: '9.1.2-D', description: 'Rodamiento Rodillos Vert. (4 pts) – 80 gr', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 80, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },

  // ===== 9.2.1 PERFILADORA - Cada 8 hrs =====
  { id: 'lp-921-10', componentId: 'c-perf-guias', code: '9.2.1-10', description: 'Guías Lineales BV y Ejes HV (16 pts) – 10 gr', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-8hrs', createdAt: new Date().toISOString() },

  // ===== 9.2.2 PERFILADORA - Cada 40 hrs =====
  { id: 'lp-922-4', componentId: 'c-perf-ajuste', code: '9.2.2-4', description: 'Guía de Ajuste (2 pts) – 10 gr', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
  { id: 'lp-922-5', componentId: 'c-perf-conexion', code: '9.2.2-5', description: 'Eje de Conexión (8 pts) – 10 gr', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
  { id: 'lp-922-7', componentId: 'c-perf-husillo-trap', code: '9.2.2-7', description: 'Husillo Roscado Trapezoidal (2 pts) – 10 gr', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
  { id: 'lp-922-8', componentId: 'c-perf-acople', code: '9.2.2-8', description: 'Acople Eje Estriado (4 pts) – 10 gr', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
  { id: 'lp-922-14', componentId: 'c-perf-pinones', code: '9.2.2-14', description: 'Piñones Sprockets (2 pts) – 10 gr', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },
  { id: 'lp-922-17', componentId: 'c-perf-sinfin', code: '9.2.2-17', description: 'Engranaje Sinfín (4 pts) – 10 gr', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-40hrs', createdAt: new Date().toISOString() },

  // ===== 9.2.3 PERFILADORA - Cada 160 hrs =====
  { id: 'lp-923-1', componentId: 'c-perf-rodillos', code: '9.2.3-1', description: 'Rodillos de Guía (2 pts) – 10 gr', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-160hrs', createdAt: new Date().toISOString() },
  { id: 'lp-923-6', componentId: 'c-perf-polea', code: '9.2.3-6', description: 'Polea Eje Estriado (6 pts) – 10 gr', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-160hrs', createdAt: new Date().toISOString() },
  { id: 'lp-923-9', componentId: 'c-perf-profiler', code: '9.2.3-9', description: 'Perfiladora Profiler (8 pts) – 10 gr', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-160hrs', createdAt: new Date().toISOString() },
  { id: 'lp-923-11', componentId: 'c-perf-husillo-bolas', code: '9.2.3-11', description: 'Husillo de Bolas (6 pts) – 5 gr', lubricantId: 'lub-kp2k', method: 'manual', quantity: 5, frequencyId: 'freq-160hrs', createdAt: new Date().toISOString() },
  { id: 'lp-923-12', componentId: 'c-perf-rod-central', code: '9.2.3-12', description: 'Rodamiento Central BV (2 pts) – 10 gr', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-160hrs', createdAt: new Date().toISOString() },
  { id: 'lp-923-13', componentId: 'c-perf-rod-bv', code: '9.2.3-13', description: 'Rodamientos BV-HV-HF (12 pts) – 10 gr', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-160hrs', createdAt: new Date().toISOString() },

  // ===== 9.2.4 PERFILADORA - Mensual =====
  { id: 'lp-924-2', componentId: 'c-perf-cadena', code: '9.2.4-2', description: 'Cadena de Transmisión (2 pts)', lubricantId: 'lub-cadenas', method: 'manual', quantity: 50, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },
  { id: 'lp-924-3', componentId: 'c-perf-motor-perske', code: '9.2.4-3', description: 'Motor Sierra Perske (12 pts) – Ver manual', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 0, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },
  { id: 'lp-924-15', componentId: 'c-perf-motor-sew', code: '9.2.4-15', description: 'Motor de Ajuste SEW (5 pts) – Ver manual', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 0, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },
  { id: 'lp-924-16', componentId: 'c-perf-motor-perf', code: '9.2.4-16', description: 'Motor de la Perfiladora (4 pts) – Ver placa', lubricantId: 'lub-grasa-i-ii', method: 'manual', quantity: 0, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },

  // ===== 9.3.1 WD H84 - Trimestral =====
  { id: 'lp-931-1', componentId: 'c-wd-coj-sup', code: '9.3.1-1', description: 'Cojinete Rodillos Avance Sup. (Der./Izq.)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-931-2', componentId: 'c-wd-coj-inf', code: '9.3.1-2', description: 'Cojinete Rodillos Avance Inf. (Der./Izq.)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },

  // ===== 9.3.1 WD H84 - Semestral =====
  { id: 'lp-931-3', componentId: 'c-wd-husillo', code: '9.3.1-3', description: 'Cojinete Husillo Reg. Guía Madera (Superior)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-semestral', createdAt: new Date().toISOString() },

  // ===== 9.3.2 WD FR10 - Trimestral =====
  { id: 'lp-932-1', componentId: 'c-fr10-cil-inf-ext', code: '9.3.2-1', description: 'Cojinetes Cilindro Inf. Extracción (Izq./Der.)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-932-3', componentId: 'c-fr10-cil-sup-ext', code: '9.3.2-3', description: 'Cojinete Cilindro Sup. Extracción (Izq./Der.)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-932-5', componentId: 'c-fr10-cil-sup-int', code: '9.3.2-5', description: 'Cojinete Cilindros Sup. Introducción (Izq./Der.)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },
  { id: 'lp-932-7', componentId: 'c-fr10-cil-inf-int', code: '9.3.2-7', description: 'Cojinete Cilindros Inf. Introducción (Izq./Der.)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-trimestral', createdAt: new Date().toISOString() },

  // ===== 9.3.2 WD FR10 - Semestral =====
  { id: 'lp-932-2', componentId: 'c-fr10-estribo-ext', code: '9.3.2-2', description: 'Cojinete Estribo Cilindro Extracción (Izq./Der.)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-semestral', createdAt: new Date().toISOString() },
  { id: 'lp-932-6', componentId: 'c-fr10-estribo-int', code: '9.3.2-6', description: 'Cojinete Estribo Cilindros Introducción (Izq./Der.)', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-semestral', createdAt: new Date().toISOString() },
  { id: 'lp-932-8', componentId: 'c-fr10-husillo-guia', code: '9.3.2-8', description: 'Cojinete Husillo Reg. Guía', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-semestral', createdAt: new Date().toISOString() },

  // ===== 9.3.2 WD FR10 - Anual =====
  { id: 'lp-932-4', componentId: 'c-fr10-bisagra', code: '9.3.2-4', description: 'Cojinete Bisagra Puerta', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-anual', createdAt: new Date().toISOString() },

  // ===== 9.3.3 WD FR10 - Mensual =====
  { id: 'lp-933-10', componentId: 'c-fr10-cardan', code: '9.3.3-10', description: 'Cojinete Árbol Cardán y Árbol Sierra', lubricantId: 'lub-kp2k', method: 'manual', quantity: 10, frequencyId: 'freq-mensual', createdAt: new Date().toISOString() },
];

// ============================================================
// RESUMEN DE TAREAS POR FRECUENCIA
// ============================================================



// Función helper para obtener tareas por fecha
export function getTareasPorFecha(fecha: Date): LubricationPoint[] {
  const dayOfMonth = fecha.getDate();
  const dayOfWeek = fecha.getDay(); // 0=Dom, 1=Lun, etc.

  return PUNTOS_LUBRICACION.filter(lp => {
    switch (lp.frequencyId) {
      case 'freq-8hrs': return true; // Diario
      case 'freq-dia-medio': return dayOfMonth % 2 === 1; // Días impares
      case 'freq-40hrs': return dayOfWeek === 1; // Lunes
      case 'freq-160hrs': return dayOfMonth === 1 || dayOfMonth === 15; // 1 y 15 del mes
      case 'freq-mensual': return dayOfMonth === 1; // 1er día del mes
      case 'freq-trimestral': return dayOfMonth === 1 && [0, 3, 6, 9].includes(fecha.getMonth()); // Ene, Abr, Jul, Oct
      case 'freq-semestral': return dayOfMonth === 1 && [0, 6].includes(fecha.getMonth()); // Ene, Jul
      case 'freq-anual': return dayOfMonth === 1 && fecha.getMonth() === 0; // 1 de Enero
      default: return false;
    }
  });
}
