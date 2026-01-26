
import { Machine, Component, LubricationPoint } from './types';
import { dataService } from './data';

export function generateMachineSVG(machineId: string): string {
    const machine = dataService.getMachines().find(m => m.id === machineId);
    if (!machine) return '<svg><text>Máquina no encontrada</text></svg>';

    const components = dataService.getComponents(machineId);
    const allPoints: LubricationPoint[] = [];

    components.forEach(c => {
        const ptrs = dataService.getLubricationPoints(c.id);
        allPoints.push(...ptrs);
    });

    // Configuración del layout
    const padding = 40;
    const compWidth = 220;
    const compHeight = 160;
    const gapX = 40;
    const gapY = 40;
    const cols = 3;

    // Calcular tamaño total
    const rows = Math.ceil(components.length / cols);
    const width = (cols * (compWidth + gapX)) + padding * 2;
    const height = (rows * (compHeight + gapY)) + padding * 2 + 60; // +60 headers

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="font-family: Arial, sans-serif;">`;

    // Fondo y Marco Principal
    svg += `
        <rect x="0" y="0" width="${width}" height="${height}" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
        <text x="${width / 2}" y="40" text-anchor="middle" font-size="24" font-weight="bold" fill="#334155">${machine.name}</text>
        <text x="${width / 2}" y="65" text-anchor="middle" font-size="14" fill="#64748b">${machine.make || 'GENÉRICO'} - ${components.length} Componentes - ${allPoints.length} Puntos</text>
    `;

    // Dibujar Componentes
    components.forEach((comp, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);

        const x = padding + (col * (compWidth + gapX));
        const y = padding + 80 + (row * (compHeight + gapY));

        const compPoints = dataService.getLubricationPoints(comp.id);

        // Caja Componente
        svg += `
            <g transform="translate(${x}, ${y})">
                <!-- Marco Componente -->
                <rect x="0" y="0" width="${compWidth}" height="${compHeight}" rx="8" fill="white" stroke="#cbd5e1" stroke-width="2"/>
                <rect x="0" y="0" width="${compWidth}" height="36" rx="8" fill="#e2e8f0" clip-path="inset(0 0 75% 0 round 8px)"/>
                
                <!-- Título Componente -->
                <text x="10" y="24" font-size="13" font-weight="bold" fill="#1e293b" clip-path="url(#clip-${comp.id})">
                    ${comp.name.length > 25 ? comp.name.substring(0, 22) + '...' : comp.name}
                </text>
                
                <!-- Lista de Puntos -->
        `;

        // Puntos de Lubricación
        compPoints.forEach((p, pIdx) => {
            const py = 50 + (pIdx * 24);
            if (py < compHeight - 10) {
                // Determine color by status (using manual/auto/etc for now as proxy for type visually)
                const color = p.method === 'manual' ? '#ef4444' : '#3b82f6';

                svg += `
                    <g transform="translate(10, ${py})">
                        <circle cx="6" cy="-4" r="5" fill="${color}"/>
                        <text x="18" y="0" font-size="11" fill="#475569" font-weight="bold">${p.code}</text>
                        <text x="18" y="10" font-size="9" fill="#94a3b8">${p.description.substring(0, 30)}</text>
                    </g>
                `;
            }
        });

        // Indicador si hay más puntos
        if (compPoints.length * 24 > compHeight - 60) {
            svg += `<text x="${compWidth / 2}" y="${compHeight - 8}" text-anchor="middle" font-size="10" fill="#94a3b8">... más puntos ...</text>`;
        }

        svg += `</g>`;
    });

    // Leyenda
    svg += `
        <g transform="translate(${padding}, ${height - 30})">
            <circle cx="0" cy="0" r="5" fill="#ef4444"/>
            <text x="10" y="4" font-size="12" fill="#64748b">Punto Manual</text>
            
            <circle cx="100" cy="0" r="5" fill="#3b82f6"/>
            <text x="110" y="4" font-size="12" fill="#64748b">Centralizado/Auto</text>
        </g>
    `;

    svg += '</svg>';
    return svg;
}
