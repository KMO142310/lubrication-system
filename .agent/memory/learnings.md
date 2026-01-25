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


### State Management
- **Circular Dependencies**: Evitar importar stores (ej. `sync.ts`) dentro de componentes que son importados por el store. Usar inyección de dependencias o separar la lógica de estado en archivos aislados (`store.ts`).

### Tooling
- **Hidden Files**: La herramienta `find_by_name` falla con archivos ocultos si no se configura explícitamente. Usar `ls -la` o rutas directas si se sospecha de archivos dot (`.env`, `.vercel`).

## 📊 Métricas de Asertividad
- **Ciclo 1 (Deployment)**: 80% (Fallos iniciales en tests de Auth, corregidos rápidamente).
- **Meta**: Mantener >90% en próximas iteraciones.
