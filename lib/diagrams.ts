
import { dataService } from './data';
import { Component, LubricationPoint } from './types';

export function generateMachineSVG(machineId: string): string {
    const machine = dataService.getMachines().find(m => m.id === machineId);
    if (!machine) return '<svg><text>Máquina no encontrada</text></svg>';

    const components = dataService.getComponents(machineId);

    // Strategy Pattern: specific generator per machine type or ID
    if (machineId === 'eq-8001') {
        return generateDescortezadorSVG(machine, components);
    }

    // Fallback for others (improved grid)
    return generateGenericSVG(machine, components);
}

function generateDescortezadorSVG(machine: any, components: Component[]): string {
    const width = 800;
    const height = 500;

    // Helper to find component by partial name or ID
    const findComp = (match: string) => components.find(c => c.id.includes(match) || c.name.toLowerCase().includes(match));

    // Map critical components to layout nodes
    const nodes = {
        cadenas: { ...findComp('cadenas'), x: 50, y: 180, w: 180, h: 60, label: 'Alimentación' },
        rotor: { ...findComp('rotor'), x: 280, y: 130, w: 160, h: 160, label: 'Rotor Principal', shape: 'circle' },
        cuchillos: { ...findComp('cuchillos'), parent: 'rotor' }, // Inside rotor
        reductor: { ...findComp('reductor'), x: 500, y: 180, w: 120, h: 80, label: 'Reductor' },
        motor: { ...findComp('motor'), x: 660, y: 170, w: 100, h: 100, label: 'Motor' },
        central: { ...findComp('central'), x: 280, y: 350, w: 160, h: 80, label: 'Central Hidráulica' },
    };

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="font-family: 'Segoe UI', Arial, sans-serif;">`;

    // Background
    svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="#1e293b" />`;
    svg += `<defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
        </marker>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" stroke-width="0.5"/>
        </pattern>
    </defs>`;
    svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="url(#grid)" />`;

    // Title Block
    svg += `
        <g transform="translate(20, 20)">
            <text x="0" y="20" fill="#f8fafc" font-size="24" font-weight="bold">${machine.name.toUpperCase()}</text>
            <text x="0" y="45" fill="#94a3b8" font-size="14">VISTA ESQUEMÁTICA - PLANTA AISA</text>
            <line x1="0" y1="55" x2="${width - 40}" y2="55" stroke="#475569" stroke-width="1"/>
        </g>
    `;

    // Connections (Pipes/Shafts)
    svg += `
        <!-- Motor to Reductor (Shaft) -->
        <line x1="${nodes.motor.x}" y1="${nodes.motor.y + 50}" x2="${nodes.reductor.x + nodes.reductor.w}" y2="${nodes.reductor.y + 40}" stroke="#94a3b8" stroke-width="8" />
        
        <!-- Reductor to Rotor (Shaft) -->
        <line x1="${nodes.reductor.x}" y1="${nodes.reductor.y + 40}" x2="${nodes.rotor.x + nodes.rotor.w - 20}" y2="${nodes.rotor.y + 80}" stroke="#94a3b8" stroke-width="12" />

        <!-- Central to Rotor (Hydraulic Lines) -->
        <path d="M ${nodes.central.x + 80} ${nodes.central.y} L ${nodes.central.x + 80} ${nodes.rotor.y + 160}" fill="none" stroke="#0ea5e9" stroke-width="4" stroke-dasharray="5,5" />
        
        <!-- Cadenas Flow Arrow -->
        <line x1="${nodes.cadenas.x + 20}" y1="${nodes.cadenas.y + 30}" x2="${nodes.cadenas.x + 160}" y2="${nodes.cadenas.y + 30}" stroke="#22c55e" stroke-width="4" marker-end="url(#arrow)" />
    `;

    // Draw Nodes
    Object.values(nodes).forEach((n: any) => {
        if (!n.id || n.parent) return; // Skip if no data or is child

        const color = '#334155'; // Dark slate
        const stroke = '#94a3b8';

        // Custom shape for Rotor
        if (n.shape === 'circle') {
            svg += `
                <g transform="translate(${n.x}, ${n.y})">
                    <circle cx="${n.w / 2}" cy="${n.h / 2}" r="${n.w / 2}" fill="${color}" stroke="${stroke}" stroke-width="2" />
                    <circle cx="${n.w / 2}" cy="${n.h / 2}" r="${n.w / 2 - 20}" fill="none" stroke="#475569" stroke-width="2" stroke-dasharray="10,5"/>
                    <text x="${n.w / 2}" y="${n.h / 2 + 5}" text-anchor="middle" fill="#f8fafc" font-weight="bold" font-size="14">ROTOR</text>
                    
                    <!-- Knives (Symbolic) -->
                    <path d="M ${n.w / 2} 10 L ${n.w / 2 - 10} 30 L ${n.w / 2 + 10} 30 Z" fill="#f59e0b" />
                    <path d="M ${n.w / 2} ${n.h - 10} L ${n.w / 2 - 10} ${n.h - 30} L ${n.w / 2 + 10} ${n.h - 30} Z" fill="#f59e0b" transform="rotate(180 ${n.w / 2} ${n.h - 20})" />
                </g>
            `;
        } else {
            svg += `
                <g transform="translate(${n.x}, ${n.y})">
                    <rect width="${n.w}" height="${n.h}" rx="4" fill="${color}" stroke="${stroke}" stroke-width="2" />
                    <text x="${n.w / 2}" y="${n.h / 2 + 5}" text-anchor="middle" fill="#f8fafc" font-size="12" font-weight="bold">${n.label}</text>
                </g>
            `;
        }

        // Add Points overlay
        const points = dataService.getLubricationPoints(n.id);
        points.forEach((p, i) => {
            const px = 10 + (i * 20);
            const py = -10; // Above component
            const pColor = p.method === 'manual' ? '#ef4444' : '#3b82f6';

            // Draw relative to component
            svg += `
                <g transform="translate(${n.x + px}, ${n.y + py})">
                     <circle cx="0" cy="0" r="8" fill="${pColor}" stroke="white" stroke-width="1"/>
                     <text x="0" y="3" text-anchor="middle" fill="white" font-size="8" font-weight="bold">L</text>
                </g>
            `;
        });
    });

    // Special handling for Knives (inside Rotor)
    if (nodes.cuchillos && nodes.cuchillos.id) {
        const points = dataService.getLubricationPoints(nodes.cuchillos.id);
        points.forEach((p, i) => {
            // Place around rotor center
            const angle = (i / points.length) * Math.PI * 2;
            const r = 60;
            const cx = nodes.rotor.x + 80 + Math.cos(angle) * r;
            const cy = nodes.rotor.y + 80 + Math.sin(angle) * r;
            svg += `
                <g transform="translate(${cx}, ${cy})">
                     <circle cx="0" cy="0" r="8" fill="#f59e0b" stroke="white" stroke-width="1"/>
                     <text x="0" y="3" text-anchor="middle" fill="white" font-size="8" font-weight="bold">K</text>
                </g>
            `;
        });
    }

    svg += '</svg>';
    return svg;
}

function generateGenericSVG(machine: any, components: Component[]): string {
    // Same as before but cleaner code
    const padding = 40;
    const compWidth = 220;
    const compHeight = 160;
    const gapX = 40;
    const gapY = 40;
    const cols = 3;
    const rows = Math.ceil(components.length / cols);
    const width = (cols * (compWidth + gapX)) + padding * 2;
    const height = (rows * (compHeight + gapY)) + padding * 2 + 60;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="font-family: Arial, sans-serif;">`;
    svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>`;
    svg += `<text x="${width / 2}" y="40" text-anchor="middle" font-size="24" font-weight="bold" fill="#334155">${machine.name}</text>`;

    components.forEach((comp, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = padding + (col * (compWidth + gapX));
        const y = padding + 80 + (row * (compHeight + gapY));
        const compPoints = dataService.getLubricationPoints(comp.id);

        svg += `
            <g transform="translate(${x}, ${y})">
                <rect x="0" y="0" width="${compWidth}" height="${compHeight}" rx="8" fill="white" stroke="#cbd5e1" stroke-width="2"/>
                <text x="10" y="24" font-size="13" font-weight="bold" fill="#1e293b">${comp.name.substring(0, 25)}</text>
        `;

        compPoints.forEach((p, pIdx) => {
            const py = 50 + (pIdx * 24);
            if (py < compHeight - 10) {
                const color = p.method === 'manual' ? '#ef4444' : '#3b82f6';
                svg += `
                    <g transform="translate(10, ${py})">
                        <circle cx="6" cy="-4" r="5" fill="${color}"/>
                        <text x="18" y="0" font-size="11" fill="#475569" font-weight="bold">${p.code}</text>
                        <text x="18" y="10" font-size="9" fill="#94a3b8">${p.description.substring(0, 28)}</text>
                    </g>
                `;
            }
        });
        svg += `</g>`;
    });

    svg += '</svg>';
    return svg;
}
