# ROADMAP: Sistema de Lubricación Enterprise

## Documento de Transformación a Producto Comercial

**Versión:** 1.1  
**Fecha:** 25 Enero 2026  
**Última Actualización:** 25-01-2026 18:55  
**Objetivo:** Convertir el sistema actual (personalizado para AISA) en un producto SaaS multi-tenant vendible a miles de empresas industriales.

---

## ESTADO ACTUAL DEL PROYECTO (ACTUALIZADO)

### ✅ Lo que YA está implementado:
| Componente | Estado | Notas |
|------------|--------|-------|
| Autenticación local | ✅ | Usuarios hardcodeados |
| UI/UX móvil responsive | ✅ | Next.js 16 + CSS Industrial |
| Gestión de tareas | ✅ | CRUD completo |
| Captura de fotos | ✅ | Anti-fraude básico |
| Firma digital | ✅ | Canvas signature |
| Generación PDF | ✅ | jsPDF + autoTable |
| Jerarquía de activos | ✅ | Planta > Área > Equipo |
| Supabase configurado | ✅ | Tablas creadas |
| Deploy en Vercel | ✅ | https://lubrication-system.vercel.app |
| **Datos Reales Foresa** | ✅ | 5 áreas, 61 máquinas |
| **Sidebar Industrial** | ✅ | Estilos HMI/SCADA |
| **Next.js 16 Compatible** | ✅ | Promise params fixed |

### 🔄 EN PROGRESO:
| Componente | Estado | Notas |
|------------|--------|-------|
| UI Industrial (Fase 0) | 🔄 80% | Sidebar done, Dashboard pending |
| Componentes HMI | 🔄 50% | LEDs, Gauges, Tags creados |

### ✅ FASE 1.1 COMPLETADA (25-01-2026):
| Componente | Estado | Notas |
|------------|--------|-------|
| Supabase Sync | ✅ | `lib/supabase-sync.ts` |
| Realtime Subscriptions | ✅ | postgres_changes |
| Offline Queue | ✅ | localStorage + auto-retry |
| useSyncStatus Hook | ✅ | `hooks/useSyncStatus.ts` |

### ✅ FASE 1.2 COMPLETADA (25-01-2026):
| Componente | Estado | Notas |
|------------|--------|-------|
| Login Supabase | ✅ | Email/password + fallback local |
| Register | ✅ | `/register` page |
| Forgot Password | ✅ | `/forgot-password` page |
| Google OAuth | ✅ | Prepared (need Supabase config) |
| Passkey (WebAuthn) | ✅ | MVP implementation |

### ✅ FASE 1.3 COMPLETADA (25-01-2026):
| Componente | Estado | Notas |
|------------|--------|-------|
| Upload to Supabase Storage | ✅ | `lib/sync.ts` |
| Image Compression | ✅ | Max 1200px, 80% quality |
| Retry with Backoff | ✅ | 3 attempts |
| Structured Paths | ✅ | `photos/{date}/{taskId}_{type}_{ts}.jpg` |

### ❌ Lo que FALTA para Enterprise:
| Componente | Prioridad | Complejidad | Fase |
|------------|-----------|-------------|------|
| Multi-tenancy | CRÍTICA | Alta | 2.1 |
| Onboarding de empresas | ALTA | Alta | 2.2 |
| Dashboard por rol | ALTA | Media | 2.3 |
| Notificaciones push | MEDIA | Media | 3.1 |
| Reportes avanzados | MEDIA | Media | 3.2 |
| API pública | BAJA | Alta | 3.3 |



---

## ARQUITECTURA OBJETIVO

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │ App Técnico │ │App Supervisor│ │ Portal Admin (Empresa) │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE (Backend)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │   Auth   │ │ Database │ │ Storage  │ │ Edge Functions │  │
│  │(Multi-   │ │ (RLS per │ │ (Photos) │ │   (Webhooks)   │  │
│  │ tenant)  │ │  tenant) │ │          │ │                │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    INTEGRACIONES                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │   SAP    │ │  Maximo  │ │  Excel   │ │   Webhooks     │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

# FASES DE DESARROLLO

## FASE 0: TRANSFORMACIÓN VISUAL (PRIORIDAD INMEDIATA)
**Objetivo:** Transformar la UI genérica en una interfaz industrial profesional (HMI/SCADA style).
**Workflow:** `/industrial-ui-redesign`

