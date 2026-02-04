
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Cliente Supabase dedicado para Health Check (no usa el del cliente principal para evitar cache)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const dynamic = 'force-dynamic';

export async function GET() {
    const startTime = Date.now();
    let dbStatus = 'unknown';

    try {
        // 1. Verificar conexión a DB (Supabase)
        const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

        if (error) throw error;
        dbStatus = 'healthy';

        return NextResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            latency: Date.now() - startTime,
            services: {
                database: {
                    status: dbStatus,
                    latency: Date.now() - startTime // Aprox
                },
                environment: process.env.NODE_ENV,
                region: process.env.VERCEL_REGION || 'local'
            }
        }, { status: 200 });

    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('Health Check Failed:', err);
        return NextResponse.json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            latency: Date.now() - startTime,
            services: {
                database: {
                    status: 'unhealthy',
                    error: err.message || 'Unknown error'
                }
            }
        }, { status: 503 });
    }
}
