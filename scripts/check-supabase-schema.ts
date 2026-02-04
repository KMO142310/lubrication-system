/**
 * Script de diagnóstico: Ver estructura real de tablas en Supabase
 * 
 * Usage: npx tsx scripts/check-supabase-schema.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('🔍 Verificando estructura de Supabase...\n');

    const tables = ['plants', 'areas', 'machines', 'components', 'lubricants', 'frequencies', 'lubrication_points', 'work_orders', 'tasks', 'profiles'];

    for (const table of tables) {
        console.log(`📋 Tabla: ${table}`);
        const { data, error } = await supabase.from(table).select('*').limit(1);

        if (error) {
            console.log(`   ❌ Error: ${error.message}`);
        } else if (data && data.length > 0) {
            console.log(`   ✅ Columnas: ${Object.keys(data[0]).join(', ')}`);
        } else {
            // Try to get schema from empty table
            const { data: schemaData, error: schemaError } = await supabase.from(table).select('*').limit(0);
            if (schemaError) {
                console.log(`   ⚠️ Tabla vacía o no existe: ${schemaError.message}`);
            } else {
                console.log(`   ⚠️ Tabla vacía (0 filas)`);
            }
        }
        console.log('');
    }
}

checkSchema().catch(console.error);
