/**
 * CODIFICACIÓN DE EQUIPOS - PLANTA ASERRADERO FORESA
 * Extraído de imágenes WhatsApp 2026-01-25
 * 
 * Estructura: Centro de Gestión > Código Agroerraz > Equipos
 */

export interface Equipment {
    code: string;
    name: string;
    costCenter: string;
    lubricationPoints?: number;
}

export interface CostCenter {
    code: string;
    name: string;
    agroerrazCode: string;
    equipment: Equipment[];
}

export interface ManagementCenter {
    code: string;
    name: string;
    costCenters: CostCenter[];
}

// ============================================
// 611 DESCORTEZADO - Centro de Gestión Principal
// ============================================

export const FORESA_EQUIPMENT_DATA: ManagementCenter[] = [
    {
        code: '611',
        name: 'DESCORTEZADO',
        costCenters: [
            // ----------------------------------------
            // 8000 - CANCHA DE TROZOS
            // ----------------------------------------
            {
                code: '8000',
                name: 'CANCHA DE TROZOS',
                agroerrazCode: '8000',
                equipment: [
                    { code: '400', name: 'MAT. PRIMA TROZOS ASERR.', costCenter: '8000' },
                    { code: '401', name: 'REMUNERACIONES CANCHA DE TROZOS', costCenter: '8000' },
                    { code: '402', name: 'SISTEMA DE RIEGO', costCenter: '8000' },
                    { code: '4403', name: 'GASTOS GRALES CANCHA TROZ.', costCenter: '8000' },
                    { code: 'F-GP02', name: 'GRÚA PRENTICE 150 GP02', costCenter: '8000' },
                    { code: 'F-GP03', name: 'GRÚA PRENTICE 150 GP03', costCenter: '8000' },
                    { code: 'F-GP210', name: 'GRÚA PRENTICE 150 GP210', costCenter: '8000' },
                    { code: 'F27-M61', name: 'MOTOSIERRA HUSQVARNA Nº61', costCenter: '8000' },
                    { code: 'F26-TATR', name: 'CAMIÓN TATRA BLANCO', costCenter: '8000' },
                    { code: 'CB-6930', name: 'CAMIÓN NISSAN VERDE', costCenter: '8000' },
                    { code: 'ND-6186', name: 'CAMIÓN TATA BLANCO', costCenter: '8000' },
                ],
            },
            // ----------------------------------------
            // 8001 - DESCORTEZADOR LÍNEA GRUESA
            // ----------------------------------------
            {
                code: '8001',
                name: 'DESCORTEZADOR LÍNEA GRUESA',
                agroerrazCode: '8001',
                equipment: [
                    { code: '501', name: 'REMUNERACIONES DESC. LÍNEA GRUESA', costCenter: '8001' },
                    { code: '549', name: 'GTOS GRALES DESC. LÍNEA GRUESA', costCenter: '8001' },
                    { code: '513', name: 'SISTEMA CONTROL Y FUERZA', costCenter: '8001' },
                    { code: '520', name: 'SUBEST ELECTR. TRANSF. 150KVA', costCenter: '8001' },
                    { code: '521', name: 'CANALIZACIÓN ELÉCTRICA', costCenter: '8001' },
                    { code: '522', name: 'ILUMINACIÓN', costCenter: '8001' },
                    { code: '3000', name: 'DESCORTEZADOR L.G. (EQ.3000)', costCenter: '8001' },
                    { code: '3002', name: 'CENTRAL HIDRÁULICA D.L.G. (EQ.3002)', costCenter: '8001' },
                    { code: '3100', name: 'CADENA RECEP. DESDE 1700 (EQ.3100)', costCenter: '8001' },
                    { code: '3200', name: 'CADENA ALIM. D.L.G. (EQ.3200)', costCenter: '8001' },
                    { code: '3300', name: 'ELEVADOR TROZOS 3000 (EQ.3300)', costCenter: '8001' },
                    { code: '3400', name: 'VOLTEADOR (EQ.3400)', costCenter: '8001' },
                    { code: '3500', name: 'CENTRADOR ENTRADA 3000 (EQ.3500)', costCenter: '8001' },
                    { code: '3700', name: 'CENTRADOR SALIDA 3000 (EQ.3700)', costCenter: '8001' },
                    { code: '3800', name: 'TRANSP. DE SALIDA 3000 (EQ.3800)', costCenter: '8001' },
                    { code: '3850', name: 'SCANNER D.L.G. (EQ.3850)', costCenter: '8001' },
                    { code: '3900', name: 'CLASIFICADOR L.G. (EQ.3900)', costCenter: '8001' },
                ],
            },
            // ----------------------------------------
            // 8002 - DESCORTEZADOR LÍNEA DELGADA
            // ----------------------------------------
            {
                code: '8002',
                name: 'DESCORTEZADOR LÍNEA DELGADA',
                agroerrazCode: '8002',
                equipment: [
                    { code: '551', name: 'REMUNERACIONES DESC. LÍNEA DELGADA', costCenter: '8002' },
                    { code: '599', name: 'GTOS GRALES DESC. LÍNEA DELG.', costCenter: '8002' },
                    { code: '572', name: 'SISTEMA DE CONTROL Y FUERZA', costCenter: '8002' },
                    { code: '580', name: 'SUBEST ELECTR. TRANSF. 160KVA', costCenter: '8002' },
                    { code: '581', name: 'CANALIZACIÓN ELÉCTRICA', costCenter: '8002' },
                    { code: '582', name: 'ILUMINACIÓN', costCenter: '8002' },
                    { code: '1000', name: 'MESA ALIM. IZQ. DLD (EQ.1000)', costCenter: '8002' },
                    { code: '1050', name: 'MESA ALIM. DER. DLD (EQ.1050)', costCenter: '8002' },
                    { code: '1100', name: 'D.A.G. LADO IZQ/ERDO (EQ.1100)', costCenter: '8002' },
                    { code: '1150', name: 'D.A.G. LADO DERECHO (EQ.1150)', costCenter: '8002' },
                    { code: '1300', name: 'CADENA DE RECEPCIÓN 1100-1150 (EQ.1300)', costCenter: '8002' },
                    { code: '1350', name: 'CENTRAL HIDRÁULICA 1100-1150 (EQ.1350)', costCenter: '8002' },
                    { code: '1400', name: 'SCANNER DE TROZOS (EQ.1400)', costCenter: '8002' },
                    { code: '1450', name: 'PATEADOR 1 (EQ.1450)', costCenter: '8002' },
                    { code: '1460', name: 'PATEADOR 2 (EQ.1460)', costCenter: '8002' },
                    { code: '1470', name: 'PATEADOR 3 (EQ.1470)', costCenter: '8002' },
                    { code: '1500', name: 'DOSIFICADOR 1600 (EQ.1500)', costCenter: '8002' },
                    { code: '1600', name: 'MESA ALIMENT. EQ DESDE LD (EQ.1600)', costCenter: '8002' },
                    { code: '1700', name: 'BAB DESCORTEZADOR LD (EQ.1700)', costCenter: '8002' },
                    { code: '1800', name: 'D.A.G. ALIMENT. 2100 (EQ.1800)', costCenter: '8002' },
                    { code: '1810', name: 'CENTRAL HIDRÁULICA 1800 (EQ.1810)', costCenter: '8002' },
                    { code: '1900', name: 'TRANSPORTADOR ALIM. DLD (EQ.1900)', costCenter: '8002' },
                    { code: '2000', name: 'CENTRADOR ENTRADA DLD (EQ.2000)', costCenter: '8002' },
                    { code: '2100', name: 'DESCORTEZADOR CO (EQ.2100)', costCenter: '8002' },
                    { code: '2200', name: 'CENTRADOR SALIDA 2100 (EQ.2200)', costCenter: '8002' },
                    { code: '2300', name: 'CADENA SCANNER (EQ.2300)', costCenter: '8002' },
                    { code: '2400', name: 'SCANNER DESCORT. D.L. (EQ.2400)', costCenter: '8002' },
                    { code: '2500', name: 'CLASIFICADOR D.L.D. (EQ.2500)', costCenter: '8002' },
                ],
            },
            // ----------------------------------------
            // 8003 - EXTRACCIÓN DE CORTEZA
            // ----------------------------------------
            {
                code: '8003',
                name: 'EXTRACCIÓN DE CORTEZA',
                agroerrazCode: '8003',
                equipment: [
                    { code: '1921', name: 'REMUNERACIONES EXTRACTOR CORTEZA', costCenter: '8003' },
                    { code: '1915', name: 'GASTOS GRALES EXTR. CORTEZA', costCenter: '8003' },
                    { code: '1310', name: 'CINTA TRANSP. BAJO 1300 (EQ.1310)', costCenter: '8003' },
                    { code: '1315', name: 'CINTA TRANSP. BAJO 2100 (EQ.1315)', costCenter: '8003' },
                    { code: '1320', name: 'CINTA TRANSP. DESDE DLG (EQ.1320)', costCenter: '8003' },
                    { code: '1330', name: 'CINTA ELEVADORA CORTEZA (EQ.1330)', costCenter: '8003' },
                    { code: '1340', name: 'CINTA TRANSP. BAJO 3000 (EQ.1340)', costCenter: '8003' },
                    { code: '3610', name: 'CINTA TRANSP. BAJO 3000 (EQ.3610)', costCenter: '8003' },
                    { code: '3620', name: 'CINTA TRANSP. BAJO 3400 (EQ.3620)', costCenter: '8003' },
                    { code: '3640', name: 'TRANSPORTADOR AL TRITUR. (EQ.36)', costCenter: '8003' },
                    { code: '3650', name: 'TRITURADOR DE CORTEZA (EQ.365)', costCenter: '8003' },
                    { code: '1308', name: 'BARREDORA', costCenter: '8003' },
                    { code: '1309', name: 'BARREDORA DIRECTA', costCenter: '8003' },
                ],
            },
        ],
    },
    // ============================================
    // 612 ASERRADERO - Centro de Gestión
    // ============================================
    {
        code: '612',
        name: 'ASERRADERO',
        costCenters: [
            {
                code: '8004',
                name: 'ASERRADERO LG. NUEVO (EN OPERACIÓN)',
                agroerrazCode: '8004',
                equipment: [
                    { code: '40', name: 'GRÚA OSIRIS', costCenter: '8004' },
                    { code: '50', name: 'MESA DLG TROZOS 1', costCenter: '8004' },
                    { code: '70', name: 'TRANSPORTE DE TROZOS', costCenter: '8004' },
                    { code: '85', name: 'MESA ENTRADA DE TROZOS', costCenter: '8004' },
                    { code: '88', name: 'TRANSPORTE A LIMPIEZA', costCenter: '8004' },
                    { code: '89', name: 'GRADER', costCenter: '8004' },
                    { code: '130', name: 'CHIPPER CANTER SODERMANN', costCenter: '8004' },
                    { code: '1701', name: 'UNIDAD HIDRÁULICA GENERAL', costCenter: '8004' },
                    { code: '1702', name: 'UNIDAD HIDRÁULICA VIS LAND 1', costCenter: '8004' },
                    { code: '185', name: 'UNIDAD HIDRÁULICA VIS LAND 2', costCenter: '8004' },
                    { code: '290', name: 'RUEDAS LEVA MSL', costCenter: '8004' },
                    { code: '295', name: 'SIERRA DE CORTE', costCenter: '8004' },
                    { code: '480', name: 'PANEL DE ASTILLAS', costCenter: '8004' },
                    { code: '481', name: 'TRANSPORTE ASTILLAS', costCenter: '8004' },
                    { code: '482', name: 'CINTA A TROZADORA A TRITURA', costCenter: '8004' },
                    { code: '483', name: 'CINTA A CINTA TROZOS CHIP', costCenter: '8004' },
                    { code: '491', name: 'TRANSPORTADOR DE ASERRÍN 1', costCenter: '8004' },
                    { code: '492', name: 'CINTA ELEVADORA ASERRÍN 2', costCenter: '8004' },
                    { code: '494', name: 'CINTA ELEVADORA ASERRÍN 1', costCenter: '8004' },
                ],
            },
        ],
    },
];

