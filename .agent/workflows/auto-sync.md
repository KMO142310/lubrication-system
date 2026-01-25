---
description: Sincroniza automáticamente datos y genera órdenes de trabajo según frecuencias
---

# Auto-Sync and Work Order Generation

Workflow para mantener sincronizado el sistema y generar OTs automáticamente.

## Componentes Autónomos

### WF-001: Generador de Órdenes de Trabajo

**Archivo**: `scripts/generate-daily-orders.ts`

**Lógica**:
```typescript
// Ejecutar cada día a las 00:00
// 1. Leer frecuencias de cada punto de lubricación
// 2. Calcular si hoy corresponde lubricar (última ejecución + frecuencia_días <= hoy)
// 3. Crear work_order para mañana
// 4. Asignar tareas según turno del técnico
```

### WF-002: Alertas de Incumplimiento

**Archivo**: `lib/alerts-engine.ts`

**Lógica**:
```typescript
// Ejecutar cada hora durante turno (06:00 - 22:00)
// 1. Buscar tareas con status='pendiente' y hora_limite < ahora
// 2. Si hay tareas atrasadas:
//    - Primera alerta: notificar supervisor
//    - Segunda alerta (1h después): notificar gerente
// 3. Registrar en audit_log
```

### WF-003: Sincronización Offline-Online

**Archivo**: `lib/supabase-sync.ts` (YA IMPLEMENTADO)

**Funciones existentes**:
- `processQueue()` - Procesa cola offline al reconectar
- `startConnectivityMonitor()` - Detecta cambios de conexión
- `subscribeToRealtime()` - Escucha cambios en tiempo real

### WF-004: Reportes Automáticos

**Archivo**: `scripts/weekly-report.ts`

**Lógica**:
```typescript
// Ejecutar Lunes 06:00
// 1. Calcular KPIs de la semana anterior
// 2. Generar PDF con:
//    - Cumplimiento por día
//    - Anomalías abiertas
//    - Técnico con mejor desempeño
// 3. Enviar por email a lista de supervisores
```

## Implementación Pendiente

1. [ ] Crear Supabase Edge Function para WF-001
2. [ ] Crear Supabase Edge Function para WF-002
3. [ ] Implementar cron job en Vercel para WF-004
4. [ ] Configurar webhooks para notificaciones

## Ejecución Manual

Para test local de generación de OTs:
```bash
npx tsx scripts/generate-daily-orders.ts
```

Para test de reportes:
```bash
npx tsx scripts/weekly-report.ts
```
