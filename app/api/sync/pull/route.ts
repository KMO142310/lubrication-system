import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, plants, areas, machines, components, lubricants, frequencies, lubricationPoints } from '@/lib/db/schema';

export async function GET() {
    try {
        const [
            allUsers,
            allPlants,
            allAreas,
            allMachines,
            allComponents,
            allLubricants,
            allFrequencies,
            allPoints
        ] = await Promise.all([
            db.select().from(users),
            db.select().from(plants),
            db.select().from(areas),
            db.select().from(machines),
            db.select().from(components),
            db.select().from(lubricants),
            db.select().from(frequencies),
            db.select().from(lubricationPoints),
        ]);

        return NextResponse.json({
            lastSync: new Date().toISOString(),
            data: {
                users: allUsers,
                plants: allPlants,
                areas: allAreas,
                machines: allMachines,
                components: allComponents,
                lubricants: allLubricants,
                frequencies: allFrequencies,
                lubricationPoints: allPoints
            }
        });
    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
