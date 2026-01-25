---
description: Provee conocimiento profundo sobre la estructura, stack tecnológico y componentes principales del proyecto Maintenance System.
---

# Project Knowledge: Maintenance System (Lubrication)

Esta skill te da contexto inmediato sobre el proyecto para que no necesites explorar la estructura básica.

## Resumen del Proyecto
Sistema de gestión de mantenimiento y lubricación industrial para AISA. Permite gestionar rutas de lubricación, auditorías, y reportes de ejecución.

## Stack Tecnológico
- **Framework**: Next.js 14+ (App Router)
- **Lenguaje**: TypeScript
- **Base de Datos**: Supabase (PostgreSQL)
- **Estilos**: Tailwind CSS (vía `components/ui` y globals)
- **Iconos**: Lucide React

## Estructura de Directorios Clave

### `/app`
Contiene las rutas y páginas de la aplicación (App Router).
- `(auth)`: Rutas de autenticación.
- `dashboard`: Panel principal de usuario.
- `api`: Endpoints de API (Next.js API Routes).

### `/components`
Componentes de UI reutilizables.
- `ui`: Componentes base (probablemente shadcn/ui o similares).
- `PhotoUpload.tsx`: Componente para carga de evidencia fotográfica.
- `ConnectionStatus.tsx`: Indicador de estado de conexión (offline/online first).

### `/lib`
Lógica de negocio y utilidades.
- `supabase.ts`: Cliente de conexión a Supabase.
- `sync.ts`: Lógica de sincronización offline-online.
- `utils.ts`: Funciones de utilidad generales.

### `/supabase`
Configuraciones y migraciones de base de datos.

## Modelos de Datos Principales (Inferidos)
- **Rutas de Lubricación**: Programación de tareas.
- **Puntos de Mantenimiento**: Máquinas o componentes específicos.
- **Reportes/Ejecuciones**: Registro de trabajo realizado (con fotos).

## Flujos Críticos
1. **Sincronización Offline**: El sistema debe funcionar sin conexión y sincronizar cuando recupere la red (`lib/sync.ts`).
2. **Carga de Evidencia**: Las fotos son críticas para validar el trabajo.
