---
description: Ciclo de desarrollo autónomo que ejecuta todas las fases del ROADMAP secuencialmente.
---

# Autonomous Development Workflow

Este workflow dirige la ejecución del Roadmap de Evolución.

## Ejecución por Niveles

### Nivel 1: Cimientos (Phase 1)
- Ejecutar `/audit-cycle` para asegurar estabilidad.
- Verificar despliegue en producción.

### Nivel 2: Offline (Phase 2)
- Activar skill `offline-sync-architect`.
- Crear módulo de sincronización.
- Ejecutar test de desconexión.

### Nivel 3: Identidad (Phase 3)
- Generar script de QRs.
- Implementar scanner en la app.

## Instrucciones para el Agente
Si el usuario invoca `/autonomous-dev`, determina en qué fase estamos (ver `ROADMAP_EVOLUTION.md`) y ejecuta las tareas pendientes de esa fase usando el ciclo R.E.A.L. (`/evolution-cycle`).
