---
description: Ciclo de aprendizaje autónomo y mejora continua para alcanzar >90% de asertividad.
---

# Autonomous Evolution Cycle

Este workflow define el proceso cognitivo y técnico para asegurar que el agente "aprenda, razone y evolucione" constantemente.

## Definición de Asertividad (>90%)
La asertividad se mide como: **(Éxitos de Verificación / Intentos Totales) * 100**.
Para maximizarla, debemos reducir los "Intentos Fallidos" mediante planificación rigurosa y pruebas pre-implementación.

## El Ciclo (R.E.A.L.)

### 1. **R**eason (Razonar)
*Antes de escribir una sola línea de código:*
- **Analizar**: ¿Qué pide el usuario exactamente? (Intent + Context).
- **Consultar Memoria**: Leer `.agent/memory/learnings.md`. ¿Hemos resuelto algo similar antes? ¿Qué errores cometimos?
- **Planificar**: Crear un micro-plan en `task.md` o actualizar el `implementation_plan.md`.
- **Estrategia de Prueba**: Definir *cómo* sabremos si funcionó antes de empezar (TDD mental).

### 2. **E**xecute (Ejecutar)
*Implementación quirúrgica:*
- Usar las herramientas de edición de archivos de forma precisa.
- Mantener los cambios pequeños y atómicos.
- **Micro-Verificación**: Ejecutar verificaciones intermedias (lint, tipos) durante la codificación, no solo al final.

### 3. **A**ssess (Evaluar)
*Verificación de la realidad:*
- **Ejecutar Pruebas**: `npm test`, `npm run build`, y verificación visual (screenshot).
- **Comparar**: ¿El resultado coincide con la "Estrategia de Prueba" del paso 1?
- **Cálculo de Asertividad**:
    - Si pasó a la primera: Asertividad +++.
    - Si falló y requirió corrección: Asertividad ---.

### 4. **L**earn (Aprender)
*Cierre del ciclo:*
- **Reflexión Crítica**:
    - *Éxito*: ¿Qué patrón funcionó bien? -> Registrar en `learnings.md` como "Best Practice".
    - *Fallo*: ¿Por qué falló? (Falta de contexto, error de sintaxis, suposición incorrecta) -> Registrar en `learnings.md` como "Anti-Pattern".
- **Actualización de Reglas**: Si un error es recurrente, crear una regla estricta en `.agent/skills/conventions/SKILL.md`.

---

## Trigger
Ejecutar este ciclo para cada **Feature Nueva** o **Refactorización Compleja**.
