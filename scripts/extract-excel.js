// Script to extract data from AISA lubrication Excel files
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const BITACORA = '/Users/omaralexis/Desktop/BITACORA';

// Load all Excel files
const planFile = XLSX.readFile(path.join(BITACORA, 'Copia de PLAN_DETALLADO_LUBRICACION_AISA.xlsx'));
const programaFile = XLSX.readFile(path.join(BITACORA, 'Copia de PROGRAMA_LUBRICACION_ENERO_2026.xlsx'));
const consumoFile = XLSX.readFile(path.join(BITACORA, 'Copia de REGISTRO_CONSUMO_LUBRICANTES.xlsx'));

console.log('=== PLAN DETALLADO ===');
console.log('Sheets:', planFile.SheetNames);
const planSheet = planFile.Sheets[planFile.SheetNames[0]];
const planData = XLSX.utils.sheet_to_json(planSheet, { header: 1, defval: '' });
console.log('First 20 rows:');
planData.slice(0, 20).forEach((row, i) => console.log(`Row ${i}:`, row));

console.log('\n=== PROGRAMA ENERO 2026 ===');
console.log('Sheets:', programaFile.SheetNames);
const programaSheet = programaFile.Sheets[programaFile.SheetNames[0]];
const programaData = XLSX.utils.sheet_to_json(programaSheet, { header: 1, defval: '' });
console.log('First 20 rows:');
programaData.slice(0, 20).forEach((row, i) => console.log(`Row ${i}:`, row));

console.log('\n=== REGISTRO CONSUMO ===');
console.log('Sheets:', consumoFile.SheetNames);
const consumoSheet = consumoFile.Sheets[consumoFile.SheetNames[0]];
const consumoData = XLSX.utils.sheet_to_json(consumoSheet, { header: 1, defval: '' });
console.log('First 20 rows:');
consumoData.slice(0, 20).forEach((row, i) => console.log(`Row ${i}:`, row));

// Output combined data structure for review
const output = {
    plan: planData.slice(0, 30),
    programa: programaData.slice(0, 30),
    consumo: consumoData.slice(0, 30),
};

fs.writeFileSync(
    path.join(BITACORA, 'lubrication-system', 'extracted_data.json'),
    JSON.stringify(output, null, 2)
);

console.log('\n✓ Data extracted to extracted_data.json');
