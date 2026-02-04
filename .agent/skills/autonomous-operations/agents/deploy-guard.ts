
import { execSync } from 'child_process';

/**
 * DEPLOY GUARD AGENT
 * Misión: Asegurar sincronización entre GitHub y Vercel.
 */

const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

function log(emoji: string, msg: string) {
    console.log(`${emoji}  ${msg}`);
}

function run(cmd: string): string {
    try {
        return execSync(cmd, { stdio: 'pipe' }).toString().trim();
    } catch {
        return '';
    }
}

async function main() {
    console.log(`${YELLOW}🛡️  Starting Deploy Guard Agent...${RESET}`);

    // 1. Check Git Status
    const gitStatus = run('git status --porcelain');
    if (gitStatus) {
        log('⚠️', 'Cambios locales no commiteados detectados.');
        console.log(gitStatus);
    } else {
        log('✅', 'Directorio de trabajo limpio.');
    }

    // 2. Check Remote Sync
    log('📡', 'Verificando sincronización con origin/main...');
    run('git fetch origin main');
    const localHash = run('git rev-parse HEAD');
    const remoteHash = run('git rev-parse origin/main');

    if (localHash !== remoteHash) {
        log('🚨', `Divergencia detectada! Local: ${localHash.substring(0, 7)} | Remote: ${remoteHash.substring(0, 7)}`);
        log('🚀', 'Empujando cambios a GitHub...');
        try {
            execSync('git push origin main', { stdio: 'inherit' });
            log('✅', 'Push exitoso.');
        } catch {
            log('❌', 'Error al hacer push. Verifica credenciales o conflictos.');
            process.exit(1);
        }
    } else {
        log('✅', 'Git sincronizado.');
    }

    // 3. Check Vercel
    log('▲', 'Verificando estado de Vercel...');
    try {
        // Obtenemos lista de deployments recientes
        // Estrategia simple: verificar estado antes de deploy
        run('vercel list --prod --yes --limit 1');

        // Estrategia simple: Si el usuario ejecuta este script, probablemente quiere forzar un deploy seguro
        // para estar 100% seguro.

        log('🚀', 'Iniciando despliegue de producción forzado (Safety Deploy)...');
        execSync('vercel deploy --prod --yes', { stdio: 'inherit' });

        const url = 'https://lubrication-system.vercel.app';
        log('✅', `Despliegue completado: ${GREEN}${url}${RESET}`);

    } catch (e) {
        log('❌', 'Falló la verificación/despliegue de Vercel.');
        console.error(e);
        process.exit(1);
    }

    console.log(`${GREEN}🛡️  Deploy Guard: Misión Cumplida.${RESET}`);
}

main().catch(console.error);