### FASE 0.1: Sistema de Diseño & Componentes
**Agente:** Industrial UI Designer

```
PROMPT: "Ver .agent/workflows/industrial-ui-redesign.md"
```

**Tareas Clave:**
1. Paleta de colores ANSI Z535 (Seguridad real).
2. Iconografía específica (bombas, motores, rodamientos) - NO iconos genéricos.
3. Componentes HMI: Gauges, LEDs, Placas de equipo, Diagramas de planta.
4. Tipografía técnica (DIN/Oswald + Mono).

---

## FASE 1: FUNDAMENTOS (2-3 semanas)
**Objetivo:** Hacer el sistema funcional con sincronización real

### FASE 1.1: Sincronización Supabase
**Agente:** Backend Developer

```
PROMPT EXACTO:

"Conecta la aplicación Next.js a Supabase para sincronización en tiempo real.

CONTEXTO:
- Supabase ya está configurado con las tablas: work_orders, tasks, anomalies, profiles, audit_logs
- Las credenciales están en .env.local
- El archivo lib/supabase-sync.ts tiene las funciones base

TAREAS:
1. Modifica lib/data.ts para usar Supabase en lugar de localStorage
2. Implementa sincronización bidireccional:
   - Al cargar la app: fetch desde Supabase
   - Al modificar datos: update en Supabase + localStorage como cache
3. Agrega listeners de tiempo real usando supabase.channel()
4. Implementa cola offline: si no hay conexión, guardar en localStorage y sincronizar cuando vuelva
5. Agrega indicador visual de estado de conexión (online/offline/syncing)

RESTRICCIONES:
- NO modificar la estructura de tipos en lib/types.ts
- NO cambiar la UI existente, solo agregar indicador de conexión
- Mantener compatibilidad con datos existentes en localStorage

ENTREGABLES:
- lib/data.ts modificado con Supabase
- Componente ConnectionStatus.tsx
- Hook useSyncStatus() para estado de sincronización
- Tests unitarios para sincronización"
```

### FASE 1.2: Autenticación Real
**Agente:** Auth Specialist

```
PROMPT EXACTO:

"Implementa autenticación real con Supabase Auth reemplazando los usuarios hardcodeados.

CONTEXTO:
- Actualmente hay 3 usuarios locales en lib/auth.tsx (admin, supervisor, tecnico)
- Supabase Auth está configurado
- La tabla profiles existe con campos: id, full_name, role, avatar_url

TAREAS:
1. Modifica lib/auth.tsx para usar Supabase Auth
2. Implementa flujos:
   - Login con email/password
   - Registro de nuevos usuarios (solo admin puede crear)
   - Recuperación de contraseña
   - Logout
3. Sincroniza el perfil del usuario con la tabla profiles
4. Mantén fallback local para desarrollo/testing
5. Agrega protección de rutas basada en rol real

RESTRICCIONES:
- Mantener la interfaz AuthContext actual
- NO romper el flujo de login existente
- Usuarios existentes deben poder seguir entrando

ENTREGABLES:
- lib/auth.tsx con Supabase Auth
- Página de registro /register
- Página de recuperar contraseña /forgot-password
- Migración de usuarios locales a Supabase"
```

### FASE 1.3: Upload de Fotos a Supabase Storage
**Agente:** Storage Specialist

```
PROMPT EXACTO:

"Implementa subida de fotos a Supabase Storage en lugar de base64 local.

CONTEXTO:
- El bucket 'photos' existe en Supabase Storage
- Actualmente las fotos se guardan como base64 en localStorage
- El componente PhotoUpload.tsx maneja la captura

TAREAS:
1. Modifica components/PhotoUpload.tsx para subir a Supabase Storage
2. Estructura de carpetas: photos/{tenant_id}/{work_order_id}/{task_id}_{timestamp}.jpg
3. Comprime imágenes antes de subir (max 1MB, 1200px)
4. Genera thumbnail para preview (200px)
5. Retorna URL pública de la imagen
6. Implementa retry en caso de fallo

RESTRICCIONES:
- Mantener compatibilidad con fotos base64 existentes
- NO cambiar la interfaz del componente
- Agregar indicador de progreso de subida

ENTREGABLES:
- PhotoUpload.tsx modificado
- Función uploadPhoto() en lib/supabase-sync.ts
- Función compressImage() helper
- Test de subida de imagen"
```

