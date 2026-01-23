# Changelog - Sistema de Lubricación AISA

Todas las versiones notables del proyecto están documentadas aquí.

---

## [1.0.0] - 2026-01-23

### 🎉 Release de Producción

**Primera versión estable lista para uso en producción.**

### Funcionalidades Principales

#### Gestión de Activos
- ✅ Jerarquía completa: Planta → Centro de Gestión → Equipo → Componente → Punto de Lubricación
- ✅ 64 puntos de lubricación auditados y validados
- ✅ 8 equipos configurados según documentación oficial AISA
- ✅ 63 componentes mapeados
- ✅ 7 lubricantes con especificaciones técnicas

#### Ejecución Operacional
- ✅ Generación automática de órdenes de trabajo
- ✅ 8 frecuencias configuradas (diario, semanal, quincenal, mensual, trimestral, semestral, anual)
- ✅ Captura y previsualización de fotografías
- ✅ Firma digital para cierre de rutas
- ✅ Generación de PDF con evidencia

#### Sistema de Usuarios
- ✅ 3 roles implementados (Admin, Supervisor, Técnico)
- ✅ Control de acceso por rol (RBAC)
- ✅ Autenticación segura

#### Reportes y Métricas
- ✅ Dashboard con KPIs en tiempo real
- ✅ Gráfico de cumplimiento semanal
- ✅ Control de anomalías por severidad
- ✅ Exportación de reportes PDF

#### Infraestructura
- ✅ Desplegado en Vercel
- ✅ Repositorio en GitHub
- ✅ Base de datos Supabase configurada
- ✅ Almacenamiento de imágenes en Supabase Storage

### Datos Auditados

Fuentes oficiales procesadas:
- `PLAN_DETALLADO_LUBRICACION_AISA.xlsx`
- `PROGRAMA_LUBRICACION_ENERO_2026.xlsx`
- `REGISTRO_CONSUMO_LUBRICANTES.xlsx`
- `MANUAL_TECNICO_LUBRICACION_INDUSTRIAL_AISA_2026.pdf`
- `MANUAL_EXPRESS_LUBRICACION_AISA_2026.pdf`

### Distribución de Tareas

| Frecuencia | Cantidad |
|------------|----------|
| Diarias (8 hrs) | 19 |
| Día por Medio | 1 |
| Semanales (40 hrs) | 9 |
| Quincenales (160 hrs) | 8 |
| Mensuales | 14 |
| Trimestrales | 6 |
| Semestrales | 5 |
| Anuales | 2 |
| **TOTAL** | **64** |

---

## [0.9.0] - 2026-01-22

### Prerelease

- Integración inicial con Supabase
- Corrección de datos de lubricación
- Mejoras de UI/UX

---

## [0.1.0] - 2026-01-20

### Versión Inicial

- Estructura base del proyecto
- Componentes UI
- Sistema de autenticación local
- Generación de PDF

---

**Desarrollado para Aserradero Industrial AISA**
