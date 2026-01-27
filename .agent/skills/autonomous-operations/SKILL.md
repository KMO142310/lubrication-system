---
description: Conjunto de agentes autónomos para verificar calidad, seguridad y despliegue del proyecto.
---

# Autonomous Operations Skill

Este skill provee un "Centro de Operaciones" donde scripts autónomos (Agentes) monitorean y ejecutan tareas críticas del ciclo de vida del software.

## Agentes Disponibles

### 1. 🛡️ Deploy Guard (`deploy-guard.ts`)
*   **Responsabilidad**: Asegurar que lo que está en GitHub y Vercel coincide.
*   **Trigger**: `npm run ops:deploy`
*   **Acciones**:
    *   Verifica estado de Git.
    *   Verifica último despliegue en Vercel.
    *   Si hay discrepancia > 1 commit, fuerza despliegue.

### 2. 🔬 Quality Monitor (`quality-monitor.ts`)
*   **Responsabilidad**: Gatekeeper de calidad de código.
*   **Trigger**: `npm run ops:quality` (Pre-commit)
*   **Acciones**:
    *   Busca código muerto (exports no usados).
    *   Verifica tipos de TypeScript.
    *   Valida estructura de imports.

### 3. 🧠 Ops Manager (`ops-manager.ts`)
*   **Responsabilidad**: Orquestador maestro.
*   **Trigger**: `npm run ops`
*   **Acciones**:
    *   Ejecuta secuencia: Quality -> Build -> Deploy.
    *   Reporta estado general del sistema.

## Uso

```bash
# Ejecutar ciclo completo de operaciones
npm run ops

# Ejecutar solo guardia de despliegue
npm run ops:deploy

# Verificar calidad
npm run ops:quality
```
