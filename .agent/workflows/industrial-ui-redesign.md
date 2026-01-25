---
description: Transformación de UI genérica SaaS a diseño industrial profesional estilo HMI/SCADA.
---

# Industrial UI Redesign Workflow

Este workflow transforma la interfaz actual de "SaaS genérico" a un sistema de gestión industrial profesional con estética de planta y equipos reales.

## Objetivo
Lograr que un ingeniero de mantenimiento industrial reconozca inmediatamente que esta es una herramienta profesional, no una app de startup.

---

## FASE 0: Auditoría Visual Actual
// turbo
1. Capturar screenshots de todas las páginas principales:
   ```bash
   # Páginas a auditar:
   # - /login
   # - / (dashboard)
   # - /tasks
   # - /tasks/[id]
   # - /anomalies
   # - /metrics
   # - /schedule
   ```

2. Listar elementos genéricos a reemplazar:
   - [ ] Iconos Lucide genéricos → Iconos industriales
   - [ ] Colores "startup" → Paleta ANSI/ISO
   - [ ] Cards redondeadas → Paneles HMI
   - [ ] Progress bars → Gauges industriales
   - [ ] Badges coloridos → Indicadores LED

---

## FASE 1: Sistema de Diseño Industrial

### 1.1 Paleta de Colores ANSI Z535
Actualizar `globals.css` con colores de seguridad industrial:

```css
:root {
  /* ANSI Z535 Safety Colors - Auténticos */
  --ansi-safety-red: #C8102E;      /* DANGER/STOP */
  --ansi-safety-orange: #FF6900;   /* WARNING */
  --ansi-safety-yellow: #FFCD00;   /* CAUTION */
  --ansi-safety-green: #007B3A;    /* SAFETY/GO */
  --ansi-safety-blue: #0033A0;     /* INFORMATION */
  
  /* Industrial Neutrals - Metálicos */
  --metal-dark: #1C2127;           /* Acero oscuro */
  --metal-medium: #394B59;         /* Acero medio */
  --metal-light: #5C7080;          /* Acero claro */
  --metal-surface: #E1E8ED;        /* Panel metálico */
  
  /* Machine Status Indicators */
  --status-running: #00D084;       /* Verde LED */
  --status-warning: #FFB020;       /* Ámbar LED */
  --status-stopped: #FF4136;       /* Rojo LED */
  --status-offline: #5C7080;       /* Gris apagado */
}
```

### 1.2 Tipografía Industrial
```css
/* Fuentes técnicas/ingenieriles */
--font-display: 'Oswald', 'DIN Condensed', sans-serif;
--font-technical: 'JetBrains Mono', 'Consolas', monospace;
--font-body: 'Inter', system-ui, sans-serif;
```

---

## FASE 2: Componentes Industriales

### 2.1 Componente: LED Indicator
Crear `components/ui/LEDIndicator.tsx`:
```tsx
// Estados: online, warning, offline, critical
// Debe parecer un LED real con brillo y reflejo
```

### 2.2 Componente: Industrial Gauge
Crear `components/ui/IndustrialGauge.tsx`:
```tsx
// Medidor semicircular estilo HMI
// Con zonas verde/amarillo/rojo
// Valor numérico central
```

### 2.3 Componente: Machine Card
Crear `components/ui/MachineCard.tsx`:
```tsx
// Panel estilo placa industrial
// Código de equipo prominente (WD-ROD-01)
// Status LED
// Silueta o icono del tipo de máquina
```

### 2.4 Componente: Equipment Tag
Crear `components/ui/EquipmentTag.tsx`:
```tsx
// Etiqueta estilo placa metálica industrial
// Bordes biselados
// Código técnico en tipografía mono
```

### 2.5 Componente: StatusPanel
Crear `components/ui/StatusPanel.tsx`:
```tsx
// Panel de control estilo SCADA
// Múltiples indicadores LED
// Header con título técnico
```

---

## FASE 3: Iconografía Industrial

### 3.1 Crear/obtener iconos específicos:
- Grasera (grease gun)
- Rodamiento (bearing)
- Bomba de lubricación
- Caja de engranajes
- Husillo
- Cadena de transmisión
- Compresor
- Motor eléctrico

