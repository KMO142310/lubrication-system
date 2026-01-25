---
description: Ejecuta automáticamente las acciones de corrección (borrado de código muerto, refactorización) definidas en el artifact 'correction_plan.md'.
---

# Auto-Fix Skill

Esta skill es el "ejecutor". Su trabajo es leer el plan de corrección aprobado y aplicar los cambios.

## Input
- Archivo `correction_plan.md` en la carpeta de artifacts (`.gemini/antigravity/brain/...`).

## Procedimiento

1. **Leer el Plan**: Usa `read_resource` para obtener el contenido de `correction_plan.md`.
2. **Identificar Acciones**:
   - Busca líneas con acciones explícitas como `🗑️ Borrar` o `🛠️ Extraer`.
   - Ignora líneas con `🛡️ IGNORAR`.
3. **Ejecutar Acciones**:
   - **Para Borrar Función/Export**:
     - Usa `replace_file_content` para eliminar la línea del export o la función completa.
     - *Safety Check*: Verifica que no queden llamadas internas rotas dentro del mismo archivo.
   - **Para Borrar Archivo**:
     - Usa `run_command` con `rm` (solo si estás 100% seguro y el plan lo dice).
4. **Actualizar Plan**:
   - Marca las acciones completadas en el `correction_plan.md` cambiando el texto a `✅ [DONE]`.

## Ejemplo de Ejecución
Si el plan dice:
`| lib/anti-fraud.ts | getUserPhotos | 🗑️ Borrar | ...`

Tú debes:
1. Abrir `lib/anti-fraud.ts`.
2. Buscar `export const getUserPhotos = ...` o `function getUserPhotos...`.
3. Borrar el bloque.
4. Editar `correction_plan.md` para que diga `✅ [DONE] Borrar`.
