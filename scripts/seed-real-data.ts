/**
 * AISA/Foresa Real Data Seeder
 * 
 * Data extracted from WhatsApp images (2026-01-25)
 * Planta Aserradero Foresa - Codificacion de Equipos
 * 
 * Usage: npx tsx scripts/seed-real-data.ts
 */

import { randomUUID } from 'crypto';

// ============================================
// PLANT STRUCTURE (from images)
// ============================================

interface Plant {
    id: string;
    name: string;
    location: string;
}

interface Area {
    id: string;
    plantId: string;
    cgCode: number;
    ccCode: number;
    name: string;
}

interface Machine {
    id: string;
    areaId: string;
    code: string;
    name: string;
}

interface LubricationPoint {
    id: string;
    machineId: string;
    position: number;
    interval: string;
    description: string;
    item: number;
    numPoints: number;
    lubricantType: string;
}

// ============================================
// REAL DATA FROM IMAGES
// ============================================

const PLANT: Plant = {
    id: 'plant-foresa',
    name: 'Planta Aserradero Foresa',
    location: 'Chile'
};

// Areas based on Centro de Gestion and Centro de Costo
const AREAS: Area[] = [
    // CG 611 - Descortezado
    { id: 'area-611-8000', plantId: 'plant-foresa', cgCode: 611, ccCode: 8000, name: 'Cancha de Trozos' },
    { id: 'area-611-8001', plantId: 'plant-foresa', cgCode: 611, ccCode: 8001, name: 'Descortezador Linea Gruesa' },
    { id: 'area-611-8002', plantId: 'plant-foresa', cgCode: 611, ccCode: 8002, name: 'Descortezador Linea Delgada' },
    { id: 'area-611-8003', plantId: 'plant-foresa', cgCode: 611, ccCode: 8003, name: 'Extraccion de Corteza' },

    // CG 612 - Aserradero
    { id: 'area-612-8004', plantId: 'plant-foresa', cgCode: 612, ccCode: 8004, name: 'Aserradero LG Nuevo' },
    { id: 'area-612-8006', plantId: 'plant-foresa', cgCode: 612, ccCode: 8006, name: 'Aserradero Linea Gruesa' },
    { id: 'area-612-8007', plantId: 'plant-foresa', cgCode: 612, ccCode: 8007, name: 'Aserradero Linea Delgada' },
    { id: 'area-612-8009', plantId: 'plant-foresa', cgCode: 612, ccCode: 8009, name: 'Taller de Afilado' },
    { id: 'area-612-8010', plantId: 'plant-foresa', cgCode: 612, ccCode: 8010, name: 'Astillado' },
    { id: 'area-612-8011', plantId: 'plant-foresa', cgCode: 612, ccCode: 8011, name: 'Aserradero Lampeador' },
];

