
import { execSync } from 'child_process';
import fs from 'fs';

/**
 * QUALITY MONITOR AGENT
 * Misión: Detectar código muerto y errores de tipo antes de commit.
 */

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

function log(emoji: string, msg: string) {
    console.log(`${emoji}  ${msg}`);
}

async function main() {
    console.log(`${YELLOW}🔬 Starting Quality Monitor Agent...${RESET}`);
    let errors = 0;

    // 1. TypeScript Check
    log('📘', 'Ejecutando chequeo de tipos estricto (tsc)...');
    try {
        execSync('npx tsc --noEmit', { stdio: 'pipe' });
        log('✅', 'Tipos correctos.');
    } catch (e: unknown) {
        log('❌', 'Errores de TypeScript detectados:');
        const err = e as { stdout?: { toString(): string } };
        console.log(err.stdout?.toString());
        errors++;
    }

    // 2. Dead Code Check (Simplificado)
    // Buscamos archivos .ts/.tsx que no se importen (heurística básica por ahora)
    // En una iteración futura implementaremos ts-prune completo.
    log('💀', 'Analizando estructura de proyecto (Básico)...');

    // Check key files existence
    const criticalFiles = ['app/page.tsx', 'lib/data.ts', 'lib/diagrams.ts'];
    criticalFiles.forEach(f => {
        if (!fs.existsSync(f)) {
            log('❌', `Archivo crítico faltante: ${f}`);
            errors++;
        }
    });

    // 3. Environment Check
    log('🔐', 'Verificando variables de entorno...');
    if (!fs.existsSync('.env.local') && !process.env.VERCEL) {
        log('⚠️', 'No se encontró .env.local (Puede ser normal en CI)');
    } else {
        log('✅', 'Entorno detectado.');
    }

    if (errors > 0) {
        console.log(`${RED}🔬 Quality Monitor: Falló con ${errors} problemas.${RESET}`);
        process.exit(1);
    } else {
        console.log(`${GREEN}🔬 Quality Monitor: Código Saludable.${RESET}`);
    }
}

main().catch(console.error);
