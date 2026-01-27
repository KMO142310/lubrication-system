# System Learnings & Patterns

Este archivo almacena el conocimiento acumulado del agente para mejorar su asertividad futura.

## 🟢 Best Practices (Patrones de Éxito)

### Industrial Design
- **Estética**: Uso de paleta de colores de alto contraste (Navy/Red) y bordes gruesos ("Rugged").
- **UI Components**: Las tarjetas ("Job Cards") deben tener indicadores de estado visuales claros (bordes de color) para escaneabilidad rápida.

### Testing & Verification
- **Supabase Mocks**: NUNCA importar `supabase-js` real en tests unitarios (`jest`). Siempre usar `jest.mock` con una implementación completa (select, insert, eq, single) para evitar errores de conexión.
- **Auth Testing**: Al testear autenticación, alinear siempre las credenciales del mock con la lógica de fallback en `lib/auth.tsx`.

### Auth Testing
- **Hooks Mocking**: For testing components using custom hooks like `useAuth`, utilize `jest.mock` to return specific function mocks (`mockLogin`, `mockLoginWithGoogle`) to inspect calls, rather than mocking the context provider directly which is more verbose.
- **Provider Methods**: When extending authentication (e.g., Google OAuth), ensure the Provider explicitly exposes these new methods in its value prop, otherwise consumers (like `LoginContainer`) will fail at runtime or build time.


### React Component Reusability
- **SVG Icons**: When multiple SVG icons share the same structure (e.g., wrapper attributes), create a BaseIcon component to reduce code size and maintenance effort.
- **UI Cards**: Identify repetitive UI blocks (like stat summaries) and extract them into reusable components (`CalendarSummaryCard`) early to avoid code bloat.

### State Management
- **Circular Dependencies**: Evitar importar stores (ej. `sync.ts`) dentro de componentes que son importados por el store. Usar inyección de dependencias o separar la lógica de estado en archivos aislados (`store.ts`).

### Tooling
- **Hidden Files**: La herramienta `find_by_name` falla con archivos ocultos si no se configura explícitamente. Usar `ls -la` o rutas directas si se sospecha de archivos dot (`.env`, `.vercel`).

## 📊 Métricas de Asertividad
- **Ciclo 1 (Deployment)**: 80% (Fallos iniciales en tests de Auth, corregidos rápidamente).
- **Ciclo 2 (Schedule Gen)**: 95% (Éxito completo en generación de programación Feb 2026).
- **Meta**: Mantener >90% en próximas iteraciones.

---

## 🔴 Anti-Patterns (Errores a Evitar)

### [2026-01-25] Agent Termination Errors
**Síntoma**: "Agent terminated due to error" aparece intermitentemente.
**Causas identificadas**:
1. **Unicode en LaTeX**: Usar emojis o símbolos Unicode (⚠, ✅) en archivos `.tex` causa errores de compilación que pueden romper el flujo.
2. **Comandos muy largos**: Comandos que generan output extenso (>10000 caracteres) pueden causar timeouts.
3. **Parallel tool calls excesivos**: Más de 5 tool calls paralelas pueden saturar el contexto.

**Soluciones aplicadas**:
- Reemplazar Unicode por texto ASCII en archivos LaTeX (`⚠` → `ATENCION:`)
- Usar `| tail -N` o `| head -N` para limitar output de comandos
- Secuenciar tool calls cuando hay dependencias de datos
- Mantener `WaitMsBeforeAsync` bajo pero suficiente (3000-5000ms para scripts cortos)

### [2026-01-25] LaTeX Compilation
**Problema**: Caracteres Unicode no soportados en LaTeX básico.
**Regla**: En archivos `.tex`, usar SOLO ASCII o paquetes como `inputenc` con `utf8` + fuentes apropiadas.

### [2026-01-25] Long-Running Tasks
**Problema**: Tasks muy largas sin checkpoints pueden perderse.
**Regla**: 
- Dividir scripts en fases que generen archivos intermedios
- Guardar progreso a disco frecuentemente
- Usar `task_boundary` para actualizar estado regularmente

---

## 🧠 Conocimiento de Dominio (AISA)

### Turnos de Trabajo
- **Turno A**: Lunes a Viernes (libra Sáb/Dom/Lun)
- **Turno B**: Martes a Sábado (libra Dom)
- **Rotación**: Semanal alternada (Semana 1=A, Semana 2=B, ...)

### Frecuencias de Lubricación
- **Diarias**: 20 tareas base
- **Día por medio**: VQT, Bijur
- **Semanales**: Perfiladora (Mié), FR-10 (Jue)
- **Quincenales Sábado**: Lavado de rotores (solo Turno B)
- **Mensuales**: Primera semana del mes

### Grasa Especial
- **ISOFLEX NBU 15**: EXCLUSIVA para árbol de sierra
- **KP2K**: Perfiladora LINCK y puntos WD

