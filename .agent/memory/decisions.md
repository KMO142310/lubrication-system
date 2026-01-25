# Decisiones Arquitectónicas

Registro de decisiones técnicas importantes tomadas durante el desarrollo.

## [2026-01-24] Creación del Sistema de Skills
**Contexto**: Necesidad de gestionar conocimiento y memoria a largo plazo en el proyecto.
**Decisión**: Implementar arquitectura de 3 skills (`project-knowledge`, `memory`, `conventions`) y 4 archivos de memoria.
**Consecuencias**: El agente ahora tiene capacidad de autodescubrimiento de contexto y persistencia de información entre sesiones.
