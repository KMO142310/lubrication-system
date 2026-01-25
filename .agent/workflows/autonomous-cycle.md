---
description: Ciclo autónomo completo que ejecuta análisis, mejora y verificación del proyecto AISA de forma continua.
---

# Autonomous Cycle Workflow

Este workflow orquesta todo el ciclo de mejora continua del sistema AISA de lubricación.

## Trigger
Ejecutar cuando se detecten:
- Nuevas imágenes de WhatsApp en `/BITACORA/`
- Cambios en requisitos del usuario
- Errores en build/tests
- Solicitud explícita: `/autonomous-cycle`

## Fases del Ciclo

### 1. SCAN - Escanear Entorno
```bash
// turbo
# Buscar nuevas imágenes para procesar
find /Users/omaralexis/Desktop/BITACORA -name "WhatsApp*.jpeg" -newer .last-scan

# Verificar estado del proyecto
npm run build
npm run test
```

**Entregables:**
- Lista de imágenes nuevas
- Estado de build/tests
- Errores pendientes

---

### 2. ANALYZE - Analizar Requerimientos
- Leer imágenes encontradas
- Identificar tipo: ¿Tabla de equipos? ¿Plano técnico? ¿Boceto?
- Determinar skill apropiado:
  - Tabla → `/equipment-extraction`
  - Plano → `/plan-restoration`
  - Código → `/audit-cycle`

---

### 3. EXECUTE - Ejecutar Skills
Según el tipo de contenido detectado:

```bash
# Para tablas de equipos
@agent skill equipment-extraction --input <imagen>

# Para planos técnicos
@agent skill plan-restoration --input <imagen>

# Para código
@agent workflow audit-cycle
```

---

### 4. VERIFY - Verificar Resultados

```bash
// turbo
npm run build
npm run lint
npm run test
```

**Criterios de éxito:**
- [ ] Build sin errores
- [ ] Tests pasando
- [ ] Nuevos datos integrados

---

### 5. COMMIT - Guardar Progreso

```bash
git add -A
git commit -m "auto: [tipo] [descripción breve]"
```

**Tipos de commit:**
- `feat` - Nueva funcionalidad
- `fix` - Corrección de error
- `data` - Nuevos datos extraídos
- `docs` - Documentación
- `style` - Formato/estilos

---

### 6. LEARN - Registrar Aprendizajes

Actualizar `.agent/memory/learnings.md` con:
- Patrones exitosos
- Errores y soluciones
- Optimizaciones descubiertas

---

## Mecanismo de Auto-Llamado

El ciclo se reinicia automáticamente cuando:
1. Se completa una iteración exitosa
2. Se detectan nuevos archivos
3. Han pasado 30 minutos desde la última ejecución

```typescript
// Pseudo-código de orquestación
while (projectActive) {
  const changes = await scanForChanges();
  if (changes.length > 0) {
    for (const change of changes) {
      await processChange(change);
    }
    await verifyAndCommit();
  }
  await updateCheckpoint();
  await sleep(INTERVAL);
}
```

---

## Checkpoints

Se mantiene un archivo `.last-checkpoint` con:
```json
{
  "timestamp": "2026-01-25T16:42:00Z",
  "lastImage": "WhatsApp Image 2026-01-25 at 12.51.16.jpeg",
  "lastCommit": "bd11a3b",
  "status": "success",
  "nextTask": null
}
```

---

## Recovery de Errores (Self-Healing)

Si cualquier paso del ciclo falla, se invoca automáticamente el skill de recuperación:

```bash
# 1. Capturar error
npm run build 2> error.log

# 2. Invocar skill
@agent skill error-recovery --analyze error.log
```

Si el skill logra recuperar:
1. Se reinicia el paso fallido.
2. Se registra la corrección en `learnings.md`.

Si no logra recuperar:
1. **Rollback**: `git reset --hard HEAD~1` (si se hizo commit).
2. **Notificar**: Generar alerta en `task.md`.
3. **Pausar**: Esperar intervención humana si es crítico.
