---
description: Ciclo de desarrollo autónomo que ejecuta todas las fases del ROADMAP secuencialmente
---

# Autonomous Development Cycle

Este workflow automatiza el desarrollo continuo del sistema AISA siguiendo el ROADMAP_ENTERPRISE.md.

## Pre-requisitos
- El servidor de desarrollo debe estar corriendo (`npm run dev`)
- Git configurado y con acceso a GitHub
- Supabase configurado en .env.local

## Fases de Ejecución

### 1. Verificar Estado Actual
```bash
// turbo
git status
```
- Leer `ROADMAP_ENTERPRISE.md` para determinar la siguiente fase pendiente
- Verificar que el build actual funciona: `npm run build -- --webpack`

### 2. Ejecutar Siguiente Fase del ROADMAP
Seguir los prompts exactos definidos en ROADMAP_ENTERPRISE.md para la fase actual.
Las fases son:
- **1.1**: Supabase Sync ✅ COMPLETADA
- **1.2**: Autenticación Supabase
- **1.3**: Upload de Fotos a Storage
- **2.1**: Multi-tenancy
- **2.2**: Onboarding de Empresas
- **2.3**: Dashboard por Rol

### 3. Verificación Post-Implementación
// turbo
```bash
npm run build -- --webpack
```
- Si hay errores, corregirlos antes de continuar

### 4. Commit y Deploy
```bash
git add -A && git commit -m "feat(phase-X.Y): [descripción]"
git push origin main
```

// turbo
```bash
vercel --prod
```

### 5. Actualizar ROADMAP
- Marcar la fase completada en ROADMAP_ENTERPRISE.md
- Actualizar la sección "EN PROGRESO"
- Agregar a "FASE X.Y COMPLETADA"

### 6. Notificar Usuario
Usar `notify_user` para informar:
- Qué fase se completó
- Qué archivos se crearon/modificaron
- URL de deploy
- Siguiente fase a ejecutar

## Condición de Parada
- Si todas las fases hasta 2.3 están completadas
- Si hay un error que requiere decisión humana
- Si el usuario envía un mensaje de interrupción
