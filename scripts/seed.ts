import { db } from '../lib/db';
import { users, plants, areas, machines, components, lubricants, frequencies, lubricationPoints } from '../lib/db/schema';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function seed() {
    console.log('🌱 Seeding database...');

    // 1. Users
    console.log('Inserting Users...');
    await db.insert(users).values([
        { id: 'user-dev-1', name: 'Desarrollador AISA', email: 'dev@aisa.cl', role: 'desarrollador' },
        { id: 'user-lub-1', name: 'Omar Alexis', email: 'omar@aisa.cl', role: 'lubricador' },
        { id: 'user-sup-1', name: 'Enrique Gonzáles M.', email: 'supervisor@aisa.cl', role: 'supervisor' },
    ]).onConflictDoNothing();

    // 2. Plants & Areas
    console.log('Inserting Plants...');
    const plantId = 'planta-aisa-main';
    await db.insert(plants).values({ id: plantId, name: 'Planta Principal AISA', location: 'Los Angeles, CL' }).onConflictDoNothing();

    const areaId = 'area-sierra';
    await db.insert(areas).values({ id: areaId, plantId, name: 'Sierra Principal' }).onConflictDoNothing();

    // 3. Machines
    console.log('Inserting Machines...');
    const machineId = 'mach-descortezador';
    await db.insert(machines).values({ id: machineId, areaId, name: 'Descortezador' }).onConflictDoNothing();

    // 4. Lubricants & Frequencies
    console.log('Inserting Catalog...');
    const lubId = 'lub-mobil-600';
    await db.insert(lubricants).values({ id: lubId, name: 'Mobilgear 600 XP 220', type: 'aceite', pricePerUnit: 15000 }).onConflictDoNothing();

    const freqId = 'freq-semanal';
    await db.insert(frequencies).values({ id: freqId, name: 'Semanal', days: 7 }).onConflictDoNothing();

    // 5. Components & Points
    const compId = 'comp-rotor';
    await db.insert(components).values({ id: compId, machineId, name: 'Rotor Principal' }).onConflictDoNothing();

    await db.insert(lubricationPoints).values({
        id: 'lp-3000-rotor',
        componentId: compId,
        lubricantId: lubId,
        frequencyId: freqId,
        code: 'LP-001',
        method: 'manual',
        quantity: 500,
        unit: 'ml'
    }).onConflictDoNothing();

    console.log('✅ Database seeded successfully!');
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