---

## FASE 2: MULTI-TENANCY (3-4 semanas)
**Objetivo:** Permitir que múltiples empresas usen el sistema

### FASE 2.1: Modelo de Datos Multi-tenant
**Agente:** Database Architect

```
PROMPT EXACTO:

"Implementa arquitectura multi-tenant en Supabase.

CONTEXTO:
- Actualmente el sistema solo funciona para AISA
- Necesitamos que múltiples empresas puedan usar el sistema
- Cada empresa debe ver solo sus datos

TAREAS:
1. Crea tabla 'tenants' (organizations):
   - id, name, slug, logo_url, settings (JSONB), created_at
   
2. Agrega columna tenant_id a todas las tablas:
   - work_orders, tasks, anomalies, profiles, audit_logs
   
3. Crea tablas de configuración por tenant:
   - tenant_plants (plantas de cada empresa)
   - tenant_areas (áreas de cada planta)
   - tenant_machines (equipos)
   - tenant_components (componentes)
   - tenant_lubrication_points (puntos de lubricación)
   - tenant_lubricants (lubricantes personalizados)
   - tenant_frequencies (frecuencias personalizadas)

4. Implementa RLS (Row Level Security):
   - Cada usuario solo ve datos de su tenant
   - Admins de tenant pueden ver todo su tenant
   - Super-admin puede ver todos los tenants

5. Crea función get_user_tenant_id() para obtener tenant del usuario actual

ENTREGABLES:
- SQL de migración para multi-tenancy
- Políticas RLS actualizadas
- Documentación de modelo de datos"
```

### FASE 2.2: Onboarding de Empresas
**Agente:** Full-Stack Developer

```
PROMPT EXACTO:

"Crea flujo de onboarding para nuevas empresas.

CONTEXTO:
- Multi-tenancy implementado en la base de datos
- Cada empresa necesita configurar su jerarquía de activos

TAREAS:
1. Crea página /onboarding con wizard de pasos:
   - Paso 1: Datos de empresa (nombre, logo, industria)
   - Paso 2: Crear primera planta
   - Paso 3: Importar activos (CSV/Excel) o crear manualmente
   - Paso 4: Configurar lubricantes
   - Paso 5: Crear usuarios iniciales
   - Paso 6: Generar plan de lubricación

2. Implementa importador de Excel:
   - Template descargable
   - Validación de datos
   - Preview antes de importar
   - Mapeo de columnas flexible

3. Crea página /admin/settings para configuración posterior

RESTRICCIONES:
- El onboarding debe completarse en menos de 15 minutos
- Debe funcionar en móvil
- Permitir guardar progreso y continuar después

ENTREGABLES:
- Páginas de onboarding
- Componente ExcelImporter
- Templates de Excel descargables
- Validaciones y feedback de errores"
```

### FASE 2.3: Dashboard por Rol
**Agente:** Frontend Developer

```
PROMPT EXACTO:

"Crea dashboards diferenciados por rol de usuario.

CONTEXTO:
- Roles existentes: admin, supervisor, tecnico
- Cada rol tiene necesidades diferentes

TAREAS:
1. TÉCNICO (app/page.tsx):
   - Ver solo sus tareas del día
   - Acceso rápido a ejecutar tarea
   - Historial personal
   - Botón de emergencia/anomalía

2. SUPERVISOR (app/supervisor/page.tsx):
   - Vista de todos los técnicos
   - Progreso en tiempo real por técnico
   - Alertas de tareas atrasadas
   - Aprobación/rechazo de tareas
   - Métricas del día/semana

3. ADMIN (app/admin/dashboard/page.tsx):
   - Métricas globales del tenant
   - Gestión de usuarios
   - Configuración del sistema
   - Reportes exportables
   - Logs de auditoría

RESTRICCIONES:
- Reutilizar componentes existentes
- Cada dashboard debe cargar en menos de 2 segundos
- Responsive para móvil y desktop

ENTREGABLES:
- Dashboard por rol
- Componentes compartidos refactorizados
- Navegación por rol en Sidebar"
```

---

## FASE 3: CARACTERÍSTICAS ENTERPRISE (4-6 semanas)
**Objetivo:** Funcionalidades avanzadas para grandes empresas

