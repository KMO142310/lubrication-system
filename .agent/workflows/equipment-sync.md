---
description: Sincroniza datos de equipos extraídos con la base de datos Supabase y la aplicación.
---

# Equipment Sync Workflow

Sincroniza los datos de `lib/equipment-data.ts` con Supabase y los componentes de la aplicación.

## Trigger
- Después de ejecutar `/equipment-extraction`
- Cuando se actualiza `lib/equipment-data.ts`
- Solicitud manual: `/equipment-sync`

## Pasos

### 1. Validar Datos Locales

// turbo
```bash
# Verificar que el archivo existe y es válido
npx ts-node -e "import { EQUIPMENT_STATS } from './lib/equipment-data'; console.log(EQUIPMENT_STATS);"
```

**Validaciones:**
- [ ] Archivo existe
- [ ] Tipos correctos
- [ ] No hay duplicados de código
- [ ] Centros de costo válidos

---

### 2. Generar SQL de Seeds

Crear archivo SQL para Supabase:

```sql
-- supabase/seeds/equipment-foresa.sql
INSERT INTO equipment (code, name, cost_center, tenant_id) VALUES
('3000', 'DESCORTEZADOR L.G.', '8001', 'foresa-uuid'),
('3002', 'CENTRAL HIDRÁULICA D.L.G.', '8001', 'foresa-uuid'),
-- ... más equipos
ON CONFLICT (code, tenant_id) DO UPDATE SET name = EXCLUDED.name;
```

---

### 3. Generar SQL de Puntos de Lubricación

```sql
-- supabase/seeds/lubrication-points-foresa.sql
INSERT INTO lubrication_points (position, interval, description, point_count, lubricant_type) VALUES
('80', 'semanal', 'Rodamiento', 2, 'Grupo 5'),
('85', 'semanal', 'Rodillos de puas', 2, 'Grupo 5'),
-- ... más puntos
ON CONFLICT (position, description) DO NOTHING;
```

---

### 4. Aplicar a Supabase

```bash
# Si hay conexión a Supabase
supabase db push

# O aplicar manualmente
psql $DATABASE_URL -f supabase/seeds/equipment-foresa.sql
```

---

### 5. Actualizar Componentes de App

Verificar que los siguientes archivos usen los datos:

#### `app/assets/page.tsx`
```typescript
import { FORESA_EQUIPMENT_DATA, getAllEquipment } from '@/lib/equipment-data';

// Usar en el componente
const equipment = getAllEquipment();
```

#### `app/tasks/page.tsx`
```typescript
import { LUBRICATION_POINTS } from '@/lib/equipment-data';

// Mostrar puntos en tareas
const points = LUBRICATION_POINTS.filter(p => p.position === taskPosition);
```

---

### 6. Verificar Integración

// turbo
```bash
npm run build
npm run dev &
sleep 5
curl -s http://localhost:3000/api/health | jq .
```

---

### 7. Documentar Cambios

Actualizar CHANGELOG:
```markdown
## [Fecha]
### Datos
- Agregados X equipos para área YYYY
- Agregados X puntos de lubricación
```

---

## Métricas de Sincronización

Después de cada sync, registrar:
```json
{
  "timestamp": "2026-01-25T16:42:00Z",
  "equipmentCount": 87,
  "lubricationPointsCount": 45,
  "costCenters": ["8000", "8001", "8002", "8003", "8004"],
  "status": "synced"
}
```
