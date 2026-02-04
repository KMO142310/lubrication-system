import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Fallback mock data for when Supabase tables don't exist yet
const MOCK_DATA = {
    users: [],
    plants: [{ id: 'plant-1', name: 'Planta Principal', tenantId: 'tenant-aisa-dev' }],
    areas: [],
    machines: [],
    components: [],
    lubricants: [],
    frequencies: [],
    lubricationPoints: []
};

export async function GET() {
    try {
        const cookieStore = await cookies();

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        // If no Supabase config, return mock data
        if (!supabaseUrl || !supabaseKey) {
            console.warn('No Supabase credentials, returning mock data');
            return NextResponse.json({
                lastSync: new Date().toISOString(),
                tenantId: 'tenant-aisa-dev',
                data: MOCK_DATA,
                source: 'mock'
            });
        }

        const supabase = createServerClient(
            supabaseUrl,
            supabaseKey,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(_name: string, _value: string, _options: CookieOptions) {
                        // Read-only in GET
                    },
                    remove(_name: string, _options: CookieOptions) {
                        // Read-only in GET
                    },
                },
            }
        );

        // Get session (optional - app works without auth for demo)
        const { data: { session } } = await supabase.auth.getSession();
        const tenantId = 'tenant-aisa-dev'; // Default tenant

        // Try to fetch from Supabase tables - with fallback if tables don't exist
        try {
            const [
                { data: tasksData, error: tasksError }
            ] = await Promise.all([
                supabase.from('tasks').select('*').limit(100)
            ]);

            // If tasks table exists and has data
            if (!tasksError && tasksData) {
                return NextResponse.json({
                    lastSync: new Date().toISOString(),
                    tenantId,
                    userId: session?.user?.id || 'anonymous',
                    data: {
                        tasks: tasksData,
                        ...MOCK_DATA
                    },
                    source: 'supabase'
                });
            }

            // Table doesn't exist or empty - return mock
            console.log('No tasks table or empty, returning mock data');
            return NextResponse.json({
                lastSync: new Date().toISOString(),
                tenantId,
                data: MOCK_DATA,
                source: 'mock-fallback'
            });

        } catch (dbError) {
            console.error('Database query error:', dbError);
            // Return mock data on any DB error
            return NextResponse.json({
                lastSync: new Date().toISOString(),
                tenantId,
                data: MOCK_DATA,
                source: 'error-fallback'
            });
        }

    } catch (error) {
        console.error('Sync error:', error);
        // Even on complete failure, return mock data so app doesn't break
        return NextResponse.json({
            lastSync: new Date().toISOString(),
            tenantId: 'tenant-aisa-dev',
            data: MOCK_DATA,
            source: 'critical-fallback',
            error: String(error)
        });
    }
}
