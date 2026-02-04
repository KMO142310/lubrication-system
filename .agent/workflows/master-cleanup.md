---
description: Ciclo completo de limpieza y mejora del código
---

# /master-cleanup - Limpieza Maestra del Código

Este workflow ejecuta una limpieza completa del proyecto en 5 pasos.

## Prerrequisitos
- Node.js instalado
- Proyecto clonado y dependencias instaladas (`npm install`)

## Pasos

### 1. Ejecutar Auditoría de Código Muerto
```bash
npm run audit:dead-code
```
- Analiza archivos no importados
- Encuentra funciones no usadas
- Detecta imports sin usar
- Genera reporte en `.agent/memory/last-audit-report.json`

### 2. Revisar Reporte y Priorizar
Revisar el reporte generado y decidir qué archivos eliminar:
- 🔴 **Alta prioridad**: Eliminar inmediatamente
- 🟡 **Media prioridad**: Revisar y decidir
- 🟢 **Baja prioridad**: Opcional

### 3. Ejecutar ESLint con Auto-fix
```bash
npm run lint
```
- Corrige imports no usados automáticamente
- Arregla problemas de formato
- Reporta errores que requieren corrección manual

### 4. Verificar TypeScript
```bash
npx tsc --noEmit
```
- Verifica tipos sin compilar
- Reporta errores de tipos

### 5. Build de Verificación
```bash
npm run build
```
- Verifica que el proyecto compila
- Detecta errores en tiempo de build

## Comandos Turbo (Auto-ejecutar)

// turbo
```bash
npm run audit:dead-code
```

// turbo
```bash
npm run lint
```

// turbo
```bash
npx tsc --noEmit
```

## Resultado Esperado
- Proyecto sin código muerto
- Sin imports no usados
- Sin errores de TypeScript
- Build exitoso