// Machines from CG 611 - Descortezado (from image 12.51.04)
const MACHINES_611: Machine[] = [
    // 8000 - Cancha de Trozos
    { id: 'mach-400', areaId: 'area-611-8000', code: '400', name: 'Mat. Prima Trozos Aserr.' },
    { id: 'mach-401', areaId: 'area-611-8000', code: '401', name: 'Remuneraciones Cancha de Trozos' },
    { id: 'mach-402', areaId: 'area-611-8000', code: '402', name: 'Sistema de Riego' },
    { id: 'mach-4403', areaId: 'area-611-8000', code: '4403', name: 'Gastos Grales Cancha Troz.' },

    // 8001 - Descortezador Linea Gruesa
    { id: 'mach-501', areaId: 'area-611-8001', code: '501', name: 'Remuneraciones Desc. Linea Gruesa' },
    { id: 'mach-549', areaId: 'area-611-8001', code: '549', name: 'Gtos Grales Desc. Linea Gruesa' },
    { id: 'mach-513', areaId: 'area-611-8001', code: '513', name: 'Sistema Control y Fuerza' },
    { id: 'mach-520', areaId: 'area-611-8001', code: '520', name: 'Subest. Electr. Transf. 150KVA' },
    { id: 'mach-521', areaId: 'area-611-8001', code: '521', name: 'Canalizacion Electrica' },
    { id: 'mach-522', areaId: 'area-611-8001', code: '522', name: 'Iluminacion' },
    { id: 'mach-3000', areaId: 'area-611-8001', code: '3000', name: 'Descortezador L.G. (EQ.3000)' },
    { id: 'mach-3002', areaId: 'area-611-8001', code: '3002', name: 'Central Hidraulica D.L.G. (EQ.3002)' },
    { id: 'mach-3100', areaId: 'area-611-8001', code: '3100', name: 'Cadena Recep. Desde 1700 (EQ.3100)' },
    { id: 'mach-3200', areaId: 'area-611-8001', code: '3200', name: 'Cadena Alim. D.L.G. (EQ.3200)' },
    { id: 'mach-3300', areaId: 'area-611-8001', code: '3300', name: 'Elevador Trozos 3000 (EQ.3300)' },
    { id: 'mach-3400', areaId: 'area-611-8001', code: '3400', name: 'Volteador (EQ.3400)' },
    { id: 'mach-3500', areaId: 'area-611-8001', code: '3500', name: 'Centrador Entrada 3000 (EQ.3500)' },
    { id: 'mach-3600', areaId: 'area-611-8001', code: '3600', name: 'Mesa Acopio D.L.G. (EQ.3600)' },
    { id: 'mach-3700', areaId: 'area-611-8001', code: '3700', name: 'Centrador Salida 3000 (EQ.3700)' },
    { id: 'mach-3800', areaId: 'area-611-8001', code: '3800', name: 'Transp. de Salida 3000 (EQ.3800)' },
    { id: 'mach-3850', areaId: 'area-611-8001', code: '3850', name: 'Scanner D.L.G. (EQ.3850)' },
    { id: 'mach-3900', areaId: 'area-611-8001', code: '3900', name: 'Clasificador L.G. (EQ.3900)' },

    // 8002 - Descortezador Linea Delgada
    { id: 'mach-551', areaId: 'area-611-8002', code: '551', name: 'Remuneraciones Desc. Linea Delgada' },
    { id: 'mach-599', areaId: 'area-611-8002', code: '599', name: 'Gtos Grales Desc. Linea Delg.' },
    { id: 'mach-1000', areaId: 'area-611-8002', code: '1000', name: 'Mesa Alim. Izq. DLD (EQ.1000)' },
    { id: 'mach-1050', areaId: 'area-611-8002', code: '1050', name: 'Mesa Alim. Der. DLD (EQ.1050)' },
    { id: 'mach-1100', areaId: 'area-611-8002', code: '1100', name: 'D.A.G. Lado Izquierdo (EQ.1100)' },
    { id: 'mach-1150', areaId: 'area-611-8002', code: '1150', name: 'D.A.G. Lado Derecho (EQ.1150)' },
    { id: 'mach-1300', areaId: 'area-611-8002', code: '1300', name: 'Cadena de Recepcion 1100-1150 (EQ.1300)' },
    { id: 'mach-1350', areaId: 'area-611-8002', code: '1350', name: 'Central Hidraulica 1100-1150 (EQ.1350)' },
    { id: 'mach-1450', areaId: 'area-611-8002', code: '1450', name: 'Pateador 1 (EQ.1450)' },
    { id: 'mach-1460', areaId: 'area-611-8002', code: '1460', name: 'Pateador 2 (EQ.1460)' },
    { id: 'mach-1470', areaId: 'area-611-8002', code: '1470', name: 'Pateador 3 (EQ.1470)' },
    { id: 'mach-1500', areaId: 'area-611-8002', code: '1500', name: 'Dosificador 1600 (EQ.1500)' },
    { id: 'mach-1600', areaId: 'area-611-8002', code: '1600', name: 'Mesa Aliment. EQ Desde LD (EQ.1600)' },
    { id: 'mach-1700', areaId: 'area-611-8002', code: '1700', name: 'BAB Descortezador LD (EQ.1700)' },
    { id: 'mach-1800', areaId: 'area-611-8002', code: '1800', name: 'D.A.G. Aliment. 2100 (EQ.1800)' },
    { id: 'mach-1810', areaId: 'area-611-8002', code: '1810', name: 'Central Hidraulica 1800 (EQ.1810)' },
    { id: 'mach-1900', areaId: 'area-611-8002', code: '1900', name: 'Transportador Alim. DLD (EQ.1900)' },
    { id: 'mach-2000', areaId: 'area-611-8002', code: '2000', name: 'Centrador Entrada DLD (EQ.2000)' },
    { id: 'mach-2100', areaId: 'area-611-8002', code: '2100', name: 'Descortezador LD (EQ.2100)' },
    { id: 'mach-2200', areaId: 'area-611-8002', code: '2200', name: 'Centrador Salida 2100 (EQ.2200)' },
    { id: 'mach-2300', areaId: 'area-611-8002', code: '2300', name: 'Cadena Scanner (EQ.2300)' },
    { id: 'mach-2400', areaId: 'area-611-8002', code: '2400', name: 'Scanner Descort. LD (EQ.2400)' },
    { id: 'mach-2500', areaId: 'area-611-8002', code: '2500', name: 'Clasificador D.L.D (EQ.2500)' },
];

