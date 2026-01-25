/**
 * AISA Lubrication System - February 2026 Schedule Seeder
 * 
 * This script generates work orders and tasks for February 2026
 * based on the lubrication program defined in the AISA manual.
 * 
 * Usage: npx tsx scripts/seed-february-2026.ts
 */

import { randomUUID } from 'crypto';

// ============================================
// TURNO ROTATION LOGIC
// ============================================
// Turno A: Lunes a Viernes (libra Sáb, Dom, Lun)
// Turno B: Martes a Sábado (libra Dom)
// Rotación: Semana 1 = A, Semana 2 = B, ...

interface WorkDay {
    date: string; // YYYY-MM-DD
    dayOfWeek: string;
    turno: 'A' | 'B';
    weekNumber: number;
}

interface TaskDefinition {
    equipment: string;
    code: string;
    cg: number;
    cc: number;
    frequency: 'diaria' | 'dia_por_medio' | 'semanal' | 'quincenal' | 'mensual';
    weekDay?: string; // For weekly tasks
    lubricant: string;
    task: string;
}

// February 2026 calendar
const FEBRUARY_2026: WorkDay[] = [];

// Generate February 2026 work days
function generateFebruaryCalendar(): WorkDay[] {
    const days: WorkDay[] = [];
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // February 2026 starts on Sunday (day 0)
    // Week 1: Feb 2-7 (Turno A: Mon-Fri)
    // Week 2: Feb 9-14 (Turno B: Tue-Sat)
    // Week 3: Feb 16-21 (Turno A: Mon-Fri)
    // Week 4: Feb 23-28 (Turno B: Tue-Sat)

    for (let day = 1; day <= 28; day++) {
        const date = new Date(2026, 1, day); // Month is 0-indexed
        const dayOfWeek = dayNames[date.getDay()];

        // Determine week number (1-indexed, starting from Feb 2)
        const weekNumber = Math.ceil((day - 1) / 7) || 1;

        // Determine turno based on week
        const turno: 'A' | 'B' = weekNumber % 2 === 1 ? 'A' : 'B';

        // Skip non-work days based on turno
        const isWorkDay = turno === 'A'
            ? ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].includes(dayOfWeek)
            : ['Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].includes(dayOfWeek);

        if (isWorkDay) {
            days.push({
                date: `2026-02-${day.toString().padStart(2, '0')}`,
                dayOfWeek,
                turno,
                weekNumber
            });
        }
    }

    return days;
}

// ============================================
// TASK DEFINITIONS FROM MANUAL
// ============================================

