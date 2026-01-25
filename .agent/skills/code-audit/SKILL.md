---
description: Skill para auditar la calidad del código, detectando código muerto (ts-prune) y duplicados (jscpd).
---

# Code Audit Skill

Esta skill te permite ejecutar análisis estáticos para encontrar problemas de calidad en el código.

## Capacidades

### 1. Detectar Código Muerto (`dead-code`)
Encuentra exportaciones que no se usan en ninguna parte del proyecto.
- **Comando**: Ejecuta el script `scripts/check-dead-code.sh`.
- **Qué buscar**: Exportaciones marcadas como `used in module` (significa que no se importan fuera).

### 2. Detectar Duplicados (`duplicates`)
Encuentra bloques de código copiados y pegados (Copy-Paste Detector).
- **Comando**: Ejecuta el script `scripts/check-duplicates.sh`.
- **Qué buscar**: Rutas de archivos y números de línea donde el código es idéntico.

## Instrucciones de Uso

1. **Ejecutar Script**: Usa `run_command` para lanzar el script deseado desde el directorio de la skill.
   *Nota*: Los scripts usan `npx`, por lo que no requieren instalar dependencias globales, pero pueden tardar unos segundos la primera vez.

2. **Analizar Salida**:
   - Si no hay output o dice "All clear", todo está bien.
   - Si hay reportes, agrégalos a `learnings.md` o propón un plan de refactorización (`todos.md`).

3. **Acción Correctiva**:
   - **Código Muerto**: Verificar si se puede borrar de forma segura (usando skill `safe-refactor`).
   - **Duplicados**: Proponer extraer lógica común a `./lib/utils.ts` o un componente nuevo.
