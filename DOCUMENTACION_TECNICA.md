# AISA Sistema de Lubricación - Documentación Técnica

## Índice
1. [Arquitectura del Sistema](#arquitectura)
2. [Estructura de Archivos](#estructura)
3. [Sistema de Diseño](#diseno)
4. [Guía de Mantenimiento](#mantenimiento)
5. [Base de Datos](#database)
6. [Autenticación](#auth)
7. [Despliegue](#deploy)

---

## 1. Arquitectura del Sistema <a name="arquitectura"></a>

### Stack Tecnológico
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 16.1.4 | Framework React con App Router |
| React | 19.2 | UI Library |
| TypeScript | 5.x | Tipado estático |
| Tailwind CSS | 4.x | Utilidades CSS |
| Supabase | - | Base de datos + Auth |
| Vercel | - | Hosting y deployment |

### Patrón de Datos
El sistema usa un **patrón híbrido**:
- **Supabase**: Base de datos principal (si está configurado)
- **localStorage**: Fallback cuando no hay conexión

```
┌─────────────────┐
│   Componentes   │
│   (React)       │
└────────┬────────┘
         │
┌────────▼────────┐
│   dataService   │  ← lib/data.ts
│   (Abstracción) │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌───▼───┐
│Supabase│ │localStorage│
└───────┘ └───────────┘
```

---

## 2. Estructura de Archivos <a name="estructura"></a>

```
lubrication-system/
├── app/                      # Páginas (Next.js App Router)
│   ├── page.tsx              # Dashboard principal
│   ├── login/page.tsx        # Autenticación
│   ├── tasks/page.tsx        # Tareas diarias
│   ├── schedule/page.tsx     # Calendario/Planificación
│   ├── anomalies/page.tsx    # Gestión de anomalías
│   ├── inventory/page.tsx    # Inventario lubricantes
│   ├── assets/page.tsx       # Activos (equipos)
│   ├── metrics/page.tsx      # KPIs y métricas
│   ├── users/page.tsx        # Gestión usuarios
│   ├── admin/page.tsx        # Panel administración
│   ├── contractors/page.tsx  # Contratistas
│   ├── globals.css           # ⭐ ESTILOS GLOBALES
│   └── layout.tsx            # Layout principal
│
├── components/               # Componentes reutilizables
│   ├── Sidebar.tsx           # Navegación lateral
│   ├── ProtectedRoute.tsx    # HOC de autenticación
│   ├── PhotoUpload.tsx       # Captura de fotos
│   ├── SignaturePad.tsx      # Firma digital
│   └── DailyReport.tsx       # Informe diario
│
├── lib/                      # Lógica de negocio
│   ├── data.ts               # ⭐ Servicio de datos principal
│   ├── datos_completos_aisa.ts # Datos del programa AISA
│   ├── auth.tsx              # Contexto de autenticación
│   ├── supabase.ts           # Cliente Supabase
│   ├── supabase-service.ts   # Servicio Supabase
│   ├── types.ts              # Definiciones TypeScript
│   └── pdf.ts                # Generación de PDFs
│
├── supabase/                 # Scripts SQL
│   ├── setup.sql             # Esquema de tablas
│   └── data_aisa.sql         # Datos iniciales
│
└── public/                   # Archivos estáticos
```

---

## 3. Sistema de Diseño <a name="diseno"></a>

### Archivo Principal: `app/globals.css`

#### Tokens de Color (Variables CSS)
```css
/* Para cambiar colores, modifica estas variables en :root */

/* Colores Primarios (Azul Industrial) */
--primary-500: #274566;
--primary-600: #1e3654;

/* Colores de Estado */
--success-500: #22c55e;  /* Verde - Completado/OK */
--warning-500: #f59e0b;  /* Ámbar - Pendiente/Alerta */
--accent-500: #dc2626;   /* Rojo - Error/Crítico */

/* Colores de Frecuencia */
--freq-daily: #22c55e;      /* Diario */
--freq-weekly: #3b82f6;     /* Semanal */
--freq-monthly: #f59e0b;    /* Mensual */
```

#### Clases CSS Reutilizables

**KPI Cards (Tarjetas de indicadores):**
```html
<div class="kpi-card">
  <div class="kpi-card-bar success"></div>
  <div class="kpi-card-header">
    <div class="kpi-card-icon success">...</div>
    <span class="kpi-card-badge success">OK</span>
  </div>
  <div class="kpi-card-value">85<span>%</span></div>
  <div class="kpi-card-label">Cumplimiento</div>
</div>
```

**Variantes de color:** `success`, `warning`, `danger`, `info`, `purple`

**Calendario:**
```html
<div class="calendar-container">
  <div class="calendar-grid">
    <div class="calendar-day-header">Lun</div>
    <div class="calendar-day today has-tasks">
      <span class="calendar-day-number">23</span>
      <div class="calendar-day-tasks">
        <span class="calendar-task-dot completed"></span>
      </div>
    </div>
  </div>
</div>
```

**Dashboard Tasks:**
```html
<div class="dashboard-task-row">
  <code class="dashboard-task-code">9.1.1-A</code>
  <div class="dashboard-task-info">
    <h4>Componente</h4>
    <p>Máquina • Lubricante</p>
  </div>
  <span class="dashboard-task-status completed">✓ Completado</span>
</div>
```

---

## 4. Guía de Mantenimiento <a name="mantenimiento"></a>

### Cambiar un Color Global
1. Abrir `app/globals.css`
2. Buscar la sección `:root` (líneas 1-100)
3. Modificar la variable CSS correspondiente
4. Todos los componentes se actualizarán automáticamente

**Ejemplo:** Cambiar el color de éxito de verde a azul:
```css
/* Antes */
--success-500: #22c55e;

/* Después */
--success-500: #3b82f6;
```

### Agregar una Nueva Página
1. Crear carpeta en `app/nueva-pagina/`
2. Crear `page.tsx` dentro
3. Usar el template:
```tsx
'use client';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function NuevaPagina() {
  return (
    <ProtectedRoute>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <div className="page-container">
            {/* Contenido */}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
```

### Agregar un Nuevo Punto de Lubricación
1. Abrir `lib/datos_completos_aisa.ts`
2. Agregar al array `PUNTOS_LUBRICACION`:
```typescript
{
  id: 'nuevo-id-unico',
  code: '9.X.X-Y',
  componentId: 'id-componente',
  lubricantId: 'id-lubricante',
  frequencyId: 'id-frecuencia',
  quantity: 100,
  description: 'Descripción del punto',
  method: 'manual',
  createdAt: new Date().toISOString(),
}
```

### Limpiar Datos de localStorage
Para resetear los datos locales:
1. Abrir DevTools (F12)
2. Console → escribir: `localStorage.clear()`
3. Recargar página

---

## 5. Base de Datos <a name="database"></a>

### Esquema Supabase

**Tablas principales:**
| Tabla | Descripción |
|-------|-------------|
| `profiles` | Usuarios del sistema |
| `plants` | Plantas industriales |
| `areas` | Áreas dentro de plantas |
| `machines` | Equipos/Máquinas |
| `components` | Componentes de máquinas |
| `lubricants` | Tipos de lubricantes |
| `frequencies` | Frecuencias de lubricación |
| `lubrication_points` | Puntos de lubricación |
| `tasks` | Tareas diarias |
| `anomalies` | Anomalías reportadas |

### Ejecutar SQL en Supabase
1. Ir a https://supabase.com/dashboard
2. Seleccionar proyecto
3. SQL Editor → New Query
4. Pegar SQL desde `supabase/setup.sql`
5. Ejecutar

---

## 6. Autenticación <a name="auth"></a>

### Flujo de Autenticación
```
Usuario → Login → Supabase Auth → Profile → Rol
                        ↓
                   (Fallback)
                        ↓
                  localStorage
```

### Usuarios de Prueba (Fallback)
| Email | Contraseña | Rol |
|-------|------------|-----|
| omar@aisa.cl | admin123 | admin |
| supervisor@aisa.cl | super123 | supervisor |
| tecnico@aisa.cl | tech123 | tecnico |

### Roles y Permisos
- **admin**: Acceso total
- **supervisor**: Ver todo, gestionar tareas
- **tecnico**: Solo ejecutar tareas asignadas

---

## 7. Despliegue <a name="deploy"></a>

### Variables de Entorno (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

### Comandos de Deploy
```bash
# Build local
npm run build

# Deploy a Vercel
vercel --prod

# Ver logs
vercel logs
```

### URLs
- **Producción**: https://lubrication-system.vercel.app
- **Supabase**: https://supabase.com/dashboard/project/muskqziwfwrgholoogbg

---

## Contacto y Soporte

**Desarrollado para:** AISA Aserraderos
**Fecha:** Enero 2026
**Stack:** Next.js + Supabase + Vercel
