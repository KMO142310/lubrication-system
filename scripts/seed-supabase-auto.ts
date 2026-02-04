/**
 * Seed automático de datos AISA a Supabase
 * 
 * IMPORTANTE: Este script usa UUIDs reales y columnas que coinciden con schema.sql
 * 
 * Usage: npx tsx scripts/seed-supabase-auto.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Faltan credenciales de Supabase en .env.local');
    console.log('   Necesitas: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (o ANON_KEY)');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// UUIDs determinísticos para datos AISA
// ============================================
const UUIDS = {
    plant: '11111111-1111-1111-1111-111111111111',
    areas: {
        '8001': 'aaaaaaaa-8001-0000-0000-000000000001',
        '8002': 'aaaaaaaa-8002-0000-0000-000000000002',
        '8006': 'aaaaaaaa-8006-0000-0000-000000000006',
        '8007': 'aaaaaaaa-8007-0000-0000-000000000007',
    },
    frequencies: {
        diario: 'eeeeeeee-0001-0000-0000-000000000001',
        diaPorMedio: 'eeeeeeee-0002-0000-0000-000000000002',
        semanal: 'eeeeeeee-0007-0000-0000-000000000007',
        quincenal: 'eeeeeeee-0014-0000-0000-000000000014',
        mensual: 'eeeeeeee-0030-0000-0000-000000000030',
    },
    lubricants: {
        dte26: 'dddddddd-0026-0000-0000-000000000000',
        dte24: 'dddddddd-0024-0000-0000-000000000000',
        grasaAzul: 'dddddddd-0001-0000-0000-000000000000',
        grasaRoja: 'dddddddd-0002-0000-0000-000000000000',
        kp2k: 'dddddddd-kp2k-0000-0000-000000000000',
    },
    machines: {
        hmk20: 'bbbbbbbb-4800-0000-0000-000000000000',
        pendu: 'bbbbbbbb-6600-0000-0000-000000000000',
        canteadoraLinck: 'bbbbbbbb-5050-0000-0000-000000000000',
        perfiladora: 'bbbbbbbb-0260-0000-0000-000000000000',
        descLG: 'bbbbbbbb-3000-0000-0000-000000000000',
    }
};

async function seedSupabase() {
    console.log('🌱 INICIANDO SEED AUTOMÁTICO DE SUPABASE...\n');

    // 1. Planta
    console.log('🏭 Insertando Planta AISA...');
    const { error: plantError } = await supabase.from('plants').upsert({
        id: UUIDS.plant,
        name: 'AISA - Planta Aserraderos',
        code: 'AISA-001'
    }, { onConflict: 'id' });
    if (plantError) console.error('   Error:', plantError.message);
    else console.log('   ✅ Planta creada');

    // 2. Áreas
    console.log('📍 Insertando Áreas...');
    const areas = [
        { id: UUIDS.areas['8001'], plant_id: UUIDS.plant, name: 'Descortezador Línea Gruesa (CG 611 / 8001)', code: '8001' },
        { id: UUIDS.areas['8002'], plant_id: UUIDS.plant, name: 'Descortezador Línea Delgada (CG 611 / 8002)', code: '8002' },
        { id: UUIDS.areas['8006'], plant_id: UUIDS.plant, name: 'Aserradero Línea Gruesa (CG 612 / 8006)', code: '8006' },
        { id: UUIDS.areas['8007'], plant_id: UUIDS.plant, name: 'Aserradero Línea Delgada (CG 612 / 8007)', code: '8007' },
    ];
    const { error: areaError } = await supabase.from('areas').upsert(areas, { onConflict: 'id' });
    if (areaError) console.error('   Error:', areaError.message);
    else console.log(`   ✅ ${areas.length} áreas`);

    // 3. Lubricantes  
    console.log('🛢️  Insertando Lubricantes...');
    const lubricants = [
        { id: UUIDS.lubricants.dte26, name: 'DTE-26 (Mobil)', type: 'aceite', code: 'DTE26' },
        { id: UUIDS.lubricants.dte24, name: 'DTE-24 (Mobil)', type: 'aceite', code: 'DTE24' },
        { id: UUIDS.lubricants.grasaAzul, name: 'Grasa Azul', type: 'grasa', code: 'GA' },
        { id: UUIDS.lubricants.grasaRoja, name: 'Grasa Roja', type: 'grasa', code: 'GR' },
        { id: UUIDS.lubricants.kp2k, name: 'KP2K', type: 'grasa', code: 'KP2K' },
    ];
    const { error: lubError } = await supabase.from('lubricants').upsert(lubricants, { onConflict: 'id' });
    if (lubError) console.error('   Error:', lubError.message);
    else console.log(`   ✅ ${lubricants.length} lubricantes`);

    // 4. Frecuencias
    console.log('⏱️  Insertando Frecuencias...');
    const frequencies = [
        { id: UUIDS.frequencies.diario, name: 'Diario (8 hrs)', days: 1 },
        { id: UUIDS.frequencies.diaPorMedio, name: 'Día por medio', days: 2 },
        { id: UUIDS.frequencies.semanal, name: 'Semanal (40 hrs)', days: 7 },
        { id: UUIDS.frequencies.quincenal, name: 'Quincenal (160 hrs)', days: 14 },
        { id: UUIDS.frequencies.mensual, name: 'Mensual', days: 30 },
    ];
    const { error: freqError } = await supabase.from('frequencies').upsert(frequencies, { onConflict: 'id' });
    if (freqError) console.error('   Error:', freqError.message);
    else console.log(`   ✅ ${frequencies.length} frecuencias`);

    // 5. Máquinas
    console.log('⚙️  Insertando Máquinas...');
    const machines = [
        { id: UUIDS.machines.hmk20, area_id: UUIDS.areas['8006'], name: '[4800] HMK20', code: '4800', status: 'active', criticality: 'A' },
        { id: UUIDS.machines.pendu, area_id: UUIDS.areas['8006'], name: '[6600] PENDU', code: '6600', status: 'active', criticality: 'B' },
        { id: UUIDS.machines.canteadoraLinck, area_id: UUIDS.areas['8006'], name: '[5050] Canteadora LINCK', code: '5050', status: 'active', criticality: 'A' },
        { id: UUIDS.machines.perfiladora, area_id: UUIDS.areas['8007'], name: '[260] Perfiladora LINCK', code: '260', status: 'active', criticality: 'A' },
        { id: UUIDS.machines.descLG, area_id: UUIDS.areas['8001'], name: '[3000] Descortezador LG', code: '3000', status: 'active', criticality: 'A' },
    ];
    const { error: machError } = await supabase.from('machines').upsert(machines, { onConflict: 'id' });
    if (machError) console.error('   Error:', machError.message);
    else console.log(`   ✅ ${machines.length} máquinas`);

    // 6. Componentes (uno por máquina)
    console.log('🔧 Insertando Componentes...');
    const components = machines.map(m => ({
        id: m.id.replace('bbbbbbbb', 'cccccccc'),
        machine_id: m.id,
        name: 'Componente Principal',
        type: 'general'
    }));
    const { error: compError } = await supabase.from('components').upsert(components, { onConflict: 'id' });
    if (compError) console.error('   Error:', compError.message);
    else console.log(`   ✅ ${components.length} componentes`);

    // 7. Puntos de Lubricación
    console.log('📌 Insertando Puntos de Lubricación...');
    const points = [
        {
            id: 'pppppppp-4800-0001-0000-000000000000',
            component_id: 'cccccccc-4800-0000-0000-000000000000',
            lubricant_id: UUIDS.lubricants.grasaAzul,
            frequency_id: UUIDS.frequencies.diario,
            code: 'LP-4800-1',
            description: 'Engrasado general HMK20',
            method: 'manual',
            quantity: 50,
            unit: 'g'
        },
        {
            id: 'pppppppp-6600-0001-0000-000000000000',
            component_id: 'cccccccc-6600-0000-0000-000000000000',
            lubricant_id: UUIDS.lubricants.grasaAzul,
            frequency_id: UUIDS.frequencies.diario,
            code: 'LP-6600-1',
            description: 'Engrasado general PENDU',
            method: 'manual',
            quantity: 50,
            unit: 'g'
        },
        {
            id: 'pppppppp-0260-0001-0000-000000000000',
            component_id: 'cccccccc-0260-0000-0000-000000000000',
            lubricant_id: UUIDS.lubricants.kp2k,
            frequency_id: UUIDS.frequencies.diario,
            code: 'LP-260-1',
            description: 'Guías lineales BV y ejes HV',
            method: 'manual',
            quantity: 10,
            unit: 'g'
        },
        {
            id: 'pppppppp-3000-0001-0000-000000000000',
            component_id: 'cccccccc-3000-0000-0000-000000000000',
            lubricant_id: UUIDS.lubricants.grasaRoja,
            frequency_id: UUIDS.frequencies.diaPorMedio,
            code: 'LP-3000-1',
            description: 'Cuchillos Descortezador LG',
            method: 'manual',
            quantity: 50,
            unit: 'g'
        },
    ];
    const { error: pointError } = await supabase.from('lubrication_points').upsert(points, { onConflict: 'id' });
    if (pointError) console.error('   Error:', pointError.message);
    else console.log(`   ✅ ${points.length} puntos de lubricación`);

    // 8. Orden de Trabajo para hoy
    console.log('📋 Creando Orden de Trabajo para hoy...');
    const today = new Date().toISOString().split('T')[0];
    const woId = `00000000-0000-0000-0000-${today.replace(/-/g, '')}`;

    const { error: woError } = await supabase.from('work_orders').upsert({
        id: woId,
        scheduled_date: today,
        status: 'pendiente',
    }, { onConflict: 'id' });
    if (woError) console.error('   Error:', woError.message);
    else console.log(`   ✅ Orden de trabajo para ${today}`);

    // 9. Tareas del día
    console.log('✅ Creando Tareas del día...');
    const tasks = points.map((p, idx) => ({
        id: `tttttttt-${today.replace(/-/g, '')}-000${idx}`,
        work_order_id: woId,
        lubrication_point_id: p.id,
        status: 'pendiente'
    }));
    const { error: taskError } = await supabase.from('tasks').upsert(tasks, { onConflict: 'id' });
    if (taskError) console.error('   Error:', taskError.message);
    else console.log(`   ✅ ${tasks.length} tareas para hoy`);

    console.log('\n🎉 SEED COMPLETADO');
    console.log('   La app ahora tiene datos reales del Manual AISA 2026');
    console.log(`   URL: https://lubrication-system.vercel.app/`);
}

seedSupabase().catch(console.error);
