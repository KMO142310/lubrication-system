---
description: Skill para extraer códigos de equipos y puntos de lubricación desde imágenes de tablas industriales.
---

# Equipment Extraction Skill

Extrae datos estructurados de equipos desde fotografías de tablas de codificación industrial.

## Capacidades

### Tipos de Documentos Soportados
1. **Tablas de Codificación** - Listas de equipos con códigos
2. **Planillas de Lubricación** - Puntos, frecuencias, lubricantes
3. **Layouts Anotados** - Planos con referencias numéricas

### Formatos de Salida
- TypeScript (`equipment-data.ts`)
- JSON (`equipment.json`)
- SQL (`seed-equipment.sql`)

---

## Proceso de Extracción

### Paso 1: Preparación de Imagen
```typescript
// Asegurar buena resolución y contraste
// Recortar a área de tabla
// Enderezar si está inclinada
```

### Paso 2: OCR y Estructuración
```typescript
interface ExtractedEquipment {
  code: string;           // Ej: "3000"
  name: string;           // Ej: "DESCORTEZADOR L.G."
  costCenter: string;     // Ej: "8001"
  equipmentCode?: string; // Ej: "EQ.3000"
}
```

### Paso 3: Validación
- Verificar códigos únicos
- Validar centros de costo conocidos
- Detectar duplicados

### Paso 4: Generación
```typescript
// Crear archivo TypeScript tipado
export const EQUIPMENT_DATA: Equipment[] = [
  { code: '3000', name: 'DESCORTEZADOR L.G.', costCenter: '8001' },
  // ...
];
```

---

## Uso

```bash
# Procesar imagen
/equipment-extraction --input /path/to/table.jpg

# Con validación estricta
/equipment-extraction --input /path/to/table.jpg --strict

# Generar SQL
/equipment-extraction --input /path/to/table.jpg --format sql
```

---

## Integración con App

Los datos extraídos se integran automáticamente con:
- `lib/equipment-data.ts` - Datos principales
- `supabase/data_aisa.sql` - Seeds para base de datos
- `app/assets/page.tsx` - Vista de activos
