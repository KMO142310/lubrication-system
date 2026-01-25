---
description: Ciclo autónomo completo que ejecuta análisis, mejora y verificación del proyecto AISA de forma continua.
---

# Autonomous Cycle - AISA Lubricación

Workflow maestro que orquesta todos los procesos autónomos del proyecto.

## Modo de Ejecución
- **Trigger**: Usuario envía `/autonomous-cycle`
- **Modo**: Continuo hasta completar objetivo o alcanzar límite

## Ciclo Principal

```
┌─────────────────────────────────────────────────────┐
│                  AUTONOMOUS CYCLE                    │
├─────────────────────────────────────────────────────┤
│  1. ANALYZE    → Leer ROADMAP, determinar estado    │
│  2. PLAN       → Seleccionar siguiente tarea        │
│  3. EXECUTE    → Implementar cambio                 │
│  4. VERIFY     → Build + Deploy + Test              │
│  5. DOCUMENT   → Actualizar ROADMAP y walkthrough   │
│  6. REPEAT     → Si hay más tareas, volver a 1      │
└─────────────────────────────────────────────────────┘
```

## Fase 1: ANALYZE

```bash
// turbo
cat ROADMAP_ENTERPRISE.md | grep -A5 "EN PROGRESO"
```

1. Leer `ROADMAP_ENTERPRISE.md`
2. Identificar la fase actual en progreso
3. Verificar qué subtareas quedan pendientes
4. Determinar si hay blockers

## Fase 2: PLAN

Seleccionar la siguiente tarea según prioridad:
1. **Críticas primero**: Errores de build/deploy
2. **UI pendiente**: Si Fase 0 < 100%
3. **ROADMAP secuencial**: Fase 1.2, 1.3, 2.1, etc.

## Fase 3: EXECUTE

Según el tipo de tarea:

### Si es código:
1. Crear/modificar archivos necesarios
2. Seguir patrones existentes del proyecto
3. Mantener tipos en `lib/types.ts`
4. Usar CSS industrial de `globals.css`

### Si es configuración:
1. Verificar .env.local
2. Actualizar scripts si necesario
3. Agregar migraciones SQL si es DB

## Fase 4: VERIFY

// turbo-all
```bash
npm run build -- --webpack
```

Si el build falla:
1. Leer errores
2. Corregir automáticamente
3. Re-intentar build

Si el build pasa:
```bash
git add -A && git commit -m "feat/fix: [descripción]"
git push origin main
vercel --prod
```

## Fase 5: DOCUMENT

1. Actualizar `ROADMAP_ENTERPRISE.md`:
   - Marcar tarea completada
   - Actualizar porcentajes

2. Actualizar `walkthrough.md`:
   - Agregar lo implementado
   - Incluir screenshots si hay UI

3. Commit de documentación:
```bash
git add -A && git commit -m "docs: update progress"
git push origin main
```

## Fase 6: REPEAT

Verificar condiciones de continuación:

### Continuar si:
- Hay más tareas pendientes en ROADMAP
- No hay errores bloqueantes
- Usuario no ha interrumpido

### Pausar si:
- Fase actual del ROADMAP completa (notificar usuario)
- Error que requiere decisión humana
- 5+ iteraciones sin interacción

## Workflows Integrados

Este ciclo invoca automáticamente:
- `/quality-verify` después de cada deploy
- `/auto-sync` cuando hay cambios de datos
- `/autonomous-dev` para fases del ROADMAP

## Límites de Seguridad

- **Max commits por ciclo**: 10
- **Max tiempo sin notificar**: 30 minutos
- **Auto-pause si**: 3 builds fallidos consecutivos

## Notificación Final

Al completar un ciclo significativo, usar `notify_user`:
```
✅ Ciclo Autónomo Completado

Tareas ejecutadas:
- [lista de tareas]

Próximos pasos:
- [siguiente fase]

Deploy: https://lubrication-system.vercel.app
```
