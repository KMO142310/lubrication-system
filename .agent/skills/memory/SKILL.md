---
description: Instrucciones para que el agente utilice los archivos de memoria persistente para recordar decisiones, contexto y aprendizajes.
---

# Memory Management Skill

Esta skill te enseña CÓMO y CUÁNDO usar tu memoria a largo plazo ubicada en `.agent/memory/`.

## Archivos de Memoria

El directorio `.agent/memory/` contiene tu cerebro extendido:

1. **`decisions.md`**: Registro inmutable de decisiones técnicas y de producto.
2. **`context.md`**: Estado actual, prioridades y bloqueadores. Se sobreescribe/actualiza frecuentemente.
3. **`learnings.md`**: Bitácora de errores corregidos y lecciones aprendidas para no repetir fallos.
4. **`todos.md`**: Backlog de tareas técnicas que quedan pendientes entre sesiones.

## Cuándo Escribir en Memoria

### EN `decisions.md`
- Cuando el usuario confirma una elección de tecnología (ej: "Usaremos Supabase").
- Cuando se decide un cambio de arquitectura (ej: "Mover lógica de sync al cliente").
- **Acción**: Append al final del archivo.

### EN `context.md`
- Al iniciar una gran tarea: Actualiza qué se está haciendo.
- Al terminar la sesión: Deja una nota sobre en qué estado quedó el proyecto.
- **Acción**: Reemplazar o actualizar secciones específicas.

### EN `learnings.md`
- Después de un error de compilación difícil de arreglar.
- Cuando descubres una peculiaridad del entorno del usuario.
- **Acción**: Append con formato `## [FECHA] - Problema`.

### EN `todos.md`
- Cuando ves algo refactorizable pero no es el foco actual.
- Cuando el usuario pide algo para "más tarde".
- **Acción**: Agregar checkbox a la lista correspondiente.

## Cómo Escribir

Usa siempre las herramientas de `read_file` primero para ver el contenido, y luego `replace_file_content` (o `write_to_file` si es append seguro/nuevo archivo).

**Ejemplo de entrada en decisions.md:**
```markdown
## [2024-03-20] Implementación de Offline-First
**Contexto**: Los operarios trabajan en sótanos sin señal.
**Decisión**: Usar local storage y cola de sincronización en `lib/sync.ts`.
**Consecuencias**: Complejidad aumentada en manejo de conflictos.
```
