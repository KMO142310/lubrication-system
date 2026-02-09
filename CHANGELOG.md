# Changelog — BITACORA

---

## [2.0.0] - 2026-02-09

### Auditoría y preparación de deploy

#### Build
- Resuelto conflicto de rutas paralelas: `(lubricator)` movido a segmento `/lubricator/`
- Resuelto error Turbopack con `@react-pdf/renderer` usando import dinámico en runtime
- Corregido error TypeScript en `UserForm.tsx` (union type en react-hook-form)
- Instalado Tailwind CSS 3 + PostCSS (faltaba como dependencia)
- Eliminadas dependencias no usadas: `@ducanh2912/next-pwa`, `next-pwa`
- Build limpio con 0 errores en Next.js 16.1.4 (Turbopack)

#### Seguridad
- Agregado filtro `company_id` en todos los hooks de datos (multi-tenant)
- Creado helper `lib/supabase/getCompanyId.ts` reutilizable
- Hooks corregidos: useAreas, useMachines, useLubricantTypes, useLubricationPoints, useRoutes, useWorkOrders, useUsers, useInventory, useInsights

#### Deploy
- `next.config.ts`: eliminado wrapper PWA, agregado `serverExternalPackages`, dominios de imagen Supabase
- `vercel.json`: eliminado flag `--webpack`, agregados headers de seguridad, config de Service Worker
- `.gitignore`: excluido `.env.local.example` para que sea committeable

#### PWA
- `manifest.json` actualizado a branding BITACORA
- Iconos SVG con iniciales "BT" en machinery orange sobre carbon
- Service Worker con cache-first (estáticos), network-first (Supabase), stale-while-revalidate (páginas)
- `ServiceWorkerRegistrar.tsx` integrado en layout raíz

#### Documentación
- README.md reescrito para BITACORA
- CHANGELOG.md actualizado

---

## [1.0.0] - 2026-01-23

### Release inicial

- Gestión de activos: áreas, máquinas, puntos de lubricación, lubricantes
- Ejecución operacional: órdenes de trabajo, ejecución punto a punto
- Roles: supervisor y lubricador con RBAC
- Dashboard con KPIs
- Reportes PDF
- Integración Supabase (Auth + Storage + PostgreSQL)
- Deploy en Vercel

---

## [0.1.0] - 2026-01-20

### Versión inicial

- Estructura base del proyecto
- Componentes UI
- Sistema de autenticación local
