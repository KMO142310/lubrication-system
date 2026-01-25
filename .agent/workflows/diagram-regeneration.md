---
description: Flujo automatizado para regenerar y auditar diagramas técnicos del manual AISA usando TikZ/SVG.
---

# Diagram Regeneration Workflow

Este workflow automatiza la regeneración de diagramas técnicos industriales a formato vectorial profesional.

## Trigger
Ejecutar cuando:
- Se detecten figuras de baja calidad en manuales
- Se agreguen nuevos equipos al inventario
- Se actualicen procedimientos de lubricación

## Flujo Automatizado

### Fase 1: Análisis de Diagramas Existentes
```bash
# turbo
grep -n "Figura\|Figure\|Plano" MANUAL_AISA_2026.txt | head -20
```
*Objetivo*: Identificar todas las figuras referenciadas en el manual.

### Fase 2: Mapeo de Componentes
Por cada figura identificada:
1. Extraer componentes mencionados (motores, rodamientos, ejes)
2. Identificar puntos de lubricación y sus frecuencias
3. Determinar el tipo de lubricante requerido

### Fase 3: Generación TikZ
// turbo
```bash
mkdir -p docs/diagrams
```

Generar código TikZ siguiendo la plantilla `aisa-diagrams.tex`:
- Usar paleta de colores corporativa AISA
- Aplicar estilos consistentes para componentes
- Incluir leyenda de frecuencias

### Fase 4: Compilación y Validación
```bash
cd docs/diagrams && pdflatex aisa-diagrams-demo.tex
```
*Resultado esperado*: PDF con todos los diagramas renderizados.

### Fase 5: Integración al Manual
1. Reemplazar figuras de baja resolución por versiones TikZ
2. Actualizar referencias cruzadas
3. Generar PDF final del manual

---

## Archivos Generados

| Archivo | Descripción |
|---------|-------------|
| `aisa-diagrams.tex` | Biblioteca de macros TikZ reutilizables |
| `aisa-diagrams-demo.tex` | Documento demo compilable |
| `*.pdf` | Diagramas renderizados |

## Estándares de Calidad

- [ ] Todos los puntos de lubricación visibles
- [ ] Frecuencias claramente indicadas
- [ ] Colores según paleta corporativa
- [ ] Etiquetas legibles a escala 1:1
- [ ] Compatible con impresión B/N (patrones)

## Comandos TikZ Disponibles

```latex
\diagramCanterTransmission    % Figura 9.1
\diagramVerticalFeedRollers   % Figura 9.2
\diagramPerfiladoraTopView    % Figura 9.3
\diagramWDFeedRollers         % Figuras 9.5/9.6
\diagramFRCylinders           % Figura 9.7
\diagramSawArbor              % Figura 9.12
\diagramFrequencySummary      % Resumen frecuencias
```
