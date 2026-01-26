/**
 * Migrar datos reales del Manual AISA 2026 a Supabase
 * 
 * Este script puebla Supabase con los mismos datos que usamos en SQLite local.
 * Esto permite que la app funcione en Vercel (producción).
 * 
 * Usage: npx tsx scripts/seed-supabase-real-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Faltan credenciales de Supabase en .env.local');
    console.log('   Necesitas: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// DATOS REALES DEL MANUAL AISA 2026
// ============================================

const LUBRICANTS = [
    { id: 'lub-dte26', name: 'DTE-26 (Mobil)', type: 'aceite' },
    { id: 'lub-dte24', name: 'DTE-24 (Mobil)', type: 'aceite' },
    { id: 'lub-ep150', name: 'EP-150 (Mobil)', type: 'aceite' },
    { id: 'lub-80w90', name: '80W-90 (Mobil)', type: 'aceite' },
    { id: 'lub-grasa-azul', name: 'Grasa Azul', type: 'grasa' },
    { id: 'lub-grasa-roja', name: 'Grasa Roja', type: 'grasa' },
    { id: 'lub-kp2k', name: 'KP2K', type: 'grasa' },
    { id: 'lub-nbu15', name: 'ISOFLEX NBU 15', type: 'grasa' },
    { id: 'lub-grasa-iyii', name: 'Grasa I y II', type: 'grasa' },
];

const FREQUENCIES = [
    { id: 'freq-8hrs', name: 'Cada 8 horas (Diaria)', interval_days: 1 },
    { id: 'freq-dia-por-medio', name: 'Día por medio', interval_days: 2 },
    { id: 'freq-40hrs', name: 'Cada 40 horas (Semanal)', interval_days: 7 },
    { id: 'freq-160hrs', name: 'Cada 160 horas (Quincenal)', interval_days: 14 },
    { id: 'freq-mensual', name: 'Mensual', interval_days: 30 },
    { id: 'freq-7000hrs', name: 'Cada 7000 horas (Anual)', interval_days: 365 },
];

const AREAS = [
    { id: 'area-8001', name: 'CG 611 / CC 8001 - Descortezador Línea Gruesa' },
    { id: 'area-8002', name: 'CG 611 / CC 8002 - Descortezador Línea Delgada' },
    { id: 'area-8006', name: 'CG 612 / CC 8006 - Aserradero Línea Gruesa' },
    { id: 'area-8007', name: 'CG 612 / CC 8007 - Aserradero Línea Delgada' },
    { id: 'area-8010', name: 'CG 612 / CC 8010 - Astillado' },
];

const EQUIPMENT = [
    // 8006 - Línea Gruesa (equipos más críticos)
    { id: 'eq-hmk20', area_id: 'area-8006', code: '4800', name: 'HMK20', status: 'active' },
    { id: 'eq-pendu', area_id: 'area-8006', code: '6600', name: 'PENDU', status: 'active' },
    { id: 'eq-cant-linck', area_id: 'area-8006', code: '5050', name: 'Canteadora LINCK', status: 'active' },
    { id: 'eq-cant-esterer', area_id: 'area-8006', code: '5750', name: 'Canteadora ESTERER', status: 'active' },
    // 8007 - Línea Delgada
    { id: 'eq-canter1', area_id: 'area-8007', code: '150', name: 'Shipper Canter 1', status: 'active' },
    { id: 'eq-canter2', area_id: 'area-8007', code: '220', name: 'Shipper Canter 2', status: 'active' },
    { id: 'eq-perf-linck', area_id: 'area-8007', code: '260', name: 'Perfiladora LINCK', status: 'active' },
    // 8001 - Descortezador LG
    { id: 'eq-desc-lg', area_id: 'area-8001', code: '3000', name: 'Descortezador LG', status: 'active' },
    // 8002 - Descortezador LD
    { id: 'eq-desc-ld', area_id: 'area-8002', code: '2100', name: 'Descortezador LD', status: 'active' },
];

const LUBRICATION_POINTS = [
    // HMK20
    {
        id: 'lp-hmk20-1', equipment_id: 'eq-hmk20', lubricant_id: 'lub-grasa-azul', frequency_id: 'freq-8hrs',
        code: 'LP-4800-1', name: 'Engrasado general HMK20', quantity: 50, unit: 'gr', method: 'manual'
    },
    // PENDU
    {
        id: 'lp-pendu-1', equipment_id: 'eq-pendu', lubricant_id: 'lub-grasa-azul', frequency_id: 'freq-8hrs',
        code: 'LP-6600-1', name: 'Engrasado general PENDU', quantity: 50, unit: 'gr', method: 'manual'
    },
    // Canteadora LINCK
    {
        id: 'lp-clinck-1', equipment_id: 'eq-cant-linck', lubricant_id: 'lub-grasa-azul', frequency_id: 'freq-8hrs',
        code: 'LP-5050-1', name: 'Engrasado general Canteadora LINCK', quantity: 50, unit: 'gr', method: 'manual'
    },
    // Perfiladora LINCK
    {
        id: 'lp-perf-1', equipment_id: 'eq-perf-linck', lubricant_id: 'lub-kp2k', frequency_id: 'freq-8hrs',
        code: 'LP-260-1', name: 'Guías lineales BV y ejes HV', quantity: 10, unit: 'gr', method: 'manual'
    },
    {
        id: 'lp-perf-2', equipment_id: 'eq-perf-linck', lubricant_id: 'lub-kp2k', frequency_id: 'freq-40hrs',
        code: 'LP-260-2', name: 'Husillo roscado trapezoidal', quantity: 10, unit: 'gr', method: 'manual'
    },
    {
        id: 'lp-perf-3', equipment_id: 'eq-perf-linck', lubricant_id: 'lub-kp2k', frequency_id: 'freq-160hrs',
        code: 'LP-260-3', name: 'Rodamientos BV-HV-HF', quantity: 10, unit: 'gr', method: 'manual'
    },
    // Descortezador LG
    {
        id: 'lp-dlg-1', equipment_id: 'eq-desc-lg', lubricant_id: 'lub-grasa-roja', frequency_id: 'freq-dia-por-medio',
        code: 'LP-3000-1', name: 'Cuchillos Descortezador LG', quantity: 50, unit: 'gr', method: 'manual'
    },
    {
        id: 'lp-dlg-2', equipment_id: 'eq-desc-lg', lubricant_id: 'lub-80w90', frequency_id: 'freq-160hrs',
        code: 'LP-3000-2', name: 'Rotor - Lavado + cambio aceite', quantity: 2000, unit: 'ml', method: 'manual'
    },
    // Canter 1
    {
        id: 'lp-c1-1', equipment_id: 'eq-canter1', lubricant_id: 'lub-grasa-iyii', frequency_id: 'freq-40hrs',
        code: 'LP-C1-1', name: 'Cardan de transmisión', quantity: 80, unit: 'gr', method: 'manual'
    },
    {
        id: 'lp-c1-2', equipment_id: 'eq-canter1', lubricant_id: 'lub-grasa-iyii', frequency_id: 'freq-mensual',
        code: 'LP-C1-2', name: 'Rodamiento polea transmisión', quantity: 100, unit: 'gr', method: 'manual'
    },
];

async function seedSupabase() {
    console.log('🌱 INICIANDO SEED DE SUPABASE CON DATOS REALES...\n');

    // 1. Lubricantes
    console.log('🛢️  Insertando Lubricantes...');
    const { error: lubError } = await supabase.from('lubricants').upsert(LUBRICANTS, { onConflict: 'id' });
    if (lubError) console.error('   Error:', lubError.message);
    else console.log(`   ✅ ${LUBRICANTS.length} lubricantes`);

    // 2. Frecuencias
    console.log('⏱️  Insertando Frecuencias...');
    const { error: freqError } = await supabase.from('frequencies').upsert(FREQUENCIES, { onConflict: 'id' });
    if (freqError) console.error('   Error:', freqError.message);
    else console.log(`   ✅ ${FREQUENCIES.length} frecuencias`);

    // 3. Áreas (como plants en Supabase)
    console.log('📍 Insertando Áreas...');
    const { error: areaError } = await supabase.from('plants').upsert(
        AREAS.map(a => ({ id: a.id, name: a.name, location: 'Chile' })),
        { onConflict: 'id' }
    );
    if (areaError) console.error('   Error:', areaError.message);
    else console.log(`   ✅ ${AREAS.length} áreas`);

    // 4. Equipos (como machines en Supabase)
    console.log('⚙️  Insertando Equipos...');
    const { error: eqError } = await supabase.from('machines').upsert(
        EQUIPMENT.map(e => ({ id: e.id, plant_id: e.area_id, name: `[${e.code}] ${e.name}`, status: e.status })),
        { onConflict: 'id' }
    );
    if (eqError) console.error('   Error:', eqError.message);
    else console.log(`   ✅ ${EQUIPMENT.length} equipos`);

    // 5. Puntos de Lubricación
    console.log('📌 Insertando Puntos de Lubricación...');
    const { error: lpError } = await supabase.from('lubrication_points').upsert(
        LUBRICATION_POINTS.map(lp => ({
            id: lp.id,
            machine_id: lp.equipment_id,
            lubricant_id: lp.lubricant_id,
            frequency_id: lp.frequency_id,
            code: lp.code,
            name: lp.name,
            quantity: lp.quantity,
            unit: lp.unit,
            method: lp.method
        })),
        { onConflict: 'id' }
    );
    if (lpError) console.error('   Error:', lpError.message);
    else console.log(`   ✅ ${LUBRICATION_POINTS.length} puntos`);

    // 6. Orden de Trabajo para hoy
    console.log('📋 Creando Orden de Trabajo para hoy...');
    const today = new Date().toISOString().split('T')[0];
    const woId = `wo-${today}`;

    const { error: woError } = await supabase.from('work_orders').upsert({
        id: woId,
        scheduled_date: today,
        status: 'pendiente',
        technician_id: null,
        notes: 'Orden generada automáticamente desde Manual AISA 2026'
    }, { onConflict: 'id' });

    if (woError) console.error('   Error:', woError.message);
    else console.log(`   ✅ Orden de trabajo ${woId}`);

    // 7. Tareas para hoy (solo puntos diarios)
    console.log('✅ Creando Tareas del día...');
    const dailyPoints = LUBRICATION_POINTS.filter(lp =>
        lp.frequency_id === 'freq-8hrs' || lp.frequency_id === 'freq-dia-por-medio'
    );

    const tasksToInsert = dailyPoints.map((lp, idx) => ({
        id: `task-${today}-${idx}`,
        work_order_id: woId,
        lubrication_point_id: lp.id,
        status: 'pendiente',
        observations: `Tarea: ${lp.name}`
    }));

    const { error: taskError } = await supabase.from('tasks').upsert(tasksToInsert, { onConflict: 'id' });
    if (taskError) console.error('   Error:', taskError.message);
    else console.log(`   ✅ ${tasksToInsert.length} tareas para hoy`);

    console.log('\n🎉 SEED COMPLETADO');
    console.log(`   La app en Vercel ahora tiene datos reales del Manual AISA 2026`);
}

seedSupabase().catch(console.error);
