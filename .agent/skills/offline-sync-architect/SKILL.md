---
name: offline-sync-architect
description: Skill para diseñar e implementar arquitecturas 'Offline-First' robustas, manejo de sincronización y resolución de conflictos.
---

# Offline Sync Architect Skill

Esta skill define cómo construir aplicaciones que funcionan sin internet y sincronizan datos de manera confiable.

## Arquitectura de Datos

### 1. Local-First Database
- La fuente de la verdad para la UI es **SIEMPRE** la base de datos local (IndexedDB/SQLite en móvil).
- Nunca esperar a la red para renderizar.
- Tecnologías recomendadas:
    - **RxDB**: Base de datos reactiva NoSQL sobre IndexedDB.
    - **TanStack Query (Persist)**: Para cache simple.
    - **Dexie.js**: Wrapper ligero de IndexedDB.

### 2. Cola de Sincronización (Sync Queue)
- Todas las mutaciones (POST, PUT, DELETE) se guardan en una "Outbox" (Cola de Salida) local.
- Un "Worker" procesa la cola:
    1. Detecta conexión online.
    2. Envía petición.
    3. Si éxito -> Elimina de la cola.
    4. Si fallo -> Reintenta con *Exponential Backoff*.

### 3. Resolución de Conflictos
- **Last-Write-Wins (LWW)**: Estrategia por defecto. El timestamp más reciente gana.
- **Merge Semántico**: Para casos complejos (ej: lista de chequeo), fusionar cambios en lugar de sobrescribir.

## Patrones de Implementación

### `SyncStatusIndicator`
Componente UI que muestra al usuario el estado de la sincronización:
- 🟢 **Sincronizado**: Todo al día.
- 🟡 **Sincronizando...**: Subiendo cambios.
- 🔴 **Offline (5 cambios pendientes)**: Sin red, datos guardados localmente.

### `Optimistic UI`
Actualizar la interfaz **inmediatamente** al hacer una acción, asumiendo que el servidor responderá OK. Si falla, revertir (rollback) y notificar.

## Checklist de Verificación Offline
- [ ] ¿La app carga con el cable de red desconectado?
- [ ] ¿Puedo crear una tarea offline y verla en la lista "pendiente de subida"?
- [ ] ¿Se recupera automáticamente al volver la red?
- [ ] ¿Maneja errores de servidor (500) sin perder datos locales?
