---
description: Estándares de codificación, convenciones de nomenclatura y patrones preferidos para el proyecto.
---

# Project Conventions & Standards

Sigue estas reglas estrictamente para mantener la consistencia del código.

## Naming Conventions
- **Componentes React**: `PascalCase` (ej: `PhotoUpload.tsx`).
- **Funciones y Variables**: `camelCase` (ej: `uploadImage`).
- **Archivos de Utilidad**: `kebab-case` o `camelCase` (consistente con `sync.ts`).
- **Constantes**: `UPPER_SNAKE_CASE` para valores hardcodeados globales.

## React & Next.js
- Usar **Functional Components** con TypeScript.
- Preferir `interface` sobre `type` para props de componentes.
- Usar Server Components por defecto en `app/`, Client Components (`use client`) solo cuando sea necesario (interactividad, hooks).
- Importaciones: Agrupar imports de terceros, luego imports locales absolutos (`@/components/...`), luego relativos.

## Styling (Tailwind CSS)
- Usar clases de utilidad de Tailwind.
- Evitar estilos en línea (`style={{...}}`).
- Para clases condicionales extensas, usar `cn()` (función `clsx` + `tailwind-merge`) si está disponible en `lib/utils`.
- **UI Patterns**:
  - **Navegación**: Usar `lib/navigation.ts` para configuración (data-driven) en lugar de hardcodear menús.
  - **KPIs/Cards**: Usar `MetricCard` para tarjetas de métricas estandarizadas.

## Manejo de Estado
- Preferir estado local (`useState`) para UI simple.
- Usar Context o Zustand (si existe) para estado global.
- Para data server-side, usar fetching directo en Server Components o React Query/SWR en cliente.

## TypeScript
- **No usar `any`**. Definir tipos explícitos.
- Usar tipos generados por Supabase para la base de datos (seguridad de tipos end-to-end).
