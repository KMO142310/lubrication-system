/**
 * AISA Lubrication System - DATOS REALES del Manual Técnico 2026
 * 
 * Datos extraídos de:
 * - MANUAL_TECNICO_LUBRICACION_INDUSTRIAL_AISA_2026.pdf
 * - Copia de PLAN_DETALLADO_LUBRICACION_AISA.xlsx
 * - Copia de PROGRAMA_LUBRICACION_ENERO_2026.xlsx
 * 
 * Usage: npx tsx scripts/seed-real-manual-data.ts
 */

import { db } from '../lib/db';
import { users, plants, areas, machines, components, lubricants, frequencies, lubricationPoints, workOrders, tasks } from '../lib/db/schema';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// ============================================
// DATOS REALES DEL MANUAL AISA 2026
// ============================================

// Lubricantes oficiales (Sección 2.3 del Manual)
const LUBRICANTS_REAL = [
    { id: 'lub-dte26', name: 'DTE-26 (Mobil)', type: 'aceite', application: 'Sistemas hidráulicos' },
    { id: 'lub-dte24', name: 'DTE-24 (Mobil)', type: 'aceite', application: 'Sistemas Bijur' },
    { id: 'lub-ep150', name: 'EP-150 (Mobil)', type: 'aceite', application: 'Reductores y motorreductores' },
    { id: 'lub-80w90', name: '80W-90 (Mobil)', type: 'aceite', application: 'Rotores descortezadores' },
    { id: 'lub-grasa-azul', name: 'Grasa Azul', type: 'grasa', application: 'Uso general, rodamientos' },
    { id: 'lub-grasa-roja', name: 'Grasa Roja', type: 'grasa', application: 'Alta temperatura' },
    { id: 'lub-kp2k', name: 'KP2K', type: 'grasa', application: 'Alta presión extrema' },
    { id: 'lub-nbu15', name: 'ISOFLEX NBU 15', type: 'grasa', application: 'Árbol de sierra' },
    { id: 'lub-grasa-iyii', name: 'Grasa I y II', type: 'grasa', application: 'Rodamientos generales' },
];

// Frecuencias oficiales (Sección 4 del Manual)
const FREQUENCIES_REAL = [
    { id: 'freq-8hrs', name: 'Cada 8 horas (Diaria)', days: 1 },
    { id: 'freq-dia-por-medio', name: 'Día por medio', days: 2 },
    { id: 'freq-40hrs', name: 'Cada 40 horas (Semanal)', days: 7 },
    { id: 'freq-160hrs', name: 'Cada 160 horas (Quincenal)', days: 14 },
    { id: 'freq-mensual', name: 'Mensual', days: 30 },
    { id: 'freq-7000hrs', name: 'Cada 7000 horas (Anual)', days: 365 },
];

// Áreas oficiales (Sección 1.2 y 2.1 del Manual)
const AREAS_REAL = [
    { id: 'area-8001', cgCode: 611, ccCode: 8001, name: 'Descortezador Línea Gruesa' },
    { id: 'area-8002', cgCode: 611, ccCode: 8002, name: 'Descortezador Línea Delgada' },
    { id: 'area-8006', cgCode: 612, ccCode: 8006, name: 'Aserradero Línea Gruesa' },
    { id: 'area-8007', cgCode: 612, ccCode: 8007, name: 'Aserradero Línea Delgada' },
    { id: 'area-8010', cgCode: 612, ccCode: 8010, name: 'Astillado' },
];

