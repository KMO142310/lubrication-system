# 🏭 ROADMAP MAESTRO DE EVOLUCIÓN: AISA INDUSTRIAL 2.0

Este documento define la transformación de "Sistema de Registro" a "Plataforma de Confiabilidad Industrial", basado en los estándares de líderes de mercado como *Noria LubePM* y *SKF eLube*.

**Filosofía**: Desarrollo iterativo y autónomo usando `/evolution-cycle` y `/audit-cycle`.

---

## 🗺️ Visión Fase a Fase

### 🏁 FASE 1: Estabilización & Cimientos (Actual - Vercel/Supabase)
> **Objetivo**: Asegurar que lo que existe hoy funcione sin fallos en producción.
- [x] Migración completa a Supabase (Postgres).
- [x] Despliegue en Vercel.
- [/] **CI/CD Robusto**: Auditoría automática en cada commit.
- [ ] **Tests E2E**: Cypress/Playwright para flujos críticos (Login -> Tarea -> Cierre).

### 📱 FASE 2: "Field Intelligence" (Offline-First & PWA)
> **Objetivo**: Que la app funcione en el sótano de la planta sin internet.
- [ ] **Arquitectura Offline**: Implementar `RxDB` o Motor de Sincronización propio sobre IndexedDB.
- [ ] **PWA Real**: Installable, Service Workers para cache de assets estáticos y base de datos local.
- [ ] **Cola de Sincronización**: Manejo de conflictos (Last-Write-Wins) y reintentos automáticos.
- [ ] **Skill Requerida**: `offline-architect` (Experto en sync engines y local-first).

### 🏷️ FASE 3: Identificación & Rutas (QR/NFC)
> **Objetivo**: Eliminar el error humano en la selección de equipos.
- [ ] **Módulo Scanner**: Usar cámara para escanear QRs de equipos.
- [ ] **Generador de Etiquetas**: Script para generar PDF con QRs de los 153 equipos.
- [ ] **Rutas Dinámicas**: Ordenar tareas por geolocalización o flujo lógico de planta (Optimización).
- [ ] **Validación NFC**: (Futuro) Tap-to-confirm presencia en el equipo.

### 📊 FASE 4: Confiabilidad & Analytics (Reliability)
> **Objetivo**: Pasar de "Hacer Tareas" a "Mejorar la Maquinaria".
- [ ] **Dashboard de Confiabilidad**: KPIs de *Cumplimiento vs. Eficacia*.
- [ ] **Gestión de Stock**: Consumo real vs Stocks mínimos de lubricantes.
- [ ] **Tendencias**: Gráficas de consumo anómalo (Detección temprana de fallas).
- [ ] **Skill Requerida**: `data-analyst` (SQL avanzado y visualización).

---

## 🧠 Nuevas Habilidades del Agente (Skills)

Para ejecutar esto, crearé las siguientes Skills en `.agent/skills/`:

### 1. `industrial-ux-designer`
*   **Propósito**: Generar interfaces para operarios con guantes, pantallas sucias y poca luz.
*   **Reglas**: Botones grandes, alto contraste, flujos lineales (wizard), feedback háptico.

### 2. `offline-sync-architect`
*   **Propósito**: Diseñar la capa de datos local y la lógica de sincronización.
*   **Herramientas**: Dexie.js, TanStack Query (persist).

### 3. `audit-automation`
*   **Propósito**: Ejecutar `/audit-cycle` automáticamente antes de cada release de fase.

---

## 📜 Scripts de Automatización

Scripts que el agente desarrollará para acelerar la evolución:

1.  `scripts/generate-qr-assets.ts`: Genera SVGs/PDFs con códigos QR para cada UUID de máquina.
2.  `scripts/simulate-network-conditions.ts`: Pruebas de caos (cortar red, latencia) para validar Offline-First.
3.  `scripts/analyze-usage-patterns.ts`: Analiza logs para sugerir optimizaciones de rutas.

---

## 🔄 Metodología de Trabajo

Para cada Fase, ejecutaremos:

1.  **/evolution-cycle (Planning)**:
    *   Investigación (R)
    *   Diseño de Arquitectura
    *   Definición de Pruebas

2.  **/evolution-cycle (Execution)**:
    *   Implementación iterativa.
    *   Creación de Artifacts.

3.  **/audit-cycle (Verification)**:
    *   Antes de cerrar la fase, auditoría completa de seguridad, performance y calidad.
