// Complete data extraction from AISA lubrication files
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const BITACORA = '/Users/omaralexis/Desktop/BITACORA';

// Load all Excel files
const planFile = XLSX.readFile(path.join(BITACORA, 'Copia de PLAN_DETALLADO_LUBRICACION_AISA.xlsx'));
const programaFile = XLSX.readFile(path.join(BITACORA, 'Copia de PROGRAMA_LUBRICACION_ENERO_2026.xlsx'));

console.log('=== PLAN DETALLADO - TODAS LAS FILAS ===');
const planSheet = planFile.Sheets[planFile.SheetNames[0]];
const planData = XLSX.utils.sheet_to_json(planSheet, { header: 1, defval: '' });
console.log(`Total rows: ${planData.length}`);

// Extract all lubrication points from Plan
const lubricationPoints = [];
let currentEquipo = '';
let currentSeccion = '';

for (let i = 0; i < planData.length; i++) {
    const row = planData[i];
    if (!row || row.length === 0) continue;

    const col0 = String(row[0] || '').trim();
    const col1 = String(row[1] || '').trim();
    const col2 = String(row[2] || '').trim();
    const col3 = String(row[3] || '').trim();
    const col5 = String(row[5] || '').trim();
    const col6 = String(row[6] || '').trim();
    const col7 = String(row[7] || '').trim();
    const col8 = String(row[8] || '').trim();

    // Detect equipment headers (e.g., "9.1 CANTER 1 Y 2")
    if (col0.match(/^\d+\.\d+\s+[A-Z]/)) {
        currentEquipo = col0;
        continue;
    }

    // Detect section headers (e.g., "9.1.1 Transmisión")
    if (col0.match(/^\d+\.\d+\.\d+\s+/)) {
        currentSeccion = col0;
        continue;
    }

    // Skip header row
    if (col0 === 'Equipo' || col0 === '') continue;

    // If has section and component data, it's a lubrication point
    if (col1 && col3 && col7) {
        lubricationPoints.push({
            equipo: currentEquipo,
            seccion: currentSeccion,
            maquina: col0,
            codigoSeccion: col1,
            punto: col2,
            componente: col3,
            cantidad: col5,
            puntos: col6,
            lubricante: col7,
            frecuencia: col8,
        });
    }
}

console.log(`\nExtracted ${lubricationPoints.length} lubrication points:`);
lubricationPoints.forEach((p, i) => {
    console.log(`${i + 1}. [${p.codigoSeccion}] ${p.maquina} - ${p.componente} | ${p.cantidad} | ${p.lubricante} | ${p.frecuencia}`);
});

console.log('\n=== PROGRAMA ENERO 2026 - TAREAS ===');
const programaSheet = programaFile.Sheets[programaFile.SheetNames[0]];
const programaData = XLSX.utils.sheet_to_json(programaSheet, { header: 1, defval: '' });
console.log(`Total rows: ${programaData.length}`);

const tareas = [];
let currentCG = '';
let currentTareaType = '';
let currentMaquina = '';

for (let i = 0; i < programaData.length; i++) {
    const row = programaData[i];
    if (!row || row.length === 0) continue;

    const col0 = String(row[0] || '').trim();
    const col1 = String(row[1] || '').trim();
    const col2 = String(row[2] || '').trim();
    const col3 = String(row[3] || '').trim();

    // CG header (e.g., "CG 611 – DESCORTEZADO")
    if (col0.match(/^CG\s+\d+/)) {
        currentCG = col0;
        continue;
    }

    // Task type header (e.g., "4.1.1 Tareas Diarias")
    if (col0.match(/^\d+\.\d+\.\d+\s+Tareas/)) {
        currentTareaType = col0;
        continue;
    }

    // Machine header (e.g., "8001 – Descortezador")
    if (col0.match(/^\d{4}\s+–/)) {
        currentMaquina = col0;
        continue;
    }

    // Skip headers
    if (col0 === 'Equipo' || col0 === '') continue;

    // Task row with code
    if (col1 && col1.match(/^\d+$/)) {
        tareas.push({
            cg: currentCG,
            tipoTarea: currentTareaType,
            maquina: currentMaquina,
            componente: col0,
            codigo: col1,
            area: col2,
            tarea: col3,
        });
    }
}

console.log(`\nExtracted ${tareas.length} tasks:`);
tareas.forEach((t, i) => {
    console.log(`${i + 1}. [${t.codigo}] ${t.componente} | ${t.tarea}`);
});

// Save complete data
const output = {
    lubricationPoints,
    tareas,
    rawPlan: planData,
    rawPrograma: programaData,
};

fs.writeFileSync(
    path.join(BITACORA, 'lubrication-system', 'complete_data.json'),
    JSON.stringify(output, null, 2)
);

console.log('\n✓ Complete data saved to complete_data.json');
