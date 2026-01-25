/**
 * AISA/Foresa Real Data Seeder v2 - Modular Version
 * 
 * Imports from modular data files and generates SQL for the 5 selected areas.
 * 
 * Usage: npx tsx scripts/seed-real-data-v2.ts
 */

import { writeFileSync } from 'fs';
import { PLANT, AREAS } from './real-data/areas';
import { MACHINES_8001, MACHINES_8002 } from './real-data/machines-611';
import { MACHINES_8010 } from './real-data/machines-8010';

// Combine all machines
const allMachines = [...MACHINES_8001, ...MACHINES_8002, ...MACHINES_8010];

function generateSQL(): string {
    const lines: string[] = [
        '-- ============================================',
        '-- AISA/Foresa Real Data Seed v2',
        '-- 5 Areas: 8001, 8002, 8004, 8007, 8010',
        '-- Generated: ' + new Date().toISOString(),
        '-- ============================================',
        '',
        '-- Clear existing data',
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
        '-- Plant',
        `INSERT INTO plants (id, name, location) VALUES ('${PLANT.id}', '${PLANT.name}', '${PLANT.location}');`,
        '',
        '-- Areas (5 selected)',
    ];

    AREAS.forEach(area => {
        lines.push(`INSERT INTO areas (id, plant_id, name) VALUES ('${area.id}', '${area.plantId}', 'CG ${area.cgCode} / CC ${area.ccCode} - ${area.name}');`);
    });

    lines.push('');
    lines.push('-- Machines');

    allMachines.forEach(machine => {
        const safeName = machine.name.replace(/'/g, "''");
        lines.push(`INSERT INTO machines (id, area_id, name, status) VALUES ('${machine.id}', '${machine.areaId}', '[${machine.code}] ${safeName}', 'active');`);
    });

    lines.push('');
    lines.push('-- Lubricants');
    lines.push("INSERT INTO lubricants (id, name, type) VALUES ('lub-grupo1', 'Grupo 1 - Aceite', 'aceite');");
    lines.push("INSERT INTO lubricants (id, name, type) VALUES ('lub-grupo2', 'Grupo 2 - Grasa EP', 'grasa');");
    lines.push("INSERT INTO lubricants (id, name, type) VALUES ('lub-grupo5', 'Grupo 5 - Grasa KP2K', 'grasa');");
    lines.push("INSERT INTO lubricants (id, name, type) VALUES ('lub-det', 'Detergente - Limpieza', 'otro');");
    lines.push("INSERT INTO lubricants (id, name, type) VALUES ('lub-nbu15', 'ISOFLEX NBU 15', 'grasa');");

    lines.push('');
    lines.push('-- Frequencies');
    lines.push("INSERT INTO frequencies (id, name, days) VALUES ('freq-daily', 'Diaria', 1);");
    lines.push("INSERT INTO frequencies (id, name, days) VALUES ('freq-eod', 'Dia por Medio', 2);");
    lines.push("INSERT INTO frequencies (id, name, days) VALUES ('freq-weekly', 'Semanal', 7);");
    lines.push("INSERT INTO frequencies (id, name, days) VALUES ('freq-biweekly', 'Quincenal', 14);");
    lines.push("INSERT INTO frequencies (id, name, days) VALUES ('freq-monthly', 'Mensual', 30);");
    lines.push("INSERT INTO frequencies (id, name, days) VALUES ('freq-quarterly', 'Trimestral', 90);");
    lines.push("INSERT INTO frequencies (id, name, days) VALUES ('freq-annual', 'Anual', 365);");

    lines.push('');
    lines.push(`-- Summary: ${AREAS.length} areas, ${allMachines.length} machines`);

    return lines.join('\n');
}

// Generate and save
const sql = generateSQL();
writeFileSync('./scripts/seed-real-data-v2.sql', sql);
console.log(sql);
console.log('\n✅ SQL saved to: scripts/seed-real-data-v2.sql');
console.log(`📊 Areas: ${AREAS.length} | Machines: ${allMachines.length}`);
