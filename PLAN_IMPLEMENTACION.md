# Plan de Implementación - AISA Lubricación a Producción

Este plan está diseñado para ejecutarse secuencialmente y asegurar un despliegue exitoso sin errores.

---

## Fase 1: Calidad de Código (ESLint & Clean Code) [EN PROGRESO]

- [x] **1.1 Corregir `tasks/page.tsx`**: Mover `loadData` y limpiar imports.
- [x] **1.2 Corregir `Sidebar.tsx`**: Manejo de estado en `useEffect`.
- [x] **1.3 Corregir `auth.tsx`**: Manejo de estado inicial.
- [x] **1.4 Corregir `ProtectedRoute.tsx`**: Eliminar variables no usadas.
- [x] **1.5 Corregir `pdf.ts`**: Tipado estricto (eliminar `any`).
- [ ] **1.6 Configurar Ignorados**: Excluir carpeta `scripts/` del linter en `eslint.config.mjs`.
- [ ] **1.7 Verificación Final**: Ejecutar `npm run lint` y asegurar 0 errores.

---

## Fase 2: Control de Versiones (GitHub) [PENDIENTE]

- [ ] **2.1 Inicializar Repo**:
  ```bash
  git add .
  git commit -m "fix: correcciones pre-producción y estabilización"
  ```
- [ ] **2.2 Crear Repo Remoto**: Crear repositorio privado `isa-lubrication-system`.
- [ ] **2.3 Push Inicial**:
  ```bash
  git remote add origin <URL_DEL_REPO>
  git push -u origin main
  ```

---

## Fase 3: Infraestructura de Datos (Supabase) [PENDIENTE]

- [ ] **3.1 Proyecto Supabase**: Crear proyecto nuevo.
- [ ] **3.2 Variables de Entorno**: Crear `.env.local` con:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] **3.3 Desplegar Schema**: Ejecutar el contenido de `supabase/schema.sql` en el SQL Editor de Supabase.
- [ ] **3.4 Migración de Datos**: Ejecutar script para poblar la DB con los datos de `data.ts` (localStorage).

---

## Fase 4: Despliegue (Vercel) [PENDIENTE]

- [ ] **4.1 Configuración**: Conectar repo de GitHub a Vercel.
- [ ] **4.2 Variables**: Configurar variables de entorno de Supabase en Vercel.
- [ ] **4.3 Deploy**: Realizar despliegue a producción.
- [ ] **4.4 Smoke Test**: Verificar login, dashboard y carga de datos.

---

## Instrucciones para Windsurf

Para continuar, ejecutar el siguiente comando para terminar la Fase 1:

1. Abrir `eslint.config.mjs`.
2. Agregar `scripts/` a la lista de ignorados.
3. Correr `npm run lint` para confirmar que todo está limpio.
4. Proceder a la Fase 2 (Git).
