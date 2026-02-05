# 📑 Reporte de Análisis UX y Roles: Definición Arquitectónica AISA
**Fecha:** 2026-02-05
**Auditor:** Antigravity AI
**Versión del Proyecto:** Post-Producción (v5.0 Design System)

## 1. 🎯 Objetivos del Análisis
Definir científicamente los requerimientos de interfaz y experiencia de usuario (UX) para los tres perfiles críticos del sistema AISA, basándose en ergonomía industrial y necesidades operativas.
**Objetivo Final:** Diseñar una "App Completa" que responda contextualmente a quien la usa.

## 2. 🧪 Metodología
Análisis de perfiles de usuario (User Personas) en entornos industriales.
- **Variables:** Entorno físico (luz, ruido, uso de guantes), Carga cognitiva, Conectividad, Criticidad de la tarea.

## 3. 👤 Análisis de Roles (User Personas)

### Perfil A: El Lubricador (Operativo)
- **Contexto:** En terreno, manos sucias/enguantadas, mala iluminación, ruido, presión por tiempo.
- **Necesidad Cognitiva:** Baja fricción. "Dime qué hacer, dónde y con qué". No quiere análisis, quiere ejecución.
- **Requerimientos UI:**
    - Botones grandes (Touch Targets > 48px).
    - Alto contraste.
    - Flujos lineales (Paso 1 -> Paso 2).
    - Feedback inmediato (Vibración/Sonido/Color).
    - **Offline First** crítico.

### Perfil B: El Supervisor (Táctico/Estratégico)
- **Contexto:** Oficina (Desktop/Tablet) o Terreno (Tablet).
- **Necesidad Cognitiva:** Control y Estado. "¿Vamos bien o mal?". Gestión de excepciones.
- **Requerimientos UI:**
    - Dashboards densos en información (Data Density).
    - Indicadores de cumplimiento (KPIs).
    - Listas filtrables y buscables.
    - Acciones de aprobación/rechazo.

### Perfil C: Contratista Externo (Operativo Restringido)
- **Contexto:** Temporal, no familiarizado con toda la planta.
- **Necesidad Cognitiva:** Claridad de alcance. "¿Qué me toca a mí?". Evitar errores en equipos ajenos.
- **Requerimientos UI:**
    - Vista restringida (Solo sus OT).
    - Instrucciones más detalladas (Onboarding contextual).
    - Validación de ubicación (GPS/QR) para asegurar que está donde dice estar.

## 4. 🧠 Discusión y Propuesta de Diseño

La interfaz actual es "One Size Fits All" (Talla única), lo cual es ineficiente según la Ley de Hick (más opciones = más tiempo de decisión).

**Propuesta: Dashboard Polimórfico**
El Dashboard (`app/page.tsx`) debe renderizar componentes totalmente distintos según el rol detectado en `lib/auth.tsx`.

| Zona UI | Lubricador | Supervisor | Contratista |
|---------|------------|------------|-------------|
| **Hero** | Próxima Tarea (Gigante) | KPIs Globales | Resumen de OT Asignada |
| **Lista**| Tareas del turno (Cards) | Monitor de Equipo (Tabla) | Tareas Específicas |
| **Nav** | Escaneo QR, Mi Ruta | Reportes, Usuarios, Config | Mis Tareas, Perfil |

## 5. ✅ Plan de Acción Académico

1.  **Refactorizar `Dashboard`**: Implementar `Strategy Pattern` en `page.tsx` para cargar `LubricatorDashboard`, `SupervisorDashboard` o `ContractorDashboard`.
2.  **Diseño "Premium" Contextual**:
    - **Lubricador:** Apple Fitness style (Anillos de progreso, negro puro, colores neón para estado).
    - **Supervisor:** Apple Stocks/Analytics style (Gráficos finos, grids de datos, glassmorphism sutil).
3.  **Bypass de Login**: Ya implementado para facilitar estas pruebas.