### FASE 3.1: Sistema de Notificaciones
**Agente:** Notifications Specialist

```
PROMPT EXACTO:

"Implementa sistema de notificaciones push y en-app.

CONTEXTO:
- La app necesita alertar sobre tareas pendientes
- Los supervisores necesitan saber cuando hay anomalías

TAREAS:
1. Notificaciones en-app:
   - Centro de notificaciones (campana en header)
   - Notificaciones de tareas atrasadas
   - Notificaciones de anomalías nuevas
   - Marcar como leída/todas leídas

2. Push notifications (PWA):
   - Service worker para push
   - Solicitar permiso de notificaciones
   - Notificar tareas próximas (15 min antes)
   - Notificar alertas críticas

3. Email notifications (via Supabase Edge Functions):
   - Resumen diario para supervisores
   - Alertas críticas inmediatas
   - Configuración de preferencias por usuario

4. Tabla de notificaciones en Supabase:
   - id, user_id, tenant_id, type, title, body, read, created_at

ENTREGABLES:
- Componente NotificationCenter
- Service Worker para push
- Edge Function para emails
- Configuración de preferencias"
```

### FASE 3.2: Reportes Avanzados
**Agente:** Analytics Developer

```
PROMPT EXACTO:

"Implementa sistema de reportes avanzados con gráficos.

CONTEXTO:
- Actualmente solo hay métricas básicas
- Las empresas necesitan reportes exportables

TAREAS:
1. Dashboard de Analytics (app/analytics/page.tsx):
   - Gráfico de cumplimiento semanal/mensual (línea)
   - Gráfico de tareas por técnico (barras)
   - Gráfico de anomalías por severidad (pie)
   - Gráfico de consumo de lubricantes (área)
   - Comparativa mes actual vs anterior

2. Reportes exportables:
   - Reporte diario de lubricación (PDF)
   - Reporte semanal de cumplimiento (PDF)
   - Reporte mensual ejecutivo (PDF)
   - Exportar datos a Excel

3. Filtros avanzados:
   - Por fecha (rango)
   - Por planta/área/equipo
   - Por técnico
   - Por lubricante

4. Usar librería de gráficos (Recharts o Chart.js)

ENTREGABLES:
- Página de Analytics
- Componentes de gráficos reutilizables
- Generador de reportes PDF
- Exportador Excel"
```

### FASE 3.3: Integración API
**Agente:** API Developer

```
PROMPT EXACTO:

"Crea API REST pública para integraciones externas.

CONTEXTO:
- Empresas quieren integrar con sus sistemas ERP/CMMS
- Necesitamos webhooks para eventos

TAREAS:
1. API REST (Supabase Edge Functions):
   - GET /api/v1/work-orders
   - GET /api/v1/tasks
   - POST /api/v1/tasks/{id}/complete
   - GET /api/v1/anomalies
   - GET /api/v1/metrics

2. Autenticación API:
   - API Keys por tenant
   - Rate limiting
   - Logs de uso

3. Webhooks:
   - Configurar URLs de webhook por tenant
   - Eventos: task.completed, anomaly.created, work_order.signed
   - Retry automático
   - Logs de webhooks

4. Documentación:
   - Swagger/OpenAPI spec
   - Página de documentación /docs/api

ENTREGABLES:
- Edge Functions para API
- Sistema de API Keys
- Configuración de webhooks
- Documentación OpenAPI"
```

---

## FASE 4: OPTIMIZACIÓN Y ESCALABILIDAD (2-3 semanas)

### FASE 4.1: Performance
**Agente:** Performance Engineer

```
PROMPT EXACTO:

"Optimiza el rendimiento de la aplicación para escalar.

TAREAS:
1. Frontend:
   - Implementar React.lazy() para code splitting
   - Optimizar imágenes con next/image
   - Implementar infinite scroll en listas largas
   - Cachear datos con React Query o SWR
   - Prefetch de rutas comunes

2. Backend:
   - Índices adicionales en Supabase
   - Paginación en todas las queries
   - Materializar vistas para reportes
   - CDN para assets estáticos

3. Métricas:
   - Integrar Vercel Analytics
   - Monitoreo de Core Web Vitals
   - Alertas de performance

ENTREGABLES:
- Bundle size reducido 50%
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1"
```

