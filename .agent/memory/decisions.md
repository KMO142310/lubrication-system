# Decisiones Arquitectónicas

Registro de decisiones técnicas importantes tomadas durante el desarrollo.

## [2026-01-24] Creación del Sistema de Skills
**Contexto**: Necesidad de gestionar conocimiento y memoria a largo plazo en el proyecto.
**Decisión**: Implementar arquitectura de 3 skills (`project-knowledge`, `memory`, `conventions`) y 4 archivos de memoria.
**Consecuencias**: El agente ahora tiene capacidad de autodescubrimiento de contexto y persistencia de información entre sesiones.

## [2026-01-25] Sistema de Diagramas Técnicos
**Contexto**: Los diagramas del manual AISA estaban en formato imagen de baja calidad.
**Decisión**: Implementar sistema dual de diagramas:
- **TikZ (LaTeX)**: Para documentos impresos y PDF del manual (`docs/diagrams/aisa-diagrams.tex`)
- **SVG programático**: Para uso web en la aplicación (`public/diagrams/*.svg`)
**Consecuencias**: 
- Diagramas vectoriales escalables y editables
- Paleta de colores corporativa consistente (AISA Blue #005293)
- Fácil actualización cuando cambien los procedimientos

## [2026-01-25] Generación Automática de Programación
**Contexto**: La programación mensual de lubricación requiere respetar reglas complejas de rotación de turnos.
**Decisión**: Crear script TypeScript (`scripts/seed-february-2026.ts`) que:
1. Genera calendario respetando Turno A (Lun-Vie) y Turno B (Mar-Sáb)
2. Aplica frecuencias del manual (diarias, semanales, quincenales, mensuales)
3. Exporta SQL compatible con SQLite/Supabase
**Consecuencias**:
- Programación reproducible y auditable
- Fácil generar meses futuros cambiando parámetros
- Base para API de calendario en la app móvil