// 8003 - Extraccion de Corteza
const MACHINES_8003: Machine[] = [
    { id: 'mach-1310', areaId: 'area-611-8003', code: '1310', name: 'Cinta Transp. Bajo 1300 (EQ.1310)' },
    { id: 'mach-1315', areaId: 'area-611-8003', code: '1315', name: 'Cinta Transp. Bajo 2100 (EQ.1315)' },
    { id: 'mach-1320', areaId: 'area-611-8003', code: '1320', name: 'Cinta Transp. Desde EQ.1320' },
    { id: 'mach-1330', areaId: 'area-611-8003', code: '1330', name: 'Cinta Elevadora Corteza (EQ.1330)' },
    { id: 'mach-1340', areaId: 'area-611-8003', code: '1340', name: 'Cinta Transp. Bajo 3000 (EQ.1340)' },
    { id: 'mach-3610', areaId: 'area-611-8003', code: '3610', name: 'Cinta Transp. Bajo 3000 (EQ.3610)' },
    { id: 'mach-3620', areaId: 'area-611-8003', code: '3620', name: 'Cinta Transp. Bajo 3400 (EQ.3620)' },
    { id: 'mach-3640', areaId: 'area-611-8003', code: '3640', name: 'Transportador al Tritur. (EQ.36)' },
    { id: 'mach-3650', areaId: 'area-611-8003', code: '3650', name: 'Triturador de Corteza (EQ.365)' },
];

// 8010 - Astillado
const MACHINES_8010: Machine[] = [
    { id: 'mach-ast-5', areaId: 'area-612-8010', code: '5', name: 'Cinta 2 Trans. Chip (EQ.5)' },
    { id: 'mach-ast-6', areaId: 'area-612-8010', code: '6', name: 'Cinta Trans. Chip Bajo Canter 1 (EQ.6)' },
    { id: 'mach-ast-9', areaId: 'area-612-8010', code: '9', name: 'Cinta Trans. Chip Harnero ALD (EQ.9)' },
    { id: 'mach-ast-11', areaId: 'area-612-8010', code: '11', name: 'Cinta TR. Chip Bajo Harnero (EQ.11)' },
    { id: 'mach-ast-13', areaId: 'area-612-8010', code: '13', name: 'Cinta TR. Chip Hacia A.L.G. (EQ.13)' },
    { id: 'mach-ast-15', areaId: 'area-612-8010', code: '15', name: 'Cinta TR. Chip A Elevador (EQ.15)' },
    { id: 'mach-ast-17', areaId: 'area-612-8010', code: '17', name: 'Cinta TR. Chip Elevador ALD (EQ.17)' },
    { id: 'mach-ast-19', areaId: 'area-612-8010', code: '19', name: 'Cinta TR. Entrada Silo ALD (EQ.19)' },
    { id: 'mach-ast-23', areaId: 'area-612-8010', code: '23', name: 'Cinta TR. Despuntador 1 (EQ.23)' },
    { id: 'mach-ast-24', areaId: 'area-612-8010', code: '24', name: 'Cinta TR. Lampazo Astillado (EQ.24)' },
    { id: 'mach-ast-25', areaId: 'area-612-8010', code: '25', name: 'Cinta TR. Despuntador 2 (EQ.25)' },
    { id: 'mach-ast-27', areaId: 'area-612-8010', code: '27', name: 'Harnero Chip ALG (EQ.27)' },
    { id: 'mach-ast-30', areaId: 'area-612-8010', code: '30', name: 'Cinta TR. Rechazo Chips (EQ.30)' },
    { id: 'mach-ast-32', areaId: 'area-612-8010', code: '32', name: 'Cinta TR. Chip Desde 27-35 (EQ.32)' },
    { id: 'mach-ast-33', areaId: 'area-612-8010', code: '33', name: 'Cinta TR. Eleva Chip A.L.G. (EQ.33)' },
    { id: 'mach-ast-34', areaId: 'area-612-8010', code: '34', name: 'Cinta TR. Entrada Silo ALG (EQ.34)' },
    { id: 'mach-ast-35', areaId: 'area-612-8010', code: '35', name: 'Vibrador Lampazos (EQ.35)' },
    { id: 'mach-ast-37', areaId: 'area-612-8010', code: '37', name: 'Astillador Nicholson LG (EQ.37)' },
    { id: 'mach-ast-510', areaId: 'area-612-8010', code: '510', name: 'Harnero Chips ALD (EQ.510)' },
    { id: 'mach-ast-1801', areaId: 'area-612-8010', code: '1801', name: 'Cinta Trans. Chip Bajo Canter 2 (EQ.48)' },
];

