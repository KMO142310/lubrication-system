---
description: Restaura y digitaliza planos técnicos industriales a formato vectorial (TikZ/SVG) de alta fidelidad.
---

# Technical Drawing Restoration Workflow

Este workflow está diseñado para transformar fotografías o escaneos de planos técnicos antiguos/borrosos en versiones digitales vectorizadas de alta calidad, manteniéndose fiel al diseño original.

## Prerrequisitos
- Imagen del plano original (JPG/PNG).
- Acceso a herramientas de generación de código (LLM con capacidad de visión).

## Pasos del Ciclo

### 1. Ingesta y Análisis Visual
- **Input**: El usuario sube una foto o captura del plano (e.g., "Diagrama Cinta Transportadora 1").
- **Acción**: El agente analiza la imagen para identificar:
    - Componentes principales (motores, rodillos, cintas, sensores).
    - Flujo del proceso (flechas de dirección).
    - Etiquetas y textos existentes.
    - Estructura espacial y proporciones.

### 2. Selección de Estrategia de Vectorización
El agente seleccionará el mejor formato según el tipo de plano:
- **TikZ (LaTeX)**: Para diagramas esquemáticos, flujos lógicos y grafos estrictos. Ideal para manuales PDF impresos.
- **SVG / Mermaid**: Para diagramas de flujo web o visualizaciones interactivos.
- **Python (Matplotlib/Schemdraw)**: Para circuitos eléctricos o diagramas de ingeniería estandarizados.

### 3. Generación de Código (Primera Pasada)
- **Acción**: El agente escribe el código (ej. bloque TikZ) que representa geométricamente los elementos identificados.
    - *Prompting*: "Genera un diagrama TikZ que tenga un nodo 'Motor' en (0,0) conectado a..."
- **Output Intermedio**: Archivo `.tex` o `.svg`.

### 4. Renderizado y Verificación
- **Acción**: 
    - Si es TikZ: Compilar a PDF (si hay entorno LaTeX) o pedir al usuario que compile/previsualice.
    - Si es SVG: Renderizar directamente en navegador/herramienta.
- **Comparación**: El agente (o usuario) compara el resultado con la imagen original.
    - ¿Están todos los componentes?
    - ¿Las conexiones son correctas?
    - ¿El texto es legible?

### 5. Refinamiento Iterativo
- **Acción**: Ajustar coordenadas, estilos de línea, colores y etiquetas para que coincidan visualmente con el estándar "Premium AISA".
- **Mejoras**:
    - Estandarizar simbología (usar iconos estándar ISO si aplica).
    - Mejorar tipografía (pasando de manuscrito a fuente sans-serif limpia).

### 6. Entrega Final
- **Entregables**:
    - Código fuente (para futuras ediciones).
    - Imagen renderizada (PDF/PNG/SVG).
    - Actualización del Manual Técnico (insertar el nuevo gráfico).

---

## Ejemplo de Uso
1. Usuario sube `foto_plano_cinta_borrosa.jpg`.
2. Ejecuta: `@agent run workflow plan-restoration`.
3. Agente: "Analizando imagen... Detectado sistema de 3 poleas y 1 motor".
4. Agente: Genera código TikZ.
5. Agente: "Aquí tienes el código TikZ. ¿Deseas ajustar algo antes de finalizar?".