// ============================================
// PUNTOS DE LUBRICACIÓN POR POSICIÓN
// Extraído de tablas WhatsApp
// ============================================

export interface LubricationPoint {
    position: string;
    interval: string;
    description: string;
    item: number;
    pointCount: number;
    lubricantType: string;
}

export const LUBRICATION_POINTS: LubricationPoint[] = [
    // Posición 80
    { position: '80', interval: 'semanal', description: 'Rodamiento', item: 2, pointCount: 2, lubricantType: 'Grupo 5' },
    { position: '80', interval: 'semanal', description: 'Soporte de brida', item: 3, pointCount: 3, lubricantType: 'Grupo 5' },
    { position: '80', interval: 'semanal', description: 'Soporte de brida', item: 4, pointCount: 4, lubricantType: 'Grupo 5' },

    // Posición 85
    { position: '85', interval: 'semanal', description: 'Rodamientos de rodillos de puas', item: 1, pointCount: 2, lubricantType: 'Grupo 5' },
    { position: '85', interval: 'semanal', description: 'Rodillos de puas, Boquilla de lubricación', item: 2, pointCount: 2, lubricantType: 'Grupo 5' },
    { position: '85', interval: 'semanal', description: 'Rodamiento de brazo centrador', item: 3, pointCount: 2, lubricantType: 'Grupo 5' },
    { position: '85', interval: 'semanal', description: 'Horquilla de varilla paralela', item: 4, pointCount: 2, lubricantType: 'Grupo 5' },
    { position: '85', interval: 'semanal', description: 'Horquilla de varilla paralela', item: 3, pointCount: 2, lubricantType: 'Grupo 5' },
    { position: '85', interval: 'semanal', description: 'Soporte de cilindro', item: 6, pointCount: 4, lubricantType: 'Grupo 5' },
    { position: '85', interval: 'semanal', description: 'Soporte de cilindro', item: 7, pointCount: 2, lubricantType: 'Grupo 5' },
    { position: '85', interval: 'semanal', description: 'Grasera de Eje guía', item: 8, pointCount: 4, lubricantType: 'Grupo 5' },

    // Posición 115
    { position: '115', interval: 'semanal', description: 'Rueda dentada', item: 2, pointCount: 1, lubricantType: 'Grupo 1' },
    { position: '115', interval: 'semanal', description: 'Eje Cardán', item: 3, pointCount: 6, lubricantType: 'Grupo 5' },
    { position: '115', interval: 'semanal', description: 'Zócalo, Patín', item: 4, pointCount: 4, lubricantType: 'Grupo 5' },
    { position: '115', interval: 'semanal', description: 'Zócalo, Boquilla en Patín', item: 5, pointCount: 4, lubricantType: 'Grupo 5' },
    { position: '115', interval: 'semanal', description: 'Rodamiento de rueda dentada (zócalo)', item: 6, pointCount: 6, lubricantType: 'Grupo 5' },
    { position: '115', interval: 'semanal', description: 'Rodillos con cojinete, de brida (zócalo)', item: 7, pointCount: 8, lubricantType: 'Grupo 5' },
    { position: '115', interval: 'semanal', description: 'Cojinete de brida, carril de presión (zócalo)', item: 8, pointCount: 4, lubricantType: 'Grupo 5' },
    { position: '115', interval: 'semanal', description: 'Nariz de cojinete, carril de presión', item: 9, pointCount: 1, lubricantType: 'Grupo 5' },

    // Posición 120
    { position: '120', interval: 'semanal', description: 'Mesa de corte superior (Guía Interior LN 1, Guía Exterior LN2)', item: 1.2, pointCount: 1.1, lubricantType: 'Grupo 5' },
    { position: '120', interval: 'semanal', description: 'Mesa de corte inferior (Guía Interior LN 1, Guía Exterior LN2)', item: 3.4, pointCount: 1.1, lubricantType: 'Grupo 5' },
    { position: '120', interval: 'semanal', description: 'Mesa inferior (Eje de inclinación interior, eje de inclinación exterior, bloques de corredera)', item: 5.67, pointCount: 1.14, lubricantType: 'Grupo 5' },
    { position: '120', interval: 'semanal', description: 'Eje cardán', item: 8, pointCount: 6, lubricantType: 'Grupo 5' },
    { position: '120', interval: 'semanal', description: 'Pivote de cilindros, rótula de cilindro', item: 9.10, pointCount: 8.2, lubricantType: 'Grupo 5' },
    { position: '120', interval: 'semanal', description: 'Limpieza Guías de ejes estriados', item: 23.24, pointCount: 2.4, lubricantType: 'Detergente' },

    // Posiciones 125
    { position: '125-Derecha', interval: 'semanal', description: 'Limpieza Guías de ejes estriados', item: 5, pointCount: 1, lubricantType: 'Detergente' },
    { position: '125-Izquierda', interval: 'semanal', description: 'Limpieza Guías de ejes estriados', item: 5, pointCount: 1, lubricantType: 'Detergente' },
    { position: '130', interval: 'semanal', description: 'Caja de cojinete de brida, lado de accionamiento', item: 2, pointCount: 3, lubricantType: 'Grupo 5' },

    // Posiciones 180-200
    { position: '180.2', interval: 'semanal', description: 'Rodamientos', item: 4, pointCount: 6, lubricantType: 'Grupo 5' },
    { position: '180.2', interval: 'semanal', description: 'Revisar posibles fugas', item: 5, pointCount: 1, lubricantType: 'Grupo 5' },
    { position: '180.3', interval: 'semanal', description: 'Rodamientos', item: 2, pointCount: 12, lubricantType: 'Grupo 5' },
    { position: '180.3', interval: 'semanal', description: 'Revisar posibles fugas', item: 3, pointCount: 1, lubricantType: 'Grupo 5' },
    { position: '180.4', interval: 'semanal', description: 'Rodamientos', item: 1, pointCount: 4, lubricantType: 'Grupo 5' },
    { position: '180.4', interval: 'semanal', description: 'Revisar posibles fugas', item: 3, pointCount: 1, lubricantType: 'Grupo 5' },
    { position: '180.5', interval: 'semanal', description: 'Rodamientos', item: 2, pointCount: 12, lubricantType: 'Grupo 5' },
    { position: '180.5', interval: 'semanal', description: 'Revisar posibles fugas', item: 3, pointCount: 1, lubricantType: 'Grupo 5' },
    { position: '180.6', interval: 'semanal', description: 'Rodamientos', item: 2, pointCount: 9, lubricantType: 'Grupo 5' },
    { position: '180.6', interval: 'semanal', description: 'Rodamientos', item: 3, pointCount: 6, lubricantType: 'Grupo 5' },
    { position: '180.6', interval: 'semanal', description: 'Revisar posibles fugas', item: 4, pointCount: 1, lubricantType: 'Grupo 5' },

    { position: '190.1', interval: 'semanal', description: 'Soportes de Rodamientos', item: 3, pointCount: 4, lubricantType: 'Grupo 5' },
    { position: '190.1', interval: 'semanal', description: 'Revisar posibles fugas', item: 4, pointCount: 1, lubricantType: 'Grupo 5' },
    { position: '190.2', interval: 'semanal', description: 'Soportes de rodamientos', item: 1, pointCount: 4, lubricantType: 'Grupo 5' },
    { position: '190.2', interval: 'semanal', description: 'Revisar posibles fugas', item: 2, pointCount: 1, lubricantType: 'Grupo 5' },
    { position: '190.3', interval: 'semanal', description: 'Soportes de Rodamientos', item: 2, pointCount: 12, lubricantType: 'Grupo 5' },
    { position: '190.3', interval: 'semanal', description: 'Soportes de Rodamientos', item: 3, pointCount: 6, lubricantType: 'Grupo 5' },
    { position: '190.3', interval: 'semanal', description: 'Revisar posibles fugas', item: 4, pointCount: 1, lubricantType: 'Grupo 5' },

    { position: '200.1', interval: 'semanal', description: 'Soporte de rodamientos', item: 1, pointCount: 4, lubricantType: 'Grupo 5' },
    { position: '200.1', interval: 'semanal', description: 'Revisar posibles fugas', item: 2, pointCount: 1, lubricantType: 'Grupo 5' },
    { position: '200.2', interval: 'semanal', description: 'Soportes de Rodamientos', item: 2, pointCount: 12, lubricantType: 'Grupo 5' },
    { position: '200.2', interval: 'semanal', description: 'Soportes de Rodamientos', item: 3, pointCount: 6, lubricantType: 'Grupo 5' },
];

// Helper para obtener equipos por centro de costo
export function getEquipmentByCostCenter(costCenterCode: string): Equipment[] {
    for (const mc of FORESA_EQUIPMENT_DATA) {
        for (const cc of mc.costCenters) {
            if (cc.code === costCenterCode) {
                return cc.equipment;
            }
        }
    }
    return [];
}

// Helper para obtener todos los equipos
export function getAllEquipment(): Equipment[] {
    const all: Equipment[] = [];
    for (const mc of FORESA_EQUIPMENT_DATA) {
        for (const cc of mc.costCenters) {
            all.push(...cc.equipment);
        }
    }
    return all;
}

// Estadísticas
export const EQUIPMENT_STATS = {
    totalManagementCenters: FORESA_EQUIPMENT_DATA.length,
    totalCostCenters: FORESA_EQUIPMENT_DATA.reduce((acc, mc) => acc + mc.costCenters.length, 0),
    totalEquipment: getAllEquipment().length,
    totalLubricationPoints: LUBRICATION_POINTS.length,
};