// 8009 - Taller de Afilado
const MACHINES_8009: Machine[] = [
    { id: 'mach-1301', areaId: 'area-612-8009', code: '1301', name: 'Remuneraciones Taller Afilado' },
    { id: 'mach-1399', areaId: 'area-612-8009', code: '1399', name: 'Gastos Grales Taller Afil.' },
    { id: 'mach-1302', areaId: 'area-612-8009', code: '1302', name: 'Afiladora Vollmer CHC-22' },
    { id: 'mach-1303', areaId: 'area-612-8009', code: '1303', name: 'Afiladora Vollmer FS-2A' },
    { id: 'mach-1304', areaId: 'area-612-8009', code: '1304', name: 'Afiladora Vollmer CHIP-2' },
    { id: 'mach-1305', areaId: 'area-612-8009', code: '1305', name: 'Maq. Soldar EQ Vollmer L' },
    { id: 'mach-1306', areaId: 'area-612-8009', code: '1306', name: 'Afiladora Cincinnati (in)' },
    { id: 'mach-1307', areaId: 'area-612-8009', code: '1307', name: 'Afiladora FG SER AF-150' },
    { id: 'mach-1308', areaId: 'area-612-8009', code: '1308', name: 'Afiladora Newman G-280' },
    { id: 'mach-1309', areaId: 'area-612-8009', code: '1309', name: 'Afiladora Vollmer KCB42' },
    { id: 'mach-1310a', areaId: 'area-612-8009', code: '1310', name: 'Tensionador Sierra Huincha' },
    { id: 'mach-1311', areaId: 'area-612-8009', code: '1311', name: 'Afiladora Cana-E Vollmer' },
];