// Equipos REALES con tareas de lubricación (Sección 3 y 4 del Manual + Excel)
const EQUIPMENT_WITH_POINTS = [
    // ============ CG 611 - DESCORTEZADO ============
    // 8001 - Descortezador Línea Gruesa
    {
        areaId: 'area-8001', code: '3000', name: 'Descortezador LG', points: [
            { desc: 'Cuchillos', task: 'Engrasado', lub: 'lub-grasa-roja', freq: 'freq-dia-por-medio', qty: 50, unit: 'gr' },
            { desc: 'Rotor', task: 'Lavado + cambio aceite 80W-90', lub: 'lub-80w90', freq: 'freq-160hrs', qty: 2000, unit: 'ml' },
            { desc: 'Reductor', task: 'Revisión nivel aceite', lub: 'lub-ep150', freq: 'freq-mensual', qty: 0, unit: 'verificar' },
            { desc: 'Motor reductor', task: 'Revisión general', lub: 'lub-ep150', freq: 'freq-mensual', qty: 0, unit: 'verificar' },
            { desc: 'Rodamientos y soportes', task: 'Engrasado completo', lub: 'lub-grasa-azul', freq: 'freq-mensual', qty: 200, unit: 'gr' },
        ]
    },
    {
        areaId: 'area-8001', code: '3002', name: 'Central hidráulica LG', points: [
            { desc: 'Depósito', task: 'Verificar nivel', lub: 'lub-dte26', freq: 'freq-8hrs', qty: 0, unit: 'verificar' },
        ]
    },
    {
        areaId: 'area-8001', code: '3100', name: 'Cadena recepción desde 1700', points: [
            { desc: 'Cadena', task: 'Aceitado', lub: 'lub-dte26', freq: 'freq-8hrs', qty: 100, unit: 'ml' },
        ]
    },
    {
        areaId: 'area-8001', code: '3200', name: 'Cadena alimentación LG', points: [
            { desc: 'Cadena', task: 'Aceitado', lub: 'lub-dte26', freq: 'freq-8hrs', qty: 100, unit: 'ml' },
        ]
    },

    // 8002 - Descortezador Línea Delgada
    {
        areaId: 'area-8002', code: '2100', name: 'Descortezador LD', points: [
            { desc: 'Cuchillos', task: 'Engrasado', lub: 'lub-grasa-roja', freq: 'freq-8hrs', qty: 50, unit: 'gr' },
            { desc: 'Cadenas', task: 'Aceitado', lub: 'lub-dte26', freq: 'freq-8hrs', qty: 100, unit: 'ml' },
            { desc: 'Rotor', task: 'Lavado + cambio aceite 80W-90', lub: 'lub-80w90', freq: 'freq-160hrs', qty: 2000, unit: 'ml' },
            { desc: 'Reductor', task: 'Revisión nivel aceite', lub: 'lub-ep150', freq: 'freq-mensual', qty: 0, unit: 'verificar' },
            { desc: 'Rodamientos y soportes', task: 'Engrasado completo', lub: 'lub-grasa-azul', freq: 'freq-mensual', qty: 200, unit: 'gr' },
        ]
    },
    {
        areaId: 'area-8002', code: '1350', name: 'Central hidráulica DAG izq.', points: [
            { desc: 'Depósito', task: 'Verificar nivel', lub: 'lub-dte26', freq: 'freq-8hrs', qty: 0, unit: 'verificar' },
        ]
    },
    {
        areaId: 'area-8002', code: '1810', name: 'Central hidráulica DAG der.', points: [
            { desc: 'Depósito', task: 'Verificar nivel', lub: 'lub-dte26', freq: 'freq-8hrs', qty: 0, unit: 'verificar' },
        ]
    },

    // ============ CG 612 - ASERRADERO ============
    // 8007 - Línea Delgada
    {
        areaId: 'area-8007', code: '150', name: 'Shipper Canter 1', points: [
            { desc: 'Shipper', task: 'Engrasado', lub: 'lub-grasa-azul', freq: 'freq-8hrs', qty: 30, unit: 'gr' },
        ]
    },
    {
        areaId: 'area-8007', code: '220', name: 'Shipper Canter 2', points: [
            { desc: 'Shipper', task: 'Engrasado', lub: 'lub-grasa-azul', freq: 'freq-8hrs', qty: 30, unit: 'gr' },
        ]
    },
    {
        areaId: 'area-8007', code: '42', name: 'Central hidráulica Canter 1', points: [
            { desc: 'Depósito', task: 'Verificar nivel', lub: 'lub-dte26', freq: 'freq-8hrs', qty: 0, unit: 'verificar' },
        ]
    },
    {
        areaId: 'area-8007', code: '40', name: 'Central hidráulica Canter 2', points: [
            { desc: 'Depósito', task: 'Verificar nivel', lub: 'lub-dte26', freq: 'freq-8hrs', qty: 0, unit: 'verificar' },
        ]
    },
    {
        areaId: 'area-8007', code: '43', name: 'Central hidráulica WD', points: [
            { desc: 'Depósito', task: 'Verificar nivel', lub: 'lub-dte26', freq: 'freq-8hrs', qty: 0, unit: 'verificar' },
        ]
    },
    {
        areaId: 'area-8007', code: '41', name: 'Central hidráulica 2900', points: [
            { desc: 'Depósito', task: 'Verificar nivel', lub: 'lub-dte26', freq: 'freq-8hrs', qty: 0, unit: 'verificar' },
        ]
    },
    {
        areaId: 'area-8007', code: '260', name: 'Perfiladora LINCK', points: [
            { desc: 'Guías lineales BV y ejes HV', task: 'Engrasado', lub: 'lub-kp2k', freq: 'freq-8hrs', qty: 10, unit: 'gr' },
            { desc: 'Guía de ajuste', task: 'Engrasado', lub: 'lub-kp2k', freq: 'freq-40hrs', qty: 10, unit: 'gr' },
            { desc: 'Eje de conexión', task: 'Engrasado', lub: 'lub-kp2k', freq: 'freq-40hrs', qty: 10, unit: 'gr' },
            { desc: 'Husillo roscado trapezoidal', task: 'Engrasado', lub: 'lub-kp2k', freq: 'freq-40hrs', qty: 10, unit: 'gr' },
            { desc: 'Rodillos de guía', task: 'Engrasado', lub: 'lub-kp2k', freq: 'freq-160hrs', qty: 10, unit: 'gr' },
            { desc: 'Husillo de bolas', task: 'Engrasado', lub: 'lub-kp2k', freq: 'freq-160hrs', qty: 5, unit: 'gr' },
            { desc: 'Rodamientos BV-HV-HF', task: 'Engrasado', lub: 'lub-kp2k', freq: 'freq-160hrs', qty: 10, unit: 'gr' },
        ]
    },
    {
        areaId: 'area-8007', code: '300', name: 'FR-10 (WD)', points: [
            { desc: 'Sistema Bijur', task: 'Relleno bijur WD', lub: 'lub-dte24', freq: 'freq-dia-por-medio', qty: 500, unit: 'ml' },
        ]
    },

    // 8006 - Línea Gruesa
    {
        areaId: 'area-8006', code: '4800', name: 'HMK20', points: [
            { desc: 'General', task: 'Engrasado', lub: 'lub-grasa-azul', freq: 'freq-8hrs', qty: 50, unit: 'gr' },
        ]
    },
    {
        areaId: 'area-8006', code: '4810', name: 'Central hidráulica HMK20', points: [
            { desc: 'Depósito', task: 'Verificar nivel', lub: 'lub-dte26', freq: 'freq-8hrs', qty: 0, unit: 'verificar' },
        ]
    },
    {
        areaId: 'area-8006', code: '5050', name: 'Canteadora LINCK', points: [
            { desc: 'General', task: 'Engrasado', lub: 'lub-grasa-azul', freq: 'freq-8hrs', qty: 50, unit: 'gr' },
        ]
    },
    {
        areaId: 'area-8006', code: '5060', name: 'Central hidráulica LINCK', points: [
            { desc: 'Depósito', task: 'Verificar nivel', lub: 'lub-dte26', freq: 'freq-8hrs', qty: 0, unit: 'verificar' },
        ]
    },
    {
        areaId: 'area-8006', code: '5750', name: 'Canteadora ESTERER', points: [
            { desc: 'General', task: 'Engrasado', lub: 'lub-grasa-azul', freq: 'freq-8hrs', qty: 50, unit: 'gr' },
        ]
    },
    {
        areaId: 'area-8006', code: '6600', name: 'PENDU', points: [
            { desc: 'General', task: 'Engrasado', lub: 'lub-grasa-azul', freq: 'freq-8hrs', qty: 50, unit: 'gr' },
        ]
    },
    {
        areaId: 'area-8006', code: '4200', name: 'VQT-1', points: [
            { desc: 'Sistema', task: 'Aceitado sistema', lub: 'lub-dte26', freq: 'freq-dia-por-medio', qty: 100, unit: 'ml' },
            { desc: 'Espárragos', task: 'Engrasado', lub: 'lub-grasa-azul', freq: 'freq-160hrs', qty: 50, unit: 'gr' },
        ]
    },
    {
        areaId: 'area-8006', code: '4250', name: 'VQT-2', points: [
            { desc: 'Sistema', task: 'Aceitado sistema', lub: 'lub-dte26', freq: 'freq-dia-por-medio', qty: 100, unit: 'ml' },
            { desc: 'Espárragos', task: 'Engrasado', lub: 'lub-grasa-azul', freq: 'freq-160hrs', qty: 50, unit: 'gr' },
        ]
    },
    {
        areaId: 'area-8006', code: '5500', name: 'Máquina GRIMME', points: [
            { desc: 'General', task: 'Engrasado', lub: 'lub-grasa-azul', freq: 'freq-160hrs', qty: 100, unit: 'gr' },
        ]
    },

    // Canter 1 y 2 - Datos del Plan Detallado Excel
    {
        areaId: 'area-8007', code: 'C1', name: 'Canter 1', points: [
            { desc: 'Rodamiento polea transmisión', task: 'Engrasado', lub: 'lub-grasa-iyii', freq: 'freq-mensual', qty: 100, unit: 'gr' },
            { desc: 'Rodamiento polea dentada', task: 'Engrasado', lub: 'lub-grasa-iyii', freq: 'freq-mensual', qty: 200, unit: 'gr' },
            { desc: 'Rodamiento polea tensora', task: 'Engrasado', lub: 'lub-grasa-iyii', freq: 'freq-mensual', qty: 80, unit: 'gr' },
            { desc: 'Cardan de transmisión', task: 'Engrasado', lub: 'lub-grasa-iyii', freq: 'freq-40hrs', qty: 80, unit: 'gr' },
            { desc: 'Eje de rodillos', task: 'Engrasado', lub: 'lub-grasa-iyii', freq: 'freq-40hrs', qty: 80, unit: 'gr' },
            { desc: 'Rodamiento rodillos vert.', task: 'Engrasado', lub: 'lub-grasa-iyii', freq: 'freq-40hrs', qty: 80, unit: 'gr' },
        ]
    },
    {
        areaId: 'area-8007', code: 'C2', name: 'Canter 2', points: [
            { desc: 'Rodamiento polea transmisión', task: 'Engrasado', lub: 'lub-grasa-iyii', freq: 'freq-mensual', qty: 100, unit: 'gr' },
            { desc: 'Rodamiento polea dentada', task: 'Engrasado', lub: 'lub-grasa-iyii', freq: 'freq-mensual', qty: 200, unit: 'gr' },
            { desc: 'Rodamiento polea tensora', task: 'Engrasado', lub: 'lub-grasa-iyii', freq: 'freq-mensual', qty: 80, unit: 'gr' },
            { desc: 'Cardan de transmisión', task: 'Engrasado', lub: 'lub-grasa-iyii', freq: 'freq-40hrs', qty: 80, unit: 'gr' },
            { desc: 'Eje de rodillos', task: 'Engrasado', lub: 'lub-grasa-iyii', freq: 'freq-40hrs', qty: 80, unit: 'gr' },
            { desc: 'Rodamiento rodillos vert.', task: 'Engrasado', lub: 'lub-grasa-iyii', freq: 'freq-40hrs', qty: 80, unit: 'gr' },
        ]
    },
];

