---
description: Sistema de verificación continua que audita código, UI y funcionalidad
---

# Quality Verification Cycle

Workflow autónomo para verificar la calidad del sistema de forma continua.

## Trigger
- Después de cada deploy a producción
- Cada 24 horas (verificación programada)
- Cuando el usuario solicita `/verify`

## Pasos

### 1. Build Verification
// turbo
```bash
npm run build -- --webpack 2>&1 | tail -20
```
- Si falla: Reportar errores y pausar

### 2. Type Check
// turbo
```bash
npx tsc --noEmit 2>&1 | head -30
```
- Verificar que no hay errores de TypeScript

### 3. Browser Test
Usar `browser_subagent` para:
1. Abrir https://lubrication-system.vercel.app
2. Verificar que la página carga correctamente
3. Verificar que el login funciona
4. Tomar screenshot del dashboard
5. Verificar que el sidebar se ve correcto

### 4. Sync Status Check
Verificar que la sincronización con Supabase funciona:
- Comprobar que los indicadores de conexión aparecen
- Verificar que no hay errores en console

### 5. Generar Reporte
Actualizar `walkthrough.md` con:
- Estado actual del sistema
- Screenshots de UI
- Errores encontrados (si hay)
- Recomendaciones

## Acciones Correctivas Automáticas
- Si hay errores de lint: Intentar auto-fix
- Si hay errores de CSS: Revisar globals.css
- Si hay errores de tipos: Revisar lib/types.ts

## Notificación
Solo notificar al usuario si:
- Hay errores críticos que requieren atención
- El verificación completó exitosamente (resumen breve)