const DAILY_TASKS: TaskDefinition[] = [
    // CG 611 - Descortezado
    { equipment: 'Cadenas Descortezador LG', code: '3100', cg: 611, cc: 8001, frequency: 'diaria', lubricant: 'Aceite', task: 'Aceitado' },
    { equipment: 'Cadenas alimentación LG', code: '3200', cg: 611, cc: 8001, frequency: 'diaria', lubricant: 'Aceite', task: 'Aceitado' },
    { equipment: 'Central hidráulica LG', code: '3002', cg: 611, cc: 8001, frequency: 'diaria', lubricant: 'DTE-26', task: 'Verificar nivel' },
    { equipment: 'Cuchillos Descortezador LD', code: '2100', cg: 611, cc: 8002, frequency: 'diaria', lubricant: 'Grasa Roja', task: 'Engrasado' },
    { equipment: 'Cadenas Descortezador LD', code: '2100', cg: 611, cc: 8002, frequency: 'diaria', lubricant: 'Aceite', task: 'Aceitado' },
    { equipment: 'Central hidráulica DAG izq.', code: '1350', cg: 611, cc: 8002, frequency: 'diaria', lubricant: 'DTE-26', task: 'Verificar nivel' },
    { equipment: 'Central hidráulica DAG der.', code: '1810', cg: 611, cc: 8002, frequency: 'diaria', lubricant: 'DTE-26', task: 'Verificar nivel' },

    // CG 612 - Aserradero (8007 - Línea Delgada)
    { equipment: 'Shipper Canter 1', code: '150', cg: 612, cc: 8007, frequency: 'diaria', lubricant: 'Grasa Azul', task: 'Engrasado' },
    { equipment: 'Shipper Canter 2', code: '220', cg: 612, cc: 8007, frequency: 'diaria', lubricant: 'Grasa Azul', task: 'Engrasado' },
    { equipment: 'Central hidráulica Canter 1', code: '42', cg: 612, cc: 8007, frequency: 'diaria', lubricant: 'DTE-26', task: 'Verificar nivel' },
    { equipment: 'Central hidráulica Canter 2', code: '40', cg: 612, cc: 8007, frequency: 'diaria', lubricant: 'DTE-26', task: 'Verificar nivel' },
    { equipment: 'Central hidráulica WD', code: '43', cg: 612, cc: 8007, frequency: 'diaria', lubricant: 'DTE-26', task: 'Verificar nivel' },
    { equipment: 'Central hidráulica 2900', code: '41', cg: 612, cc: 8007, frequency: 'diaria', lubricant: 'DTE-26', task: 'Verificar nivel' },

    // CG 612 - Aserradero (8006 - Línea Gruesa)
    { equipment: 'HMK20', code: '4800', cg: 612, cc: 8006, frequency: 'diaria', lubricant: 'Grasa Azul', task: 'Engrasado' },
    { equipment: 'Canteadora LINCK', code: '5050', cg: 612, cc: 8006, frequency: 'diaria', lubricant: 'Grasa Azul', task: 'Engrasado' },
    { equipment: 'Canteadora ESTERER', code: '5750', cg: 612, cc: 8006, frequency: 'diaria', lubricant: 'Grasa Azul', task: 'Engrasado' },
    { equipment: 'Canteadora CM500', code: '5300', cg: 612, cc: 8006, frequency: 'diaria', lubricant: 'Grasa Azul', task: 'Engrasado' },
    { equipment: 'Central hidráulica HMK20', code: '4810', cg: 612, cc: 8006, frequency: 'diaria', lubricant: 'DTE-26', task: 'Verificar nivel' },
    { equipment: 'Central hidráulica LINCK', code: '5060', cg: 612, cc: 8006, frequency: 'diaria', lubricant: 'DTE-26', task: 'Verificar nivel' },

    // CG 612 - Astillado (8010)
    { equipment: 'Astillador Nicholson LG', code: '37', cg: 612, cc: 8010, frequency: 'diaria', lubricant: 'DTE-26', task: 'Verificar nivel' },
];

const EVERY_OTHER_DAY_TASKS: TaskDefinition[] = [
    { equipment: 'Cuchillos Descortezador LG', code: '3000', cg: 611, cc: 8001, frequency: 'dia_por_medio', lubricant: 'Grasa Roja', task: 'Engrasado' },
    { equipment: 'VQT-1', code: '4200', cg: 612, cc: 8006, frequency: 'dia_por_medio', lubricant: 'Aceite sist.', task: 'Aceitado sistema' },
    { equipment: 'Carro VQT-1', code: '4210', cg: 612, cc: 8006, frequency: 'dia_por_medio', lubricant: 'Aceite sist.', task: 'Aceitado sistema' },
    { equipment: 'VQT-2', code: '4250', cg: 612, cc: 8006, frequency: 'dia_por_medio', lubricant: 'Aceite sist.', task: 'Aceitado sistema' },
    { equipment: 'Carro VQT-2', code: '4260', cg: 612, cc: 8006, frequency: 'dia_por_medio', lubricant: 'Aceite sist.', task: 'Aceitado sistema' },
    { equipment: 'FR-10 (sistema bijur)', code: '300', cg: 612, cc: 8007, frequency: 'dia_por_medio', lubricant: 'DTE-24', task: 'Relleno bijur WD' },
];

const WEEKLY_TASKS: TaskDefinition[] = [
    { equipment: 'Perfiladora LINCK', code: '260', cg: 612, cc: 8007, frequency: 'semanal', weekDay: 'Miércoles', lubricant: 'KP2K', task: 'Engrasado' },
    { equipment: 'FR-10 (WD)', code: '300', cg: 612, cc: 8007, frequency: 'semanal', weekDay: 'Jueves', lubricant: 'Lubricación', task: 'Lubricación' },
    { equipment: 'Cadenas ALG planta baja', code: '-', cg: 612, cc: 8006, frequency: 'semanal', weekDay: 'Martes', lubricant: 'Aceite', task: 'Aceitado' },
    { equipment: 'Cadenas ALG planta baja', code: '-', cg: 612, cc: 8006, frequency: 'semanal', weekDay: 'Jueves', lubricant: 'Aceite', task: 'Aceitado' },
];