async function seedRealData() {
    console.log('🌱 INICIANDO SEED CON DATOS REALES DEL MANUAL AISA 2026...\n');

    // 1. Limpieza
    console.log('🗑️  Limpiando tablas...');
    try {
        await db.delete(tasks);
        await db.delete(workOrders);
        await db.delete(lubricationPoints);
        await db.delete(components);
        await db.delete(machines);
        await db.delete(areas);
        await db.delete(plants);
        await db.delete(users);
        await db.delete(lubricants);
        await db.delete(frequencies);
    } catch (e) {
        console.warn('⚠️  Tablas posiblemente vacías');
    }

    // 2. Usuarios
    console.log('👤 Insertando Usuarios AISA...');
    const techId = uuidv4();
    await db.insert(users).values([
        { id: 'user-dev', name: 'Desarrollador AISA', email: 'dev@aisa.cl', role: 'desarrollador', password: 'dev2026!' },
        { id: techId, name: 'Omar Alexis', email: 'omar@aisa.cl', role: 'lubricador', password: 'omar123' },
        { id: 'user-sup', name: 'Enrique Gonzáles M.', email: 'supervisor@aisa.cl', role: 'supervisor', password: 'super123' },
    ]);

    // 3. Lubricantes REALES
    console.log('🛢️  Insertando Lubricantes del Manual...');
    for (const lub of LUBRICANTS_REAL) {
        await db.insert(lubricants).values({
            id: lub.id,
            name: lub.name,
            type: lub.type,
        });
    }

    // 4. Frecuencias REALES
    console.log('⏱️  Insertando Frecuencias del Manual...');
    for (const freq of FREQUENCIES_REAL) {
        await db.insert(frequencies).values({
            id: freq.id,
            name: freq.name,
            days: freq.days,
        });
    }

    // 5. Planta
    console.log('🏭 Insertando Planta Foresa...');
    const plantId = 'plant-aisa';
    await db.insert(plants).values({
        id: plantId,
        name: 'Aserradero Industrial S.A. - Planta Chile',
        location: 'Chile'
    });

    // 6. Áreas REALES
    console.log('📍 Insertando Áreas del Manual...');
    for (const area of AREAS_REAL) {
        await db.insert(areas).values({
            id: area.id,
            plantId,
            name: `CG ${area.cgCode} / CC ${area.ccCode} - ${area.name}`,
        });
    }

    // 7. Equipos y Puntos de Lubricación REALES
    console.log('⚙️  Insertando Equipos y Puntos...');
    let totalPoints = 0;
    const allPointIds: string[] = [];

    for (const eq of EQUIPMENT_WITH_POINTS) {
        const machId = uuidv4();
        await db.insert(machines).values({
            id: machId,
            areaId: eq.areaId,
            name: `[${eq.code}] ${eq.name}`,
            status: 'active',
        });

        for (const pt of eq.points) {
            const compId = uuidv4();
            await db.insert(components).values({
                id: compId,
                machineId: machId,
                name: pt.desc,
            });

            const pointId = uuidv4();
            await db.insert(lubricationPoints).values({
                id: pointId,
                componentId: compId,
                lubricantId: pt.lub,
                frequencyId: pt.freq,
                code: `LP-${eq.code}-${totalPoints + 1}`,
                method: 'manual',
                quantity: pt.qty,
                unit: pt.unit,
            });
            allPointIds.push(pointId);
            totalPoints++;
        }
    }

    console.log(`✅ ${EQUIPMENT_WITH_POINTS.length} equipos, ${totalPoints} puntos de lubricación insertados`);

    // 8. Generar Orden de Trabajo para HOY
    console.log('📋 Generando Orden de Trabajo para hoy...');
    const today = new Date().toISOString().split('T')[0];
    const woId = uuidv4();

    await db.insert(workOrders).values({
        id: woId,
        scheduledDate: today,
        status: 'pendiente',
        technicianId: techId,
    });

    // Solo tareas diarias para hoy
    const dailyPoints = allPointIds.slice(0, 20); // Primeros 20 puntos como ejemplo
    for (const pointId of dailyPoints) {
        await db.insert(tasks).values({
            id: uuidv4(),
            workOrderId: woId,
            lubricationPointId: pointId,
            status: 'pendiente',
            observations: 'Tarea generada desde datos reales del Manual AISA 2026',
        });
    }

    console.log(`✅ Orden de Trabajo creada con ${dailyPoints.length} tareas para ${today}`);

    console.log('\n🎉 SEED COMPLETADO CON DATOS REALES DEL MANUAL AISA');
    console.log(`📊 Resumen:`);
    console.log(`   - Lubricantes: ${LUBRICANTS_REAL.length}`);
    console.log(`   - Frecuencias: ${FREQUENCIES_REAL.length}`);
    console.log(`   - Áreas: ${AREAS_REAL.length}`);
    console.log(`   - Equipos: ${EQUIPMENT_WITH_POINTS.length}`);
    console.log(`   - Puntos de Lubricación: ${totalPoints}`);
}

seedRealData().catch(console.error);
