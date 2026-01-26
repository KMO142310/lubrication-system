
import { db } from '../lib/db';
import { users, plants, areas, machines, components, lubricants, frequencies, lubricationPoints, workOrders, tasks } from '../lib/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function reseed() {
    console.log('🌱 Iniciando Re-Seed Completo del Sistema...');

    // 1. Limpieza (Orden inverso a dependencias)
    try {
        console.log('🗑️  Limpiando tablas existentes...');
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
        console.warn('⚠️  Advertencia al limpiar (puede ser primera vez):', e);
    }

    // 2. Usuarios Maestros
    console.log('👤 Insertando Usuarios...');
    const techId = uuidv4();
    await db.insert(users).values([
        { id: 'user-dev-1', name: 'Desarrollador AISA', email: 'dev@aisa.cl', role: 'desarrollador', password: 'aisa' },
        { id: techId, name: 'Omar Alexis', email: 'omar@aisa.cl', role: 'lubricador', password: 'aisa' },
    ]);

    // 3. Catálogos (Lubricantes y Frecuencias)
    console.log('📚 Insertando Catálogos...');

    // Lubricantes
    const lubMap = {
        'aceite': 'lub-aceite-gen',
        'grasa': 'lub-grasa-gen',
        'dte26': 'lub-dte26',
        'kp2k': 'lub-kp2k'
    };

    await db.insert(lubricants).values([
        { id: lubMap['aceite'], name: 'Aceite General', type: 'aceite' },
        { id: lubMap['grasa'], name: 'Grasa Azul EP2', type: 'grasa' },
        { id: lubMap['dte26'], name: 'Mobil DTE 26', type: 'aceite' },
        { id: lubMap['kp2k'], name: 'Grasa KP2K', type: 'grasa' },
    ]);

    // Frecuencias
    const freqMap = {
        'diaria': 'freq-diaria',
        'semanal': 'freq-semanal',
        'quincenal': 'freq-quincenal',
        'mensual': 'freq-mensual'
    };

    await db.insert(frequencies).values([
        { id: freqMap['diaria'], name: 'Diaria', days: 1 },
        { id: freqMap['semanal'], name: 'Semanal', days: 7 },
        { id: freqMap['quincenal'], name: 'Quincenal', days: 15 },
        { id: freqMap['mensual'], name: 'Mensual', days: 30 },
    ]);

    // 4. Planta y Áreas
    console.log('🏭 Insertando Planta y Áreas...');
    const plantId = 'plant-foresa';
    await db.insert(plants).values({ id: plantId, name: 'Planta Aserradero Foresa' });

    const areaId = 'area-8006';
    await db.insert(areas).values({ id: areaId, plantId, name: 'Aserradero Línea Gruesa (8006)' });

    // 5. Equipos y Puntos (Datos Reales del 8006)
    console.log('⚙️  Insertando Equipos 8006...');

    // Definición de equipos y sus puntos críticos
    const equipments = [
        {
            name: 'HMK20', code: '4800', points: [
                { type: 'Engrasado', lub: lubMap['grasa'], freq: freqMap['diaria'] },
                { type: 'Rodillo Entrada', lub: lubMap['grasa'], freq: freqMap['semanal'] }
            ]
        },
        {
            name: 'Central Hidráulica HMK20', code: '4810', points: [
                { type: 'Verificar nivel', lub: lubMap['dte26'], freq: freqMap['diaria'] }
            ]
        },
        {
            name: 'Canteadora LINCK', code: '5050', points: [
                { type: 'Engrasado Guías', lub: lubMap['grasa'], freq: freqMap['diaria'] }
            ]
        },
        {
            name: 'Canteadora ESTERER', code: '5750', points: [
                { type: 'Engrasado General', lub: lubMap['grasa'], freq: freqMap['diaria'] }
            ]
        },
        {
            name: 'PENDU', code: '6600', points: [
                { type: 'Engrasado', lub: lubMap['grasa'], freq: freqMap['diaria'] },
                { type: 'Cadenas', lub: lubMap['aceite'], freq: freqMap['semanal'] }
            ]
        },
        {
            name: 'Clasificador LG', code: '3900', points: [
                { type: 'Engrasado', lub: lubMap['grasa'], freq: freqMap['quincenal'] }
            ]
        },
        {
            name: 'Triturador Corteza', code: '3650', points: [
                { type: 'Engrasado Rodamientos', lub: lubMap['grasa'], freq: freqMap['semanal'] }
            ]
        }
    ];

    let pointCount = 0;

    for (const eq of equipments) {
        const machId = uuidv4();
        await db.insert(machines).values({
            id: machId,
            areaId,
            name: `[${eq.code}] ${eq.name}`
        });

        // Componente default
        const compId = uuidv4();
        await db.insert(components).values({
            id: compId,
            machineId: machId,
            name: 'General'
        });

        // Puntos
        for (const pt of eq.points) {
            await db.insert(lubricationPoints).values({
                id: uuidv4(),
                componentId: compId,
                lubricantId: pt.lub,
                frequencyId: pt.freq,
                code: `LP-${eq.code}-${Math.floor(Math.random() * 100)}`,
                method: 'manual',
                quantity: 50,
                unit: 'gr'
            });
            pointCount++;
        }
    }

    console.log(`✅ ${equipments.length} equipos y ${pointCount} puntos insertados.`);

    // 6. Generar Work Orders para mañana (Prueba Inmediata)
    console.log('📅 Generando Órdenes de Trabajo para Hoy/Mañana...');

    // Obtener todos los puntos diarios
    const dailyPoints = await db.select().from(lubricationPoints).where(eq(lubricationPoints.frequencyId, freqMap['diaria'])); // Esto requeriria importar eq, lo simulo

    // Simular creación simple
    const allPoints = await db.select().from(lubricationPoints); // Traer todos para demo

    const woId = uuidv4();
    const today = new Date().toISOString().split('T')[0];

    await db.insert(workOrders).values({
        id: woId,
        scheduledDate: today,
        status: 'pendiente',
        technicianId: techId
    });

    for (const pt of allPoints) {
        await db.insert(tasks).values({
            id: uuidv4(),
            workOrderId: woId,
            lubricationPointId: pt.id,
            status: 'pendiente',
            observations: 'Generado automáticamente'
        });
    }

    console.log(`✅ Orden de Trabajo ${woId} creada con ${allPoints.length} tareas.`);
    console.log('\n🚀 RE-SEED COMPLETADO EXITOSAMENTE');
}

reseed().catch(console.error);
