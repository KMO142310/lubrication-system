const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const data = [
    {
        "Machine Name": "Sierra Principal",
        "Component Name": "Motor Principal",
        "Criticality": "A"
    },
    {
        "Machine Name": "Sierra Principal",
        "Component Name": "Caja Reductora",
        "Criticality": "A"
    },
    {
        "Machine Name": "Transportador Entrada",
        "Component Name": "Rodamiento Cabeza",
        "Criticality": "B"
    }
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(data);

// Adjust column widths
const wscols = [
    { wch: 25 },
    { wch: 25 },
    { wch: 15 }
];
ws['!cols'] = wscols;

XLSX.utils.book_append_sheet(wb, ws, "Assets");

const outputDir = path.join(__dirname, 'public/templates');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

XLSX.writeFile(wb, path.join(outputDir, 'import_template.xlsx'));
console.log("Template generated at public/templates/import_template.xlsx");
