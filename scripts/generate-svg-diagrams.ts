/**
 * AISA Plan Restoration - SVG Diagram Generator
 * 
 * This script generates SVG diagrams for web use from the TikZ definitions.
 * Uses programmatic SVG generation for browser compatibility.
 * 
 * Usage: npx tsx scripts/generate-svg-diagrams.ts
 */

const AISA_COLORS = {
    blue: '#005293',
    green: '#228B22',
    red: '#B22222',
    orange: '#FF8C00',
    gray: '#808080',
    lightGray: '#DCDCDC',
    greaseBlue: '#4682B4',
    greaseRed: '#DC143C',
    greaseYellow: '#FFD700',
    oilAmber: '#FFBF00'
};

interface DiagramConfig {
    id: string;
    title: string;
    figure: string;
    width: number;
    height: number;
}

const DIAGRAMS: DiagramConfig[] = [
    { id: 'canter-transmission', title: 'Transmision Canter 240-12E', figure: '9.1', width: 600, height: 300 },
    { id: 'vertical-feed-rollers', title: 'Rodillos de Avance Verticales', figure: '9.2', width: 550, height: 350 },
    { id: 'perfiladora-top', title: 'Vista Superior Perfiladora LINCK', figure: '9.3', width: 700, height: 400 },
    { id: 'wd-feed-rollers', title: 'Rodillos H84 Wuster Decker', figure: '9.5/9.6', width: 550, height: 400 },
    { id: 'fr10-cylinders', title: 'Cilindros y Estribos FR10', figure: '9.7', width: 600, height: 380 },
    { id: 'saw-arbor', title: 'Detalle Arbol de Sierra (NBU 15)', figure: '9.12', width: 550, height: 320 },
    { id: 'frequency-summary', title: 'Resumen de Frecuencias', figure: 'Anexo A', width: 800, height: 300 }
];