### 3.2 Implementar como componente:
```tsx
// components/icons/IndustrialIcons.tsx
// Exportar todos los iconos industriales
```

---

## FASE 4: Layout de Planta

### 4.1 Dashboard Principal
Rediseñar `app/page.tsx`:
- Header estilo panel de control con LEDs de estado global
- Sección de máquinas con cards industriales
- Gauges para KPIs (no progress bars)
- Mini-diagrama de planta con status

### 4.2 Vista de Tareas
Rediseñar `app/tasks/page.tsx`:
- Lista estilo orden de trabajo industrial
- Códigos de punto prominentes
- Indicadores de frecuencia con colores ANSI
- Acciones con botones estilo HMI

---

## FASE 5: Verificación Visual

// turbo
1. Capturar nuevos screenshots
2. Comparar antes/después
3. Validar:
   - [ ] ¿Parece un sistema industrial real?
   - [ ] ¿Los colores son ANSI/ISO compliant?
   - [ ] ¿Los códigos de equipo son prominentes?
   - [ ] ¿Hay elementos de planta visibles?
   - [ ] ¿Un ingeniero lo reconocería como herramienta profesional?

---

## Prompt del Agente Industrial UI Designer

```
PROMPT EXACTO PARA EJECUTAR ESTE WORKFLOW:

"Transforma la UI del Sistema de Lubricación AISA de diseño SaaS genérico a una interfaz industrial profesional.

CONTEXTO:
- El sistema actual usa Lucide icons, colores de startup, y cards redondeadas
- Necesitamos una estética de HMI/SCADA industrial
- Los usuarios son técnicos de mantenimiento e ingenieros

REFERENCIAS VISUALES:
- Paneles de control SCADA/HMI de Siemens, Rockwell, ABB
- Software industrial como Maximo, SAP PM, Infor EAM
- Normas de color ANSI Z535 para seguridad industrial

TAREAS:
1. Actualizar globals.css con:
   - Paleta ANSI Z535 auténtica
   - Colores metálicos industriales
   - Tipografía técnica/ingenieril
   - Sombras y bordes estilo panel metálico

2. Crear componentes industriales en components/ui/:
   - LEDIndicator.tsx (indicador LED de estado)
   - IndustrialGauge.tsx (medidor semicircular)
   - MachineCard.tsx (card estilo placa industrial)
   - EquipmentTag.tsx (etiqueta de código técnico)
   - StatusPanel.tsx (panel de control)

3. Crear iconos industriales en components/icons/:
   - Grasera, rodamiento, bomba, engranaje, husillo
   - Usar SVG optimizado, monocromáticos

4. Rediseñar app/page.tsx (Dashboard):
   - Header estilo panel de control con LEDs
   - Gauges para métricas (no progress bars)
   - Machine cards con status LED
   - Códigos de equipo prominentes

5. Rediseñar app/tasks/page.tsx:
   - Lista estilo orden de trabajo
   - Equipment tags prominentes
   - Botones estilo HMI

RESTRICCIONES:
- Mantener funcionalidad existente 100%
- NO cambiar estructura de datos
- Mobile-first, responsive
- Accesibilidad: contraste WCAG AA mínimo

ENTREGABLES:
- globals.css actualizado
- 5+ componentes UI industriales
- Iconos SVG industriales
- Dashboard y Tasks rediseñados
- Screenshots antes/después"
```

---

## Métricas de Éxito

| Métrica | Objetivo |
|---------|----------|
| Reconocimiento Industrial | Ingeniero identifica como software profesional |
| Contraste WCAG | AA mínimo en todos los elementos |
| Iconografía Específica | 100% iconos industriales (no genéricos) |
| Códigos de Equipo | Visibles en <1 segundo |
| Paleta ANSI | 100% colores de seguridad correctos |

---

## Integración con Evolution Cycle

Este workflow se integra con `/evolution-cycle`:
1. **REASON**: Analizar diseño actual vs. estándares industriales
2. **EXECUTE**: Implementar componentes y estilos
3. **ASSESS**: Validar visualmente con screenshots
4. **LEARN**: Documentar patrones de diseño industrial exitosos
