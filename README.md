# Sistema de Gestión de Lubricación Industrial - AISA

[![Version](https://img.shields.io/badge/Version-1.0.0-green)]()
[![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-green?logo=supabase)](https://supabase.com/)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)]()

Sistema profesional de gestión para el control, planificación y trazabilidad de las actividades de lubricación industrial en el Aserradero AISA.

> **Estado:** ✅ Producción | **64 tareas auditadas** | **Listo para ejecutar**

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

## 🚀 Despliegue Automatizado (CI/CD)
Este proyecto incluye pipelines de GitHub Actions (`.github/workflows`) para auditoría automática.

### Vercel (Cloud Demo)
Optimizado para Vercel Serverless.
**Nota**: SQLite es efímero en Vercel. Cada deploy reiniciará la DB. Para producción, usar Turso/Neon.

### Docker (Producción)
La forma recomendada de desplegar con **persistencia real**:
```bash
./deploy.sh
```
Esto levantará el contenedor con `aisa.db` persistente.

## 🛠 Instalación y Desarrollo
```bash
npm install
npm run dev

## 🛠 Mantenimiento de Datos (Contingencia)
Si la base de datos se corrompe o se necesita reiniciar el entorno de pruebas, use el script maestro de recuperación:

```bash
npx tsx scripts/reseed-full.ts
```

Esto ejecutará:
1. Limpieza total de tablas
2. Regeneración de catálogos (Lubricantes, Frecuencias)
3. Carga de equipos críticos (Línea Gruesa 8006, HMK20, etc.)
4. Generación de órdenes de trabajo para el día actual

**Nota Importante**: El sistema utiliza **SQLite (`aisa.db`)** como base de datos principal para las tareas operativas, asegurando funcionamiento offline/local robusto. La integración con Supabase se reserva para Auth y Storage (fotos).
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

## 📊 Datos Auditados (64 Tareas)

Datos 100% validados desde documentación oficial AISA:
- `PLAN_DETALLADO_LUBRICACION_AISA.xlsx`
- `PROGRAMA_LUBRICACION_ENERO_2026.xlsx`
- `REGISTRO_CONSUMO_LUBRICANTES.xlsx`
- `MANUAL_TECNICO_LUBRICACION_INDUSTRIAL_AISA_2026.pdf`

### Inventario Completo

| Categoría | Cantidad |
|-----------|----------|
| Centros de Gestión | 3 (CG 611, 612, 613) |
| Equipos | 8 |
| Componentes | 63 |
| Puntos de Lubricación | **64** |
| Lubricantes | 7 |
| Frecuencias | 8 |

### Distribución de Tareas

| Frecuencia | Tareas |
|------------|--------|
| Diarias (8 hrs) | 19 |
| Semanales (40 hrs) | 9 |
| Quincenales (160 hrs) | 8 |
| Mensuales | 14 |
| Trimestrales | 6 |
| Semestrales | 5 |
| Anuales | 2 |

### Equipos Configurados
- **CG 611**: 8001 Descortezador LG, 8002 Descortezador LD
- **CG 612**: 8006 Línea Gruesa, 8007 Línea Delgada, Canter 1/2, Perfiladora LINCK, WD

### Lubricantes
- Grasa I y II (NLGI 2)
- KP2K (Alta Presión Extrema)
- ISOFLEX NBU 15
- Aceite 150 (ISO VG 150)
- Aceite 80W-90
- Aceite Hidráulico (ISO VG 46)
- Aceite para Cadenas (ISO VG 68)

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
