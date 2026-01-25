---
description: Flujo para generar diagramas vectoriales desde imágenes de planos o bocetos industriales.
---

# Diagram Generation Workflow

Flujo automatizado para convertir imágenes de planos en diagramas SVG/TikZ profesionales.

## Prerrequisitos
- Imagen del plano (JPG/PNG)
- Identificación del tipo de plano

## Pasos

### 1. Detección de Tipo
// turbo
```bash
# Listar imágenes disponibles
ls -la /Users/omaralexis/Desktop/BITACORA/*.jpeg
```

Clasificar como:
- **ESQUEMÁTICO**: Diagrama de flujo, conexiones lógicas
- **LAYOUT**: Vista de planta, posiciones físicas
- **TABLA**: Listado de equipos/puntos

---

### 2. Análisis Visual

Para cada imagen:
1. Identificar componentes principales
2. Detectar conexiones/flujos
3. Extraer etiquetas legibles
4. Determinar proporciones

**Salida esperada:**
```typescript
interface PlanAnalysis {
  type: 'schematic' | 'layout' | 'table';
  components: Component[];
  connections: Connection[];
  labels: Label[];
  dimensions: { width: number; height: number };
}
```

---

### 3. Generación de Código

#### Para SVG (Web):
```typescript
const svg = generateSVG({
  components,
  connections,
  style: 'industrial-dark',
  width: 1200,
  height: 800
});
```

#### Para TikZ (PDF):
```latex
\begin{tikzpicture}[
  motor/.style={rectangle, draw, fill=blue!20},
  conveyor/.style={rectangle, draw, fill=gray!30}
]
  % Componentes generados
\end{tikzpicture}
```

---

### 4. Guardado

// turbo
```bash
# Guardar en directorio de diagramas
mkdir -p public/diagrams
```

Formatos:
- `public/diagrams/{nombre}.svg` - Para web
- `docs/diagrams/{nombre}.tex` - Para manual PDF

---

### 5. Integración

Actualizar `app/plans/page.tsx` con el nuevo diagrama:
```typescript
PLANS_DATA.push({
  id: 'nuevo',
  name: 'Nombre del Plano',
  description: 'Descripción',
  imageUrl: '/diagrams/nuevo.svg',
  status: 'Vectorizado',
  updatedAt: new Date().toISOString().split('T')[0]
});
```

---

### 6. Verificación

// turbo
```bash
npm run build
```

Verificar que el SVG renderice correctamente en `/plans`.

---

## Ejemplo de Uso

```bash
# Generar diagrama desde imagen específica
/diagram-generation --input "/path/to/WhatsApp Image.jpeg" --name "motor-principal"

# Generar todos los pendientes
/diagram-generation --all
```

---

## Estándares de Diseño

### Paleta Industrial AISA
| Elemento | Color Hex | Uso |
|----------|-----------|-----|
| Fondo | #1a1a2e | Background principal |
| Motor | #2b6cb0 | Equipos motorizados |
| Cinta | #2d3748 | Transportadores |
| Lubricación | #e74c3c | Puntos de grasa |
| Flujo | #48bb78 | Flechas de material |
| Texto | #e2e8f0 | Labels principales |

### Elementos Obligatorios
- Título con código de área
- Leyenda con símbolos
- Puntos de lubricación numerados (L1, L2, ...)
- Footer con fecha de revisión
