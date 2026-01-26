const https = require('https');

const PRODUCTION_URL = 'https://lubrication-system.vercel.app'; // Ajustar si es diferente

console.log('🛡️  INICIANDO VERIFICACIÓN DE PRODUCCIÓN (AISA 2026)\n');

async function checkUrl(path) {
    return new Promise((resolve) => {
        const url = `${PRODUCTION_URL}${path}`;
        const req = https.get(url, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                console.log(`✅ [OK] ${path} - Código: ${res.statusCode}`);
                resolve(true);
            } else {
                console.log(`❌ [FAIL] ${path} - Código: ${res.statusCode}`);
                resolve(false);
            }
        });

        req.on('error', (e) => {
            console.log(`❌ [ERROR] ${path} - ${e.message}`);
            resolve(false);
        });
    });
}

async function verify() {
    console.log(`Objetivo: ${PRODUCTION_URL}\n`);

    // 1. Verificar Disponibilidad Básica
    const homeOk = await checkUrl('/');

    // 2. Verificar Rutas Críticas
    const adminOk = await checkUrl('/admin');
    const tasksOk = await checkUrl('/tasks');
    const loginOk = await checkUrl('/login');

    // 3. Verificar API
    await checkUrl('/api/health'); // Debería existir si se desplegó correctamente

    console.log('\n--- RESUMEN ---');
    if (homeOk && tasksOk) {
        console.log('✅ El sistema responde. El despliegue en Vercel fue exitoso.');
        console.log('⚠️  IMPORTANTE: Verifica manualmente que los DATOS (equipos, tareas) aparezcan al iniciar sesión.');
    } else {
        console.log('❌ Hay problemas de conectividad con Vercel. Revisa el Dashboard de Vercel para ver errores de Build.');
    }
}

verify();