const BIWEEKLY_TASKS: TaskDefinition[] = [
    { equipment: 'Espárragos VQT-1', code: '4200', cg: 612, cc: 8006, frequency: 'quincenal', lubricant: 'Grasa Azul', task: 'Engrasado' },
    { equipment: 'Espárragos VQT-2', code: '4250', cg: 612, cc: 8006, frequency: 'quincenal', lubricant: 'Grasa Azul', task: 'Engrasado' },
    { equipment: 'Harneros', code: '-', cg: 612, cc: 8006, frequency: 'quincenal', lubricant: 'Grasa Azul', task: 'Engrasado' },
    { equipment: 'Máquina GRIMME', code: '5500', cg: 612, cc: 8006, frequency: 'quincenal', lubricant: 'Grasa Azul', task: 'Engrasado' },
];

const BIWEEKLY_SATURDAY_TASKS: TaskDefinition[] = [
    { equipment: 'Rotor Descortezador LG', code: '3000', cg: 611, cc: 8001, frequency: 'quincenal', lubricant: '80W-90', task: 'Lavado + cambio aceite' },
    { equipment: 'Rotor Descortezador LD', code: '2100', cg: 611, cc: 8002, frequency: 'quincenal', lubricant: '80W-90', task: 'Lavado + cambio aceite' },
];

const MONTHLY_TASKS: TaskDefinition[] = [
    { equipment: 'Reductor Descortezador LG', code: '3000', cg: 611, cc: 8001, frequency: 'mensual', lubricant: 'EP-150', task: 'Revisión nivel aceite' },
    { equipment: 'Motor reductor Descortezador LG', code: '3000', cg: 611, cc: 8001, frequency: 'mensual', lubricant: '-', task: 'Revisión general' },
    { equipment: 'Rodamientos y soportes LG', code: '3000', cg: 611, cc: 8001, frequency: 'mensual', lubricant: 'Grasa Azul', task: 'Engrasado completo' },
    { equipment: 'Reductor Descortezador LD', code: '2100', cg: 611, cc: 8002, frequency: 'mensual', lubricant: 'EP-150', task: 'Revisión nivel aceite' },
    { equipment: 'Motor reductor Descortezador LD', code: '2100', cg: 611, cc: 8002, frequency: 'mensual', lubricant: '-', task: 'Revisión general' },
    { equipment: 'Rodamientos y soportes LD', code: '2100', cg: 611, cc: 8002, frequency: 'mensual', lubricant: 'Grasa Azul', task: 'Engrasado completo' },
    { equipment: 'Reductores ALG', code: '-', cg: 612, cc: 8006, frequency: 'mensual', lubricant: 'EP-150', task: 'Cambio aceite' },
    { equipment: 'Soportes y rótulas', code: '-', cg: 612, cc: 8006, frequency: 'mensual', lubricant: '-', task: 'Revisión estado' },
];

// ============================================
// SQL GENERATION
// ============================================

