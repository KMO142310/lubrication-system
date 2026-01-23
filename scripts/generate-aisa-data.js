// Generate AISA data JSON from complete_data.json
const fs = require('fs');
const data = require('../complete_data.json');

function getLubricantId(name) {
    if (!name) return 'lub-kp2k';
    const n = name.toLowerCase();
    if (n.includes('grasa i') || n.includes('lgmt')) return 'lub-grasa-i-ii';
    if (n.includes('kp2k')) return 'lub-kp2k';
    if (n.includes('nbu') || n.includes('isoflex')) return 'lub-nbu15';
    if (n.includes('150')) return 'lub-aceite-150';
    if (n.includes('80w') || n.includes('90')) return 'lub-80w90';
    return 'lub-kp2k';
}

function getFrequencyId(freq) {
    if (!freq) return 'freq-mensual';
    const f = freq.toLowerCase();
    if (f.includes('8 h')) return 'freq-8hrs';
    if (f.includes('40 h')) return 'freq-40hrs';
    if (f.includes('160 h')) return 'freq-160hrs';
    if (f.includes('7000')) return 'freq-7000hrs';
    if (f.includes('3 mes')) return 'freq-3meses';
    if (f.includes('6 mes') || f.includes('semestral')) return 'freq-6meses';
    if (f.includes('anual')) return 'freq-anual';
    if (f.includes('mensual') || f.includes('mes')) return 'freq-mensual';
    return 'freq-mensual';
}

const points = data.lubricationPoints.map((p, i) => ({
    id: 'lp-' + (i + 1),
    code: p.codigoSeccion + '-' + p.punto,
    description: p.componente + ' - ' + p.maquina,
    equipo: p.equipo,
    seccion: p.seccion,
    maquina: p.maquina,
    cantidad: p.cantidad,
    puntos: p.puntos,
    lubricante: p.lubricante,
    lubricantId: getLubricantId(p.lubricante),
    frecuencia: p.frecuencia,
    frequencyId: getFrequencyId(p.frecuencia),
}));

const tareas = data.tareas.map((t, i) => ({
    id: 'tarea-' + (i + 1),
    codigo: t.codigo,
    componente: t.componente,
    tarea: t.tarea,
    cg: t.cg,
    maquina: t.maquina,
    tipoTarea: t.tipoTarea,
    area: t.area,
}));

console.log('PUNTOS:', points.length);
console.log('TAREAS:', tareas.length);

fs.writeFileSync(
    require('path').join(__dirname, '..', 'lib', 'aisa_data.json'),
    JSON.stringify({ points, tareas }, null, 2)
);

console.log('Saved to lib/aisa_data.json');
