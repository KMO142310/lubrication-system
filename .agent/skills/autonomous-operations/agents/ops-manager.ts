
import { execSync } from 'child_process';

/**
 * OPS MANAGER
 * Misión: Orquestar el ciclo autónomo de operaciones.
 */

const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

function runAgent(name: string, script: string) {
    console.log(`\n${BLUE}🤖 Activando Agente: ${name.toUpperCase()}...${RESET}`);
    try {
        // Ejecutamos usando ts-node o tsx
        execSync(`npx tsx .agent/skills/autonomous-operations/agents/${script}`, { stdio: 'inherit' });
    } catch (e) {
        console.error(`${name} falló. Abortando secuencia de operaciones.`);
        process.exit(1);
    }
}

async function main() {
    console.log(`${GREEN}========================================${RESET}`);
    console.log(`${GREEN}     AISA AUTONOMOUS OPERATIONS CENTER     ${RESET}`);
    console.log(`${GREEN}========================================${RESET}`);

    // Fase 1: Calidad
    runAgent('Quality Monitor', 'quality-monitor.ts');

    // Fase 2: Despliegue y Sincronización
    runAgent('Deploy Guard', 'deploy-guard.ts');

    console.log(`\n${GREEN}✅ CICLO DE OPERACIONES COMPLETADO EXITOSAMENTE.${RESET}`);
}

main().catch(console.error);