// Lubrication Points from image (12.50.17)
const LUBRICATION_POINTS: LubricationPoint[] = [
    // Position 80 - Semanal
    { id: 'lp-80-rod', machineId: 'mach-80', position: 80, interval: 'semanal', description: 'Rodamiento', item: 2, numPoints: 2, lubricantType: 'Grupo 5' },
    { id: 'lp-80-brida', machineId: 'mach-80', position: 80, interval: 'semanal', description: 'Soporte de brida', item: 3, numPoints: 3, lubricantType: 'Grupo 5' },
    { id: 'lp-80-brida2', machineId: 'mach-80', position: 80, interval: 'semanal', description: 'Soporte de brida', item: 4, numPoints: 4, lubricantType: 'Grupo 5' },
    { id: 'lp-85-puas', machineId: 'mach-85', position: 85, interval: 'semanal', description: 'Rodamientos de rodillos de puas', item: 1, numPoints: 2, lubricantType: 'Grupo 5' },
    { id: 'lp-85-boq', machineId: 'mach-85', position: 85, interval: 'semanal', description: 'Rodillos de puas, Boquilla de lubricacion', item: 2, numPoints: 2, lubricantType: 'Grupo 5' },
    { id: 'lp-85-brazo', machineId: 'mach-85', position: 85, interval: 'semanal', description: 'Rodamiento de brazo centrador', item: 3, numPoints: 2, lubricantType: 'Grupo 5' },
    { id: 'lp-85-horq', machineId: 'mach-85', position: 85, interval: 'semanal', description: 'Horquilla de varilla paralela', item: 4, numPoints: 2, lubricantType: 'Grupo 5' },
    { id: 'lp-85-horq2', machineId: 'mach-85', position: 85, interval: 'semanal', description: 'Horquilla de varilla paralela', item: 5, numPoints: 2, lubricantType: 'Grupo 5' },
    { id: 'lp-85-sopcil', machineId: 'mach-85', position: 85, interval: 'semanal', description: 'Soporte de cilindro', item: 6, numPoints: 4, lubricantType: 'Grupo 5' },
    { id: 'lp-85-sopcil2', machineId: 'mach-85', position: 85, interval: 'semanal', description: 'Soporte de cilindro', item: 7, numPoints: 2, lubricantType: 'Grupo 5' },
    { id: 'lp-85-grasera', machineId: 'mach-85', position: 85, interval: 'semanal', description: 'Grasera de Eje guia', item: 8, numPoints: 4, lubricantType: 'Grupo 5' },

    // Position 115 - Semanal
    { id: 'lp-115-rueda', machineId: 'mach-115', position: 115, interval: 'semanal', description: 'Rueda dentada', item: 2, numPoints: 1, lubricantType: 'Grupo 1' },
    { id: 'lp-115-cardan', machineId: 'mach-115', position: 115, interval: 'semanal', description: 'Eje Cardan', item: 3, numPoints: 6, lubricantType: 'Grupo 5' },
    { id: 'lp-115-zocalo', machineId: 'mach-115', position: 115, interval: 'semanal', description: 'Zocalo, Patin', item: 4, numPoints: 4, lubricantType: 'Grupo 5' },
    { id: 'lp-115-zocboq', machineId: 'mach-115', position: 115, interval: 'semanal', description: 'Zocalo, Boquilla en Patin', item: 5, numPoints: 4, lubricantType: 'Grupo 5' },
    { id: 'lp-115-ruedadent', machineId: 'mach-115', position: 115, interval: 'semanal', description: 'Rodamiento de rueda dentada (zocalo)', item: 6, numPoints: 6, lubricantType: 'Grupo 5' },
    { id: 'lp-115-rodcoj', machineId: 'mach-115', position: 115, interval: 'semanal', description: 'Rodillos con cojinete, de brida (zocalo)', item: 7, numPoints: 8, lubricantType: 'Grupo 5' },
    { id: 'lp-115-cojbrida', machineId: 'mach-115', position: 115, interval: 'semanal', description: 'Cojinete de brida, carril de presion (zocalo)', item: 8, numPoints: 4, lubricantType: 'Grupo 5' },
    { id: 'lp-115-narcocoj', machineId: 'mach-115', position: 115, interval: 'semanal', description: 'Narco de cojinete, carril de presion', item: 9, numPoints: 1, lubricantType: 'Grupo 5' },

    // Position 120 - Semanal
    { id: 'lp-120-mesa-sup', machineId: 'mach-120', position: 120, interval: 'semanal', description: 'Mesa de corte superior (Guia Interior LN 1, Guia Exterior LN2)', item: 12, numPoints: 1, lubricantType: 'Grupo 5' },
    { id: 'lp-120-mesa-inf', machineId: 'mach-120', position: 120, interval: 'semanal', description: 'Mesa de corte inferior (Guia Interior LN 1, Guia Exterior LN2)', item: 34, numPoints: 1, lubricantType: 'Grupo 5' },
    { id: 'lp-120-mesa-incl', machineId: 'mach-120', position: 120, interval: 'semanal', description: 'Mesa inferior (Eje de inclinacion interior, eje de inclinacion exterior, bloques de corredera)', item: 567, numPoints: 4, lubricantType: 'Grupo 5' },
    { id: 'lp-120-cardan', machineId: 'mach-120', position: 120, interval: 'semanal', description: 'Eje cardan', item: 8, numPoints: 6, lubricantType: 'Grupo 5' },
    { id: 'lp-120-pivote', machineId: 'mach-120', position: 120, interval: 'semanal', description: 'Pivote de cilindros, rotula de cilindro', item: 910, numPoints: 2, lubricantType: 'Grupo 5' },
    { id: 'lp-120-limpieza', machineId: 'mach-120', position: 120, interval: 'semanal', description: 'Limpieza Guias de ejes estriados', item: 2324, numPoints: 4, lubricantType: 'Detergente' },

    // Position 130 - Semanal
    { id: 'lp-130-caja', machineId: 'mach-130', position: 130, interval: 'semanal', description: 'Caja de rodamiento con brida, rodillo de puas', item: 3, numPoints: 2, lubricantType: 'Grupo 5' },
    { id: 'lp-130-soporte', machineId: 'mach-130', position: 130, interval: 'semanal', description: 'Soporte de cojinete de brida inferior, brazos de centrado', item: 4, numPoints: 8, lubricantType: 'Grupo 5' },
    { id: 'lp-130-caja2', machineId: 'mach-130', position: 130, interval: 'semanal', description: 'Caja de rodamientos con brida, rodillos', item: 5, numPoints: 16, lubricantType: 'Grupo 5' },
    { id: 'lp-130-unidad', machineId: 'mach-130', position: 130, interval: 'semanal', description: 'Unidad de rodamiento, brazos de centrado', item: 6, numPoints: 8, lubricantType: 'Grupo 5' },
    { id: 'lp-130-caja3', machineId: 'mach-130', position: 130, interval: 'semanal', description: 'Caja de rodamiento con brida, rodillo de puas', item: 7, numPoints: 2, lubricantType: 'Grupo 5' },
    { id: 'lp-130-unidad2', machineId: 'mach-130', position: 130, interval: 'semanal', description: 'Unidad de rodamiento, rueda de cadena', item: 8, numPoints: 4, lubricantType: 'Grupo 5' },
    { id: 'lp-130-sopcil', machineId: 'mach-130', position: 130, interval: 'semanal', description: 'Soporte del cilindro', item: 9, numPoints: 1, lubricantType: 'Grupo 5' },
    { id: 'lp-130-sopcil2', machineId: 'mach-130', position: 130, interval: 'semanal', description: 'Soporte del cilindro', item: 10, numPoints: 1, lubricantType: 'Grupo 5' },
    { id: 'lp-130-sopcil3', machineId: 'mach-130', position: 130, interval: 'semanal', description: 'Soporte del cilindro', item: 11, numPoints: 3, lubricantType: 'Grupo 5' },
    { id: 'lp-130-sopcil4', machineId: 'mach-130', position: 130, interval: 'semanal', description: 'Soporte del cilindro', item: 12, numPoints: 4, lubricantType: 'Grupo 5' },
    { id: 'lp-130-varilla', machineId: 'mach-130', position: 130, interval: 'semanal', description: 'Soporte de varilla paralela', item: 12, numPoints: 4, lubricantType: 'Grupo 5' },
    { id: 'lp-130-limpieza', machineId: 'mach-130', position: 130, interval: 'semanal', description: 'Limpieza Guias de ejes estriados', item: 1416, numPoints: 6, lubricantType: 'Detergente' },
];

