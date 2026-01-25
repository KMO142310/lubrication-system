---
description: Ciclo completo de Calidad de Código. Ejecuta auditoría, verificación humana y corrección automática.
---

# Audit Cycle Workflow

Este workflow automatiza el proceso de QA de principio a fin.

## Pasos

0. **Safety Snapshot (Pre-Audit)**
   - Ejecuta `git add . && git commit -m "chore: snapshot before audit cycle"` (si hay cambios pendientes).
   - Inicia con un estado limpio.

1. **Ejecutar Auditoría Técnica**
   - Ejecuta la skill `code-audit` (scripts `check-dead-code.sh` y `check-duplicates.sh`).
   - *Objetivo*: Obtener el estado actual y "crudo" del código.

2. **Verificación y Filtrado**
   - Ejecuta la skill `audit-verification`.
   - *Objetivo*: Filtrar falsos positivos y generar (o actualizar) el `correction_plan.md`.

3. **Análisis de Complejidad y Preguntas de Diseño**
   - Si `audit-verification` detecta problemas complejos (ej: duplicación > 5%), la skill generará un bloque de "Preguntas de Diseño" en el `correction_plan.md`.
   - Incluirá sugerencias técnicas (ej: "Crear componente HOC 'TaskCard'").

4. **Revisión Humana (PAUSA)**
   - **STOP**: Notifica al usuario.
   - Presenta el `correction_plan.md` con las preguntas de diseño.
   - Pide aprobación explícita O respuestas a las preguntas de diseño.
   - *Nota*: No avanzar al paso 5 hasta resolver el diseño.

4. **Corrección Automática**
   - Ejecuta la skill `auto-fix`.
   - *Objetivo*: Aplicar los cambios destructivos/constructivos de forma segura.

5. **Safety Snapshot (Post-Fix)**
   - Ejecutar `git add . && git commit -m "refactor: apply audit corrections"`.
   - *Objetivo*: Guardar el nuevo estado funcional.

6. **Reporte Final**
   - Actualiza `todos.md` y `learnings.md` con lo realizado.
