import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { users, plants, areas, machines, components, lubricants, frequencies, lubricationPoints } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
    try {
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        // Read-only in GET, but required by type
                    },
                    remove(name: string, options: CookieOptions) {
                        // Read-only in GET, but required by type
                    },
                },
            }
        );

        // 1. Get authenticated user
        const { data: { session } } = await supabase.auth.getSession();

        // Default to developer tenant for now if not authenticated (easier for hybrid mode)
        // In strict production, we would return 401.
        let tenantId = 'tenant-aisa-dev';

        if (session) {
            // Try to resolve tenant from DB user if session exists
            const dbUser = await db.query.users.findFirst({
                where: eq(users.id, session.user.id)
            });
            if (dbUser && dbUser.tenantId) {
                tenantId = dbUser.tenantId;
            }
        }

        // 3. Fetch data filtered by tenant_id
        const [
            tenantUsers,
            tenantPlants,
            tenantAreas,
            tenantMachines,
            tenantComponents,
            tenantLubricants,
            tenantFrequencies,
            tenantPoints
        ] = await Promise.all([
            db.select().from(users).where(eq(users.tenantId, tenantId)),
            db.select().from(plants).where(eq(plants.tenantId, tenantId)),
            db.select().from(areas).where(eq(areas.tenantId, tenantId)),
            db.select().from(machines).where(eq(machines.tenantId, tenantId)),
            db.select().from(components).where(eq(components.tenantId, tenantId)),
            db.select().from(lubricants).where(eq(lubricants.tenantId, tenantId)),
            db.select().from(frequencies).where(eq(frequencies.tenantId, tenantId)),
            db.select().from(lubricationPoints).where(eq(lubricationPoints.tenantId, tenantId)),
        ]);

        return NextResponse.json({
            lastSync: new Date().toISOString(),
            tenantId: tenantId,
            data: {
                users: tenantUsers,
                plants: tenantPlants,
                areas: tenantAreas,
                machines: tenantMachines,
                components: tenantComponents,
                lubricants: tenantLubricants,
                frequencies: tenantFrequencies,
                lubricationPoints: tenantPoints
            }
        });
    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
