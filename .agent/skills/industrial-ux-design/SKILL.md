---
name: industrial-ux-design
description: Skill especializada para diseñar interfaces de alta usabilidad en entornos industriales (guantes, mala luz, operación con una mano).
---

# Industrial UX Design Skill

Esta skill guía la creación de interfaces para usuarios de planta (operarios, técnicos). No es un diseñador "bonito", es un diseñador "funcional y seguro".

## Principios de Diseño Industrial (HMI/SCADA Style)

### 1. The "Fat Finger" Rule (Regla del Dedo Gordo)
- **Tamaño Mínimo**: Todos los targets táctiles deben medir al menos **48x48px** (recomendado 60x60px).
- **Espaciado**: Margen de seguridad de 8px entre botones para evitar toques fantasma.
- **Acción**: Si generas un botón, aplica clases como `h-14`, `w-full`, `text-lg`.

### 2. High Contrast & Environment Awareness
- **Dark Mode Default**: Las plantas suelen ser oscuras o tener reflejos fuertes. Usa fondos oscuros (`bg-slate-900`) con texto claro (`text-slate-100`).
- **Safety Colors**:
    - 🔴 **Rojo/Danger**: Solo para paradas críticas o peligros.
    - 🟡 **Amarillo/Warning**: Advertencias.
    - 🟢 **Verde/Safe**: Estado operativo normal.
    - 🔵 **Azul/Info**: Información neutral.
    - **No usar colores ambiguos**.

### 3. One-Handed Operation
- **Bottom Navigation**: Los controles principales deben estar en la parte inferior de la pantalla (zona del pulgar).
- **Touch-Friendly**: Evita dropdowns complejos. Prefiere Selectores grandes, Radio Buttons tipo "Card", o Steppers.

### 4. Feedback Inmediato
- **Visual**: Cambio de estado instantáneo al tocar (Active state).
- **Confirmación**: Para acciones destructivas, usar "Slide to Confirm" o "Long Press" en lugar de diálogos de confirmación pequeños.

## Patrones de Componentes Recomendados

### `IndustrialCard`
Tarjeta de alto contraste con bordes definidos y estado semántico (borde de color según estado).

### `BigActionButton`
Botón de ancho completo, altura > 60px, con icono a la izquierda y texto grande.

### `StatusIndicator`
Indicador visual grande (círculo o barra) que muestra el estado de la máquina de un vistazo.

## Checklist de Verificación UI
- [ ] ¿Se puede usar con guantes de seguridad? (Targets grandes)
- [ ] ¿Es legible con sol directo o en oscuridad? (Contraste)
- [ ] ¿Requiere las dos manos? (Si sí, rediseñar para una mano si es posible)
- [ ] ¿Los errores se explican en lenguaje natural?
