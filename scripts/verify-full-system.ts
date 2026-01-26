
import { db, isDbInitialized } from '../lib/db';
import { users, plants, machines, lubricationPoints } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

async function verifySystem() {
    console.log('🔍 Iniciando Verificación del Sistema AISA...\n');

    // 1. Verificación de Archivo de BD
    const dbPath = path.resolve('aisa.db');
    if (fs.existsSync(dbPath)) {
        console.log(`✅ Archivo de base de datos encontrado: ${dbPath}`);
        const stats = fs.statSync(dbPath);
        console.log(`   Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
    } else {
        console.error('❌ CRÍTICO: No se encuentra el archivo aisa.db');
        process.exit(1);
    }

    // 2. Verificación de Conexión Drizzle
    try {
        if (isDbInitialized()) {
            console.log('✅ Conexión Drizzle/SQLite inicializada correctamente');
        } else {
            console.error('❌ Drizzle no pudo verificar la tabla usuarios');
        }

        // 3. Verificación de Datos Críticos
        console.log('\n📊 Verificando Datos Maestros:');

        const usersCount = await db.select().from(users).all();
        console.log(`   - Usuarios: ${usersCount.length} encontrados`);
        if (usersCount.length === 0) console.warn('     ⚠️  ¡Tabla usuarios vacía!');

        const plantsCount = await db.select().from(plants).all();
        console.log(`   - Plantas: ${plantsCount.length} encontrados`);

        const machinesCount = await db.select().from(machines).all();
        console.log(`   - Equipos: ${machinesCount.length} encontrados`);

        // Verificar Equipo 8006
        const eq8006 = await db.select().from(machines).where(eq(machines.name, 'Aserradero Línea Gruesa')).all(); // Ajustar nombre según seed
        // O buscar por ID si sabemos el ID, pero busquemos genérico primero o listemos algunos

        console.log('\n📋 Muestra de Equipos:');
        machinesCount.slice(0, 5).forEach(m => console.log(`   - [${m.id}] ${m.name}`));

        // 4. Verificación de Puntos de Lubricación (Crítico para informes)
        const pointsCount = await db.select().from(lubricationPoints).all();
        console.log(`\n   - Puntos de Lubricación: ${pointsCount.length} encontrados`);

        if (pointsCount.length > 0) {
            console.log('✅ Datos de lubricación presentes');
        } else {
            console.error('❌ No hay puntos de lubricación. Los informes saldrán vacíos.');
        }

    } catch (error) {
        console.error('❌ Error al consultar la base de datos:', error);
    }

    console.log('\n🏁 Verificación de BD completada.');
}

verifySystem().catch(console.error);
