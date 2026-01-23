# Sistema de Gestión de Lubricación Industrial - AISA

[![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![License](https://img.shields.io/badge/License-Proprietary-red)]()

Sistema de gestión para el control, planificación y trazabilidad de las actividades de lubricación industrial en plantas de producción.

## 🌐 Demo en Producción

**https://lubrication-system.vercel.app**

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | omar@aisa.cl | admin123 |
| Supervisor | supervisor@aisa.cl | super123 |
| Técnico | juan@lubricacion.cl | tech123 |

---

## 🏭 Características del Sistema

### Gestión de Activos (ISO 14224)
- Jerarquía: Planta → Área → Máquina → Componente → Punto de Lubricación
- Catálogo de lubricantes con especificaciones técnicas (viscosidad, grado NLGI)
- Frecuencias configurables (8hrs, 40hrs, quincenal, mensual, anual)

### Ejecución Operacional
- Órdenes de trabajo generadas automáticamente según frecuencias
- Registro de ejecución con evidencia fotográfica
- Firma digital para cierre de ruta
- Generación de PDF profesional con firma y detalle

### Indicadores (KPIs)
- Cumplimiento del plan de lubricación
- Consumo de lubricantes por tipo y equipo
- Anomalías abiertas/críticas
- Gráfico de cumplimiento semanal

### Control de Calidad
- Reporte de anomalías con severidad (baja/media/alta/crítica)
- Exportación de reportes a PDF
- Historial completo de intervenciones

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React 19 + Next.js 16 (App Router) |
| Lenguaje | TypeScript 5 (strict mode) |
| Estilos | CSS Variables + Design System |
| Validación | Zod |
| PDF | jsPDF + jspdf-autotable |
| Firma Digital | signature_pad |
| Notificaciones | react-hot-toast |
| Deploy | Vercel Edge Network |
| Ready for | Supabase (PostgreSQL + Auth + Storage) |

---

## 📁 Estructura del Proyecto

```
lubrication-system/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Layout principal con fuentes
│   ├── page.tsx            # Dashboard
│   ├── login/              # Autenticación
│   ├── tasks/              # Ejecución de tareas
│   ├── assets/             # Gestión de activos
│   ├── anomalies/          # Reporte de anomalías
│   ├── inventory/          # Inventario de lubricantes
│   ├── schedule/           # Calendario de planificación
│   ├── metrics/            # Indicadores de gestión
│   └── admin/              # Configuración del sistema
├── components/             # Componentes React
│   ├── Sidebar.tsx         # Navegación lateral responsive
│   ├── ProtectedRoute.tsx  # HOC de autenticación + RBAC
│   ├── SignaturePad.tsx    # Firma digital
│   └── PhotoUpload.tsx     # Captura de fotos
├── lib/                    # Lógica de negocio
│   ├── types.ts            # Definiciones TypeScript
│   ├── data.ts             # Capa de datos (localStorage)
│   ├── auth.tsx            # Context de autenticación
│   ├── validations.ts      # Schemas Zod
│   └── pdf.ts              # Generación de PDFs
└── supabase/               # SQL para migración
    └── schema.sql          # 12 tablas con RLS
```

---

## 🚀 Instalación y Desarrollo

```bash
# Clonar repositorio
git clone <repo-url>
cd lubrication-system

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Abrir en navegador
open http://localhost:3000
```

---

## 🔐 Roles y Permisos (RBAC)

| Permiso | Admin | Supervisor | Técnico |
|---------|-------|------------|---------|
| Dashboard | ✅ | ✅ | ✅ |
| Ejecutar Tareas | ✅ | ✅ | ✅ |
| Reportar Anomalías | ✅ | ✅ | ✅ |
| Gestionar Activos | ✅ | ✅ | ❌ |
| Ver Indicadores | ✅ | ✅ | ❌ |
| Planificación | ✅ | ✅ | ❌ |
| Configuración | ✅ | ❌ | ❌ |

---

## 📊 Datos Precargados (AISA)

El sistema incluye datos reales extraídos de:
- `PLAN_DETALLADO_LUBRICACION_AISA.xlsx`
- `PROGRAMA_LUBRICACION_ENERO_2026.xlsx`

### Equipos Incluidos
- 8001 – Descortezador Línea Gruesa
- 8002 – Descortezador Línea Delgada
- Canter 1 y 2 (LINCK HPS-120)
- Perfiladora LINCK
- Sierra Huincha Principal

### Lubricantes
- Grasa I y II (SKF LGMT 2)
- KP2K (Alta Presión)
- Shell Omala S2 G 150
- Shell Tellus S2 M 46
- Aceite 80W-90

---

## 🔧 Migración a Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ejecutar `supabase/schema.sql` en SQL Editor
3. Crear archivo `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
   ```
4. Agregar variables en Vercel → Settings → Environment Variables
5. Redesplegar

---

## 📄 Licencia

Propiedad de AISA. Todos los derechos reservados.

---

**Desarrollado con 🛠️ para la industria forestal chilena**
