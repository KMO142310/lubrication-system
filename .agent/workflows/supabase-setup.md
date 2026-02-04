---
description: Guía paso a paso para configurar Supabase con datos reales
---

# /supabase-setup - Configuración de Supabase

Este workflow te guía para poblar Supabase con el schema y datos de AISA.

## Prerrequisitos
- Cuenta en [supabase.com](https://supabase.com)
- Proyecto creado en Supabase
- Credenciales en `.env.local`

## Pasos

### 1. Acceder al Dashboard de Supabase
1. Ve a [supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto (muskqziwfwrgholoogbg)

### 2. Abrir SQL Editor
1. En el menú lateral izquierdo, click en **"SQL Editor"**
2. Click en el botón **"New Query"** (arriba a la derecha)

### 3. Ejecutar el Schema
1. Abre el archivo local: `supabase/schema.sql`
2. **Selecciona TODO** el contenido (Cmd+A o Ctrl+A)
3. **Copia** (Cmd+C o Ctrl+C)
4. **Pega** en el SQL Editor de Supabase
5. Click en el botón verde **"Run"** (o Cmd+Enter)
6. Espera ~10 segundos a que termine

> [!TIP]
> Si hay errores, probablemente las tablas ya existen. Puedes ignorar errores de "already exists".

### 4. Ejecutar los Datos
1. Click en **"New Query"** otra vez
2. Abre el archivo: `supabase/data_aisa_complete.sql`
3. Copia y pega en el SQL Editor
4. Click en **"Run"**

### 5. Verificar Tablas
1. En el menú lateral, click en **"Table Editor"**
2. Deberías ver las tablas:
   - `plants` (1 fila)
   - `areas` (5+ filas)
   - `machines` (9+ filas)
   - `lubricants` (14 filas)
   - `lubrication_points` (63+ filas)

### 6. Crear Usuarios de Prueba
1. Ve a **"Authentication"** → **"Users"**
2. Click **"Add User"** → **"Create User"**
3. Crea estos usuarios:

| Email | Password | Rol |
|-------|----------|-----|
| dev@aisa.cl | dev2026! | Desarrollador |
| supervisor@aisa.cl | super123 | Supervisor |
| omar@aisa.cl | omar123 | Lubricador |

### 7. Obtener Service Role Key (Opcional pero recomendado)
1. Ve a **"Settings"** (engranaje abajo a la izquierda)
2. Click en **"API"**
3. Busca **"Project API keys"**
4. Copia la key **"service_role"** (la secreta, que dice "This key has the ability to bypass Row Level Security")
5. Agrégala a tu `.env.local`:
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

### 8. Verificar Conexión
```bash
npm run db:check
```

Deberías ver las tablas y columnas disponibles.

### 9. (Opcional) Seed Automático
Si tienes la Service Role Key configurada:
```bash
npm run db:seed
```

## Troubleshooting

### "Could not find column X in schema cache"
- El schema no fue ejecutado correctamente
- Vuelve a ejecutar `schema.sql`

### "new row violates row-level security policy"
- Necesitas la Service Role Key
- O desactiva RLS temporalmente en las tablas

### Conexión rechazada
- Verifica que `NEXT_PUBLIC_SUPABASE_URL` esté correcto en `.env.local`
- Verifica que el proyecto de Supabase esté activo

## Resultado Esperado
- Todas las tablas creadas con datos
- Usuarios de prueba disponibles
- App conectada a datos reales en lugar de mock
