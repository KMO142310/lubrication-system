# BITACORA — Sistema de Gestión de Lubricación Industrial

[![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL+Auth+Storage-green?logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

Sistema multi-tenant para planificar, ejecutar y supervisar la lubricación industrial. Diseño mobile-first para lubricadores en terreno, con panel de supervisión desktop.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Lenguaje | TypeScript 5 (strict) |
| Backend | Supabase (PostgreSQL + Auth + RLS + Storage) |
| Estilos | Tailwind CSS 3 + CSS Design System industrial |
| Formularios | React Hook Form + Zod |
| Gráficos | Recharts |
| PDF | @react-pdf/renderer (dynamic import) |
| PWA | Service Worker custom (cache-first / network-first) |
| Deploy | Vercel Edge Network |

---

## Estructura del Proyecto

```
app/
  (supervisor)/         # Rutas de supervisor (route group)
    dashboard/          # KPIs, gráficos
    areas/              # Gestión de áreas
    machines/           # Gestión de máquinas
    points/             # Puntos de lubricación
    lubricants/         # Tipos de lubricante
    routes/             # Rutas de lubricación
    work-orders/        # Órdenes de trabajo
    workers/            # Gestión de personal
    inventory/          # Stock de lubricantes
    reports/            # Generación de PDF
    insights/           # Inteligencia operacional
  lubricator/           # Rutas de lubricador (URL segment)
    dashboard/          # Vista diaria simplificada
    execute/[id]/       # Ejecución punto a punto
    report/             # Reporte de problemas
    complete/           # Pantalla de ruta completada
  login/                # Autenticación
  layout.tsx            # Layout raíz + PWA
components/
  supervisor/           # Sidebar, formularios CRUD
  charts/               # ConsumptionChart, ComplianceChart
  reports/              # DailyReport (PDF)
  shared/               # ServiceWorkerRegistrar
  ui/                   # shadcn/ui primitives
hooks/                  # useAreas, useMachines, useWorkOrders, etc.
lib/supabase/           # Client, server, getCompanyId helper
types/                  # TypeScript interfaces por entidad
```

---

## Roles

| Rol | Acceso |
|-----|--------|
| **Supervisor** | Dashboard KPIs, gestión de activos, rutas, OTs, reportes PDF, insights |
| **Lubricador** | Dashboard diario, ejecución de ruta punto a punto, reporte de problemas |

---

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.local.example .env.local
# Editar con las credenciales de tu proyecto Supabase

# 3. Desarrollo
npm run dev

# 4. Build de producción
npm run build
```

### Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Deploy en Vercel

1. Conectar repositorio en [vercel.com](https://vercel.com)
2. Agregar variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
3. Deploy automático en cada push a `main`

---

## Seguridad

- Todas las queries filtran por `company_id` (multi-tenant)
- Supabase RLS activo en todas las tablas
- Middleware de autenticación con redirección por rol
- Headers de seguridad (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`)
- Service Worker no cachea tokens ni datos sensibles

---

## Licencia

Propietario. Todos los derechos reservados.
