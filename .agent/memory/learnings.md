# Lecciones Aprendidas

Bitácora de errores resueltos y conocimientos adquiridos para evitar problemas futuros.

<!-- Agregar nuevas lecciones abajo con formato: -->
<!-- ## [FECHA] - Título del Problema/Hallazgo -->

## [2026-01-25] Dependencias Internas en Borrado de Código Muerto
**Problema**: Al borrar `getPendingCorrections` (reportado como unused), rompió `getSecuritySummary` que lo usaba internamente.
**Causa**: `ts-prune` reporta exportaciones no usadas *externamente*, pero pueden usarse dentro del mismo módulo.
**Solución**: Verificar referencias internas con `grep` o búsquedas locales antes de confiar ciegamente en reportes de "unused export".