function generateWorkOrdersSQL(): string {
    const calendar = generateFebruaryCalendar();
    const lines: string[] = [
        '-- ============================================',
        '-- AISA Lubrication System',
        '-- February 2026 Schedule Seed',
        '-- Generated: ' + new Date().toISOString(),
        '-- ============================================',
        '',
        '-- Clear existing February 2026 data',
        "DELETE FROM tasks WHERE work_order_id IN (SELECT id FROM work_orders WHERE scheduled_date LIKE '2026-02-%');",
        "DELETE FROM work_orders WHERE scheduled_date LIKE '2026-02-%';",
        '',
        '-- ============================================',
        '-- WORK ORDERS',
        '-- ============================================',
        ''
    ];

    // Generate work orders for each work day
    calendar.forEach(day => {
        const workOrderId = randomUUID();
        lines.push(`-- ${day.date} (${day.dayOfWeek}) - Turno ${day.turno} - Semana ${day.weekNumber}`);
        lines.push(`INSERT INTO work_orders (id, scheduled_date, status, created_at) VALUES`);
        lines.push(`  ('${workOrderId}', '${day.date}', 'pendiente', datetime('now'));`);
        lines.push('');

        // Daily tasks
        DAILY_TASKS.forEach(task => {
            const taskId = randomUUID();
            lines.push(`INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES`);
            lines.push(`  ('${taskId}', '${workOrderId}', '${task.code}', 'pendiente', '${task.equipment} - ${task.task} (${task.lubricant})', datetime('now'));`);
        });

        // Every other day tasks (odd days only)
        const dayNum = parseInt(day.date.split('-')[2]);
        if (dayNum % 2 === 1) {
            EVERY_OTHER_DAY_TASKS.forEach(task => {
                const taskId = randomUUID();
                lines.push(`INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES`);
                lines.push(`  ('${taskId}', '${workOrderId}', '${task.code}', 'pendiente', '${task.equipment} - ${task.task} (${task.lubricant})', datetime('now'));`);
            });
        }

        // Weekly tasks
        WEEKLY_TASKS.forEach(task => {
            if (task.weekDay === day.dayOfWeek) {
                const taskId = randomUUID();
                lines.push(`INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES`);
                lines.push(`  ('${taskId}', '${workOrderId}', '${task.code}', 'pendiente', '${task.equipment} - ${task.task} (${task.lubricant})', datetime('now'));`);
            }
        });

        // Biweekly tasks (weeks 1 and 3)
        if (day.weekNumber % 2 === 1 && day.dayOfWeek === 'Viernes') {
            BIWEEKLY_TASKS.forEach(task => {
                const taskId = randomUUID();
                lines.push(`INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES`);
                lines.push(`  ('${taskId}', '${workOrderId}', '${task.code}', 'pendiente', '${task.equipment} - ${task.task} QUINCENAL (${task.lubricant})', datetime('now'));`);
            });
        }

        // Saturday biweekly tasks (weeks 2 and 4, Turno B only)
        if (day.turno === 'B' && day.dayOfWeek === 'Sábado' && (day.weekNumber === 2 || day.weekNumber === 4)) {
            BIWEEKLY_SATURDAY_TASKS.forEach(task => {
                const taskId = randomUUID();
                lines.push(`INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES`);
                lines.push(`  ('${taskId}', '${workOrderId}', '${task.code}', 'pendiente', '${task.equipment} - ${task.task} SABADO QUINCENAL (${task.lubricant})', datetime('now'));`);
            });
        }

        // Monthly tasks (first week of month only)
        if (day.weekNumber === 1 && day.dayOfWeek === 'Viernes') {
            MONTHLY_TASKS.forEach(task => {
                const taskId = randomUUID();
                lines.push(`INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES`);
                lines.push(`  ('${taskId}', '${workOrderId}', '${task.code}', 'pendiente', '${task.equipment} - ${task.task} MENSUAL (${task.lubricant})', datetime('now'));`);
            });
        }

        lines.push('');
    });

    // Summary
    lines.push('-- ============================================');
    lines.push('-- SUMMARY');
    lines.push('-- ============================================');
    lines.push(`-- Work Days: ${calendar.length}`);
    lines.push(`-- Turno A Days: ${calendar.filter(d => d.turno === 'A').length}`);
    lines.push(`-- Turno B Days: ${calendar.filter(d => d.turno === 'B').length}`);
    lines.push(`-- Daily Tasks per day: ${DAILY_TASKS.length}`);
    lines.push(`-- Total estimated tasks: ~${calendar.length * DAILY_TASKS.length + Math.ceil(calendar.length / 2) * EVERY_OTHER_DAY_TASKS.length}`);

    return lines.join('\n');
}

// ============================================
// MAIN EXECUTION
// ============================================

const sql = generateWorkOrdersSQL();
console.log(sql);

// Also save to file
import { writeFileSync } from 'fs';
writeFileSync('./scripts/seed-february-2026.sql', sql);
console.log('\n✅ SQL file saved to: scripts/seed-february-2026.sql');

// Print calendar summary
console.log('\n📅 February 2026 Work Calendar:');
const calendar = generateFebruaryCalendar();
calendar.forEach(day => {
    console.log(`  ${day.date} | ${day.dayOfWeek.padEnd(10)} | Turno ${day.turno} | Semana ${day.weekNumber}`);
});