function generateSVGHeader(config: DiagramConfig): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     viewBox="0 0 ${config.width} ${config.height}" 
     width="${config.width}" 
     height="${config.height}">
  <defs>
    <style>
      .title { font: bold 14px Arial, sans-serif; fill: ${AISA_COLORS.blue}; }
      .label { font: 10px Arial, sans-serif; fill: ${AISA_COLORS.gray}; }
      .point-label { font: bold 9px Arial, sans-serif; fill: #000; }
      .frequency { font: 8px Arial, sans-serif; fill: ${AISA_COLORS.gray}; }
      .component { fill: ${AISA_COLORS.lightGray}; stroke: ${AISA_COLORS.blue}; stroke-width: 2; }
      .grease-point { fill: ${AISA_COLORS.greaseBlue}30; stroke: ${AISA_COLORS.greaseBlue}; stroke-width: 1.5; }
      .grease-point-red { fill: ${AISA_COLORS.greaseRed}30; stroke: ${AISA_COLORS.greaseRed}; stroke-width: 1.5; }
      .oil-point { fill: ${AISA_COLORS.oilAmber}30; stroke: ${AISA_COLORS.oilAmber}; stroke-width: 1.5; }
      .shaft { fill: ${AISA_COLORS.gray}20; stroke: ${AISA_COLORS.blue}; stroke-width: 1; }
      .bearing { fill: white; stroke: ${AISA_COLORS.blue}; stroke-width: 2; }
      .warning { fill: ${AISA_COLORS.red}10; stroke: ${AISA_COLORS.red}; stroke-width: 2; }
      .warning-text { font: bold 11px Arial, sans-serif; fill: ${AISA_COLORS.red}; }
    </style>
  </defs>
`;
}

function generateCanterTransmissionSVG(): string {
    const config = DIAGRAMS[0];
    return `${generateSVGHeader(config)}
  <!-- Title -->
  <text x="${config.width / 2}" y="25" class="title" text-anchor="middle">Figura ${config.figure}: ${config.title}</text>
  
  <!-- Motor -->
  <rect x="30" y="100" width="80" height="60" rx="5" class="component"/>
  <text x="70" y="135" class="label" text-anchor="middle">MOTOR</text>
  
  <!-- Pulley A -->
  <circle cx="160" cy="130" r="25" class="bearing"/>
  <circle cx="160" cy="105" r="8" class="grease-point"/>
  <text x="160" y="80" class="point-label" text-anchor="middle">A</text>
  <text x="160" y="175" class="label" text-anchor="middle">Polea Trans.</text>
  
  <!-- Splined Shaft B -->
  <rect x="190" y="125" width="120" height="10" class="shaft"/>
  <circle cx="250" cy="110" r="8" class="grease-point"/>
  <text x="250" y="95" class="point-label" text-anchor="middle">B</text>
  <text x="250" y="155" class="label" text-anchor="middle">Eje Estriado</text>
  
  <!-- Toothed Pulley C -->
  <circle cx="360" cy="130" r="30" class="bearing"/>
  <circle cx="360" cy="95" r="8" class="grease-point"/>
  <text x="360" y="80" class="point-label" text-anchor="middle">C</text>
  <text x="360" y="180" class="label" text-anchor="middle">Polea Dentada</text>
  
  <!-- Tensioner D -->
  <circle cx="450" cy="80" r="20" class="bearing"/>
  <circle cx="430" cy="80" r="8" class="grease-point"/>
  <text x="470" y="85" class="point-label">D</text>
  <text x="450" y="55" class="label" text-anchor="middle">P. Tensora</text>
  
  <!-- Belt -->
  <path d="M 185 115 L 330 115 L 435 70" stroke="${AISA_COLORS.gray}" stroke-width="4" fill="none"/>
  <path d="M 185 145 L 330 145" stroke="${AISA_COLORS.gray}" stroke-width="4" fill="none"/>
  
  <!-- Output -->
  <rect x="400" y="125" width="100" height="10" class="shaft"/>
  <text x="450" y="155" class="label" text-anchor="middle">Salida a Canter</text>
  
  <!-- Legend -->
  <circle cx="50" cy="250" r="8" class="grease-point"/>
  <text x="65" y="254" class="frequency">Punto de engrase (Grasa I y II)</text>
  <text x="30" y="280" class="frequency">A, C, D: Mensual | B: Cada 8 hrs</text>
</svg>`;
}

function generateSawArborSVG(): string {
    const config = DIAGRAMS[5];
    return `${generateSVGHeader(config)}
  <!-- Title -->
  <text x="${config.width / 2}" y="25" class="title" text-anchor="middle">Figura ${config.figure}: ${config.title}</text>
  
  <!-- Warning Box -->
  <rect x="20" y="40" width="510" height="35" rx="5" class="warning"/>
  <text x="${config.width / 2}" y="63" class="warning-text" text-anchor="middle">ATENCION: USAR SOLAMENTE GRASA ISOFLEX NBU 15</text>
  
  <!-- Shaft Body -->
  <rect x="60" y="120" width="380" height="80" rx="3" class="component"/>
  
  <!-- Interior Bearing A -->
  <circle cx="120" cy="160" r="25" class="bearing"/>
  <circle cx="120" cy="115" r="10" class="grease-point-red"/>
  <text x="120" y="100" class="point-label" text-anchor="middle">A</text>
  <text x="120" y="225" class="label" text-anchor="middle">Coj. Interior</text>
  <text x="120" y="240" class="frequency" text-anchor="middle">Anual (10 gr)</text>
  
  <!-- Labyrinth Seal C -->
  <line x1="250" y1="120" x2="250" y2="200" stroke="${AISA_COLORS.gray}" stroke-width="2" stroke-dasharray="5,3"/>
  <line x1="290" y1="120" x2="290" y2="200" stroke="${AISA_COLORS.gray}" stroke-width="2" stroke-dasharray="5,3"/>
  <circle cx="270" cy="110" r="10" class="grease-point-red"/>
  <text x="270" y="95" class="point-label" text-anchor="middle">C</text>
  <text x="270" y="225" class="label" text-anchor="middle">Empaq. Laberintica</text>
  <text x="270" y="240" class="frequency" text-anchor="middle">Semestral (4 gr)</text>
  
  <!-- Exterior Bearing B -->
  <circle cx="380" cy="160" r="25" class="bearing"/>
  <circle cx="380" cy="115" r="10" class="grease-point-red"/>
  <text x="380" y="100" class="point-label" text-anchor="middle">B</text>
  <text x="380" y="225" class="label" text-anchor="middle">Coj. Exterior</text>
  <text x="380" y="240" class="frequency" text-anchor="middle">Anual (8 gr)</text>
  
  <!-- Saw Blade -->
  <circle cx="480" cy="160" r="40" stroke="${AISA_COLORS.gray}" stroke-width="3" fill="none"/>
  <text x="480" y="225" class="label" text-anchor="middle">Sierra</text>
  
  <!-- Legend -->
  <circle cx="50" cy="280" r="8" class="grease-point-red"/>
  <text x="65" y="284" class="frequency">ISOFLEX NBU 15 - Mantener boquilla limpia</text>
</svg>`;
}

function generateFrequencySummarySVG(): string {
    const config = DIAGRAMS[6];
    const boxHeight = 60;
    const boxWidth = 180;

    return `${generateSVGHeader(config)}
  <!-- Title -->
  <text x="${config.width / 2}" y="30" class="title" text-anchor="middle">Resumen de Frecuencias de Lubricacion</text>
  
  <!-- Daily -->
  <rect x="20" y="60" width="${boxWidth}" height="${boxHeight}" rx="5" fill="${AISA_COLORS.green}20" stroke="${AISA_COLORS.green}" stroke-width="2"/>
  <text x="110" y="85" class="label" text-anchor="middle" style="font-weight:bold">DIARIAS</text>
  <text x="110" y="105" class="frequency" text-anchor="middle">Centrales hid., Engrasado, Cadenas</text>
  
  <!-- Every Other Day -->
  <rect x="220" y="60" width="${boxWidth}" height="${boxHeight}" rx="5" fill="${AISA_COLORS.blue}20" stroke="${AISA_COLORS.blue}" stroke-width="2"/>
  <text x="310" y="85" class="label" text-anchor="middle" style="font-weight:bold">DIA POR MEDIO</text>
  <text x="310" y="105" class="frequency" text-anchor="middle">VQT, FR-10 Bijur</text>
  
  <!-- Weekly -->
  <rect x="420" y="60" width="${boxWidth}" height="${boxHeight}" rx="5" fill="${AISA_COLORS.orange}20" stroke="${AISA_COLORS.orange}" stroke-width="2"/>
  <text x="510" y="85" class="label" text-anchor="middle" style="font-weight:bold">SEMANALES</text>
  <text x="510" y="105" class="frequency" text-anchor="middle">Perfiladora (X), WD (J)</text>
  
  <!-- Biweekly -->
  <rect x="620" y="60" width="${boxWidth}" height="${boxHeight}" rx="5" fill="${AISA_COLORS.red}20" stroke="${AISA_COLORS.red}" stroke-width="2"/>
  <text x="710" y="85" class="label" text-anchor="middle" style="font-weight:bold">QUINCENALES</text>
  <text x="710" y="105" class="frequency" text-anchor="middle">Harneros, GRIMME, Rotores</text>
  
  <!-- Monthly -->
  <rect x="120" y="150" width="${boxWidth}" height="${boxHeight}" rx="5" fill="${AISA_COLORS.gray}20" stroke="${AISA_COLORS.gray}" stroke-width="2"/>
  <text x="210" y="175" class="label" text-anchor="middle" style="font-weight:bold">MENSUALES</text>
  <text x="210" y="195" class="frequency" text-anchor="middle">Reductores, Rodamientos</text>
  
  <!-- Quarterly/Annual -->
  <rect x="320" y="150" width="${boxWidth}" height="${boxHeight}" rx="5" fill="#00000010" stroke="#000" stroke-width="2"/>
  <text x="410" y="175" class="label" text-anchor="middle" style="font-weight:bold">TRIM./ANUAL</text>
  <text x="410" y="195" class="frequency" text-anchor="middle">Arbol sierra (NBU 15)</text>
  
  <!-- Saturday Special -->
  <rect x="520" y="150" width="${boxWidth}" height="${boxHeight}" rx="5" fill="${AISA_COLORS.greaseYellow}20" stroke="${AISA_COLORS.greaseYellow}" stroke-width="2"/>
  <text x="610" y="175" class="label" text-anchor="middle" style="font-weight:bold">SABADO (Turno B)</text>
  <text x="610" y="195" class="frequency" text-anchor="middle">Lavado Rotores Desc.</text>
  
  <!-- Footer -->
  <text x="${config.width / 2}" y="260" class="frequency" text-anchor="middle">Sistema de Lubricacion AISA 2026 - Planta Chile</text>
</svg>`;
}

// Generate and save all SVGs
import { writeFileSync, mkdirSync, existsSync } from 'fs';

const outputDir = './public/diagrams';
if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
}

// Generate each diagram
const svgGenerators: Record<string, () => string> = {
    'canter-transmission': generateCanterTransmissionSVG,
    'saw-arbor': generateSawArborSVG,
    'frequency-summary': generateFrequencySummarySVG
};

console.log('='.repeat(50));
console.log('AISA Plan Restoration - SVG Diagram Generator');
console.log('='.repeat(50));
console.log('');

let generated = 0;
for (const config of DIAGRAMS) {
    const generator = svgGenerators[config.id];
    if (generator) {
        const svg = generator();
        const filename = `${outputDir}/${config.id}.svg`;
        writeFileSync(filename, svg);
        console.log(`[OK] Generated: ${filename}`);
        generated++;
    } else {
        console.log(`[--] Skipped: ${config.id} (no generator yet)`);
    }
}

console.log('');
console.log(`Total generated: ${generated}/${DIAGRAMS.length}`);
console.log(`Output directory: ${outputDir}`);
console.log('');
console.log('Next steps:');
console.log('  1. Add remaining diagram generators');
console.log('  2. Use <img src="/diagrams/xxx.svg"> in React components');
console.log('  3. Deploy to Vercel for production use');
