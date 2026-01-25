---
description: Skill para auditar la calidad del código, seguridad y deuda técnica.
---

# Code Quality Audit Skill

Este skill realiza un análisis estático y dinámico del código para asegurar estándares de calidad industrial.

## Capacidades

### 1. Análisis Estático (Linter/Typescript)
- Reglas estrictas de ESLint
- Verificación de tipos TypeScript (`noImplicitAny`, etc.)
- Detección de código muerto (Unused exports)

### 2. Seguridad
- Escaneo de secretos en código
- Auditoría de dependencias (`npm audit`)
- Verificación de políticas RLS en Supabase

### 3. Deuda Técnica
- Complejidad ciclomática
- Duplicación de código
- TODOs antiguos

---

## Estrategia de Auditoría

### Nivel 1: Bloqueante (CI/CD)
No permite commit si falla:
- Errores de sintaxis
- Tipos rotos
- Secretos expuestos

### Nivel 2: Advertencia (Review)
Permite commit pero genera alerta:
- `console.log` olvidados
- Funciones muy largas (>50 líneas)
- Any implícitos

### Nivel 3: Informativo (Reporte)
Solo para dashboard de calidad:
- Cobertura de tests < 80%
- TODOs sin fecha

---

## Scripts

### `audit.ts`
Ejecuta la suite completa de auditoría.

```bash
/code-quality-audit --level strict
```

### `fix-auto.ts`
Aplica correcciones automáticas seguras.

```bash
/code-quality-audit --fix
```

---

## Integración con Autonomous Cycle

Este skill se invoca en la fase **VERIFY** del ciclo autónomo. Si detecta problemas de Nivel 1, dispara el skill `error-recovery`.
