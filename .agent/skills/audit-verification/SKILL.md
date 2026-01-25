---
description: Skill para analizar reportes de auditoría (código muerto, duplicados), filtrar falsos positivos y generar un plan de corrección accionable.
---

# Audit Verification Skill

Esta skill toma los resultados "crudos" de `code-audit` y realiza un análisis inteligente para determinar qué es real y qué es ruido.

## Input Necesario
- Logs o salida de comandos `check-dead-code.sh` o `check-duplicates.sh`.

## Proceso de Verificación

Para cada hallazgo reportado:

### 1. Filtrado de Falsos Positivos (Next.js & Supabase)
Ignora inmediatamente:
- Archivos en `app/**/page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` (sus exports son usados por el framework).
- Archivos de configuración (`tailwind.config.ts`, `next.config.js`).
- Rutas de API en `app/api/**/route.ts` (sus métodos GET/POST son usados por el framework).

### 2. Verificación de Código Muerto (`ts-prune`)
Si `ts-prune` dice que `export const foo` en `lib/bar.ts` es unused:
1. Ejecuta `grep_search` buscando "foo".
2. Si aparece solo en su definición → **CONFIRMADO**.
3. Si aparece en imports dinámicos o cadenas (aunque sea raro) → **SOSPECHOSO** (Investigar).

### 3. Verificación de Duplicados (`jscpd`)
Si `jscpd` marca duplicidad entre A y B:
1. Lee ambos archivos (`view_file`).
2. ¿Es lógica de negocio idéntica? → **CONFIRMADO** (Refactorizar).
3. ¿Es boilerplate o configuración necesaria/trivial? → **IGNORAR**.

## Salida: Correction Plan

Genera un artifact llamado `correction_plan.md` usando la plantilla `correction-template.md`.

- **Categoría**: "Dead Code" o "Duplicate".
- **Severidad**: Alta (Lógica compleja duplicada), Media (Exports sin usar), Baja (Cosmético).
- **Acción**: "Borrar Archivo", "Borrar Export", "Extract Utils", "Ignore".