### FASE 4.2: Testing y QA
**Agente:** QA Engineer

```
PROMPT EXACTO:

"Implementa suite completa de testing.

TAREAS:
1. Unit Tests (Jest):
   - Todos los hooks personalizados
   - Funciones de utilidad
   - Lógica de negocio
   - Cobertura mínima 80%

2. Integration Tests (Playwright):
   - Flujo de login
   - Ejecutar tarea con foto
   - Firmar ruta
   - Crear anomalía
   - Onboarding de empresa

3. E2E Tests (Playwright):
   - Flujo completo técnico
   - Flujo completo supervisor
   - Sincronización entre dispositivos

4. CI/CD:
   - GitHub Actions para tests en PR
   - Deploy automático a staging
   - Deploy a producción con aprobación

ENTREGABLES:
- Suite de tests completa
- CI/CD configurado
- Documentación de testing"
```

---

## FASE 5: LANZAMIENTO (2 semanas)

### FASE 5.1: Preparación Comercial
**Agente:** Product Manager

```
PROMPT EXACTO:

"Prepara el producto para lanzamiento comercial.

TAREAS:
1. Landing page (marketing):
   - Beneficios del producto
   - Planes y precios
   - Demo interactiva
   - Formulario de contacto/demo
   - Testimonios

2. Documentación:
   - Guía de usuario (técnico)
   - Guía de usuario (supervisor)
   - Guía de administrador
   - FAQ
   - Videos tutoriales

3. Legal:
   - Términos de servicio
   - Política de privacidad
   - SLA

4. Soporte:
   - Sistema de tickets (Zendesk/Freshdesk)
   - Chat en vivo
   - Base de conocimientos

ENTREGABLES:
- Landing page
- Centro de ayuda
- Documentación completa
- Materiales de ventas"
```

---

# RESUMEN DE PROMPTS POR AGENTE

| # | Fase | Agente | Duración | Dependencias |
|---|------|--------|----------|--------------|
| 1 | 1.1 | Backend Developer | 3-4 días | Ninguna |
| 2 | 1.2 | Auth Specialist | 2-3 días | 1.1 |
| 3 | 1.3 | Storage Specialist | 2 días | 1.1 |
| 4 | 2.1 | Database Architect | 3-4 días | 1.1, 1.2 |
| 5 | 2.2 | Full-Stack Developer | 4-5 días | 2.1 |
| 6 | 2.3 | Frontend Developer | 3-4 días | 2.1 |
| 7 | 3.1 | Notifications Specialist | 3-4 días | 2.1 |
| 8 | 3.2 | Analytics Developer | 4-5 días | 2.1 |
| 9 | 3.3 | API Developer | 4-5 días | 2.1 |
| 10 | 4.1 | Performance Engineer | 3-4 días | Todas |
| 11 | 4.2 | QA Engineer | 5-6 días | Todas |
| 12 | 5.1 | Product Manager | 5-7 días | Todas |

---

# CÓMO USAR ESTE DOCUMENTO

## Secuencia de ejecución:

1. **Abre una nueva conversación** con el agente/modelo
2. **Copia el prompt exacto** de la fase correspondiente
3. **Ejecuta y valida** que funcione antes de pasar a la siguiente
4. **NO mezcles fases** - cada una depende de la anterior
5. **Guarda un checkpoint** después de cada fase completada

## Reglas importantes:

- ✅ **UN prompt = UN agente = UNA sesión**
- ✅ Validar que compile sin errores antes de continuar
- ✅ Hacer commit en Git después de cada fase
- ❌ NO ejecutar fases en paralelo
- ❌ NO modificar código de fases anteriores
- ❌ NO saltar fases

---

# ESTIMACIÓN TOTAL

| Concepto | Tiempo |
|----------|--------|
| Fase 1: Fundamentos | 2-3 semanas |
| Fase 2: Multi-tenancy | 3-4 semanas |
| Fase 3: Enterprise | 4-6 semanas |
| Fase 4: Optimización | 2-3 semanas |
| Fase 5: Lanzamiento | 2 semanas |
| **TOTAL** | **13-18 semanas** |

---

**Documento creado para:** Omar Alexis Mella Castro  
**Proyecto:** AISA Lubricación → LubriManager Enterprise  
**Fecha:** 23 Enero 2026