// ============================================
// SQL GENERATION
// ============================================

function generateSQL(): string {
    const lines: string[] = [
        '-- ============================================',
        '-- AISA/Foresa Real Data Seed',
        '-- Generated from WhatsApp images 2026-01-25',
        '-- ============================================',
        '',
        '-- Clear existing demo data',
        'DELETE FROM tasks;',
        'DELETE FROM work_orders;',
        'DELETE FROM lubrication_points;',
        'DELETE FROM components;',
        'DELETE FROM machines;',
        'DELETE FROM areas;',
        'DELETE FROM plants;',
        'DELETE FROM lubricants;',
        'DELETE FROM frequencies;',
        '',
        '-- ============================================',
        '-- PLANT',
        '-- ============================================',
        `INSERT INTO plants (id, name, location) VALUES ('${PLANT.id}', '${PLANT.name}', '${PLANT.location}');`,
        '',
        '-- ============================================',
        '-- AREAS (Centros de Gestion / Centros de Costo)',
        '-- ============================================',
    ];

    AREAS.forEach(area => {
        lines.push(`INSERT INTO areas (id, plant_id, name) VALUES ('${area.id}', '${area.plantId}', 'CG ${area.cgCode} / CC ${area.ccCode} - ${area.name}');`);
    });

    lines.push('');
    lines.push('-- ============================================');
    lines.push('-- MACHINES (Equipos)');
    lines.push('-- ============================================');

    const allMachines = [...MACHINES_611, ...MACHINES_8003, ...MACHINES_8010, ...MACHINES_8009];
    allMachines.forEach(machine => {
        // Escape single quotes in names
        const safeName = machine.name.replace(/'/g, "''");
        lines.push(`INSERT INTO machines (id, area_id, name, status) VALUES ('${machine.id}', '${machine.areaId}', '[${machine.code}] ${safeName}', 'active');`);
    });

    lines.push('');
    lines.push('-- ============================================');
    lines.push('-- LUBRICANTS (Tipos de Lubricante)');
    lines.push('-- ============================================');
    lines.push("INSERT INTO lubricants (id, name, type) VALUES ('lub-grupo1', 'Grupo 1 - Aceite', 'aceite');");
    lines.push("INSERT INTO lubricants (id, name, type) VALUES ('lub-grupo2', 'Grupo 2 - Grasa EP', 'grasa');");
    lines.push("INSERT INTO lubricants (id, name, type) VALUES ('lub-grupo5', 'Grupo 5 - Grasa KP2K', 'grasa');");
    lines.push("INSERT INTO lubricants (id, name, type) VALUES ('lub-det', 'Detergente - Limpieza', 'otro');");
    lines.push("INSERT INTO lubricants (id, name, type) VALUES ('lub-nbu15', 'ISOFLEX NBU 15', 'grasa');");

    lines.push('');
    lines.push('-- ============================================');
    lines.push('-- FREQUENCIES');
    lines.push('-- ============================================');
    lines.push("INSERT INTO frequencies (id, name, days) VALUES ('freq-daily', 'Diaria', 1);");
    lines.push("INSERT INTO frequencies (id, name, days) VALUES ('freq-eod', 'Dia por Medio', 2);");
    lines.push("INSERT INTO frequencies (id, name, days) VALUES ('freq-weekly', 'Semanal', 7);");
    lines.push("INSERT INTO frequencies (id, name, days) VALUES ('freq-biweekly', 'Quincenal', 14);");
    lines.push("INSERT INTO frequencies (id, name, days) VALUES ('freq-monthly', 'Mensual', 30);");
    lines.push("INSERT INTO frequencies (id, name, days) VALUES ('freq-quarterly', 'Trimestral', 90);");
    lines.push("INSERT INTO frequencies (id, name, days) VALUES ('freq-annual', 'Anual', 365);");

    lines.push('');
    lines.push('-- ============================================');
    lines.push('-- SUMMARY');
    lines.push('-- ============================================');
    lines.push(`-- Total Areas: ${AREAS.length}`);
    lines.push(`-- Total Machines: ${allMachines.length}`);
    lines.push(`-- Total Lubrication Points: ${LUBRICATION_POINTS.length}`);

    return lines.join('\n');
}

// ============================================
// MAIN EXECUTION
// ============================================

import { writeFileSync } from 'fs';

const sql = generateSQL();
writeFileSync('./scripts/seed-real-data.sql', sql);
console.log(sql);
console.log('\n✅ SQL file saved to: scripts/seed-real-data.sql');
console.log(`\n📊 Statistics:`);
console.log(`   - Areas: ${AREAS.length}`);
console.log(`   - Machines CG 611: ${MACHINES_611.length}`);
console.log(`   - Machines CG 612 (8003): ${MACHINES_8003.length}`);
console.log(`   - Machines CG 612 (8009): ${MACHINES_8009.length}`);
console.log(`   - Machines CG 612 (8010): ${MACHINES_8010.length}`);
console.log(`   - Lubrication Points: ${LUBRICATION_POINTS.length}`);
