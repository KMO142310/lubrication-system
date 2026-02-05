---
name: autonomous-engineer
description: Skill unificada para el Ciclo de Evolución Autónoma. Audita, Verifica, Corrige y Documenta con rigor científico. Fusiona capacidades de audit, refactor y documentación.
version: 2.0.0
author: Antigravity
---

# 🤖 Autonomous Engineer Skill

Esta skill representa la capacidad del agente para actuar como un Ingeniero de Software Autónomo de nivel Senior/Doctoral. Unifica los fragmentos anteriores (`code-audit`, `audit-verification`, `academic-documentation`) en un solo flujo coherente.

## 🔄 El Ciclo OODA (Observe, Orient, Decide, Act)

Esta skill opera bajo el ciclo OODA para mejora continua:

### 1. 🔍 Observe (Auditoría Profunda)
Ejecutar análisis estático y dinámico para detectar anomalías.
- **Herramientas**: `npm run lint`, `tsc --noEmit`, scripts personalizados (`check-dead-code.sh`).
- **Scope**: Calidad de Código, Seguridad, UX (Layout Shifts), Rendimiento (Bundle Size).

### 2. 🧠 Orient (Verificación y Análisis)
Filtrar ruido y falsos positivos. Entender el *porqué* del error.
- **Reglas de Filtrado**: Ignorar Next.js App Router exports (`page.tsx`), configs (`middleware.ts`).
- **Análisis Causa-Raíz**: ¿Es un bug de lógica, error de build o deuda técnica?
- **Documentación Académica**: Generar `docs/audits/reasons.md` si el hallazgo es complejo.

### 3. ⚖️ Decide (Planificación)
Definir la estrategia de corrección.
- **Auto-Fix**: Para linting, formatting, imports no usados.
- **Refactor**: Para duplicidad lógica (`Strategy Pattern`, `Utils`).
- **Architecture Change**: Para problemas estructurales (e.g., "Cambiar de Flex a Grid").

### 4. ⚡️ Act (Ejecución y Fix)
Aplicar los cambios con precisión quirúrgica.
- **Safe Refactor**: Cambios atómicos.
- **Build Verification**: Siempre ejecutar `npm run build` tras cambios estructurales.
- **Memoria**: Registrar el aprendizaje en `docs/memory/learnings.md`.

## 🛠 Comandos y Flujos

### A. Auditoría Completa del Proyecto
```bash
# Paso 1: Verificación de Integridad
npm run build 

# Paso 2: Análisis de Calidad
npm run lint
```
*Si falla el build, detenerse inmediatamente. El código no es desplegable.*

### B. Consolidación de Conocimiento
Generar documentación doctoral sobre el estado del sistema.
- **Input**: Logs de errores, cambios recientes.
- **Output**: [`docs/audits/system-health.md`]

### C. Bypass de Autenticación (Modo Pruebas)
Para acelerar el desarrollo, esta skill autoriza la inyección de credenciales temporales o bypass en `lib/auth.tsx`, siempre documentando la excepción con un `// TODO: REMOVE BEFORE PROD`.

## 🚨 Manejo de Errores Críticos ("User says: Nothing changed")

Si el usuario reporta que "nada ha cambiado" tras un deploy:
1. **Verificar Build**: ¿Pasó el build localmente?
2. **Verificar Cache**: Forzar invalidación (cambio en `layout.tsx` o `globals.css`).
3. **Verificar Lógica de Renderizado**: ¿Hay un `if` que impide cargar el nuevo componente?
4. **Verificar CDN/Edge**: ¿Middleware está cacheando respuestas antiguas?
