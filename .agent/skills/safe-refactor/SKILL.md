---
description: Protocolo de seguridad y checklist obligatorio para realizar refactorizaciones o ediciones de código sin introducir regresiones.
---

# Safe Refactor Protocol

Esta skill define el procedimiento estándar para modificar código existente. Úsala SIEMPRE que edites archivos, especialmente dependencias compartidas.

## The Checklist

Antes de confirmar cualquier edición (`replace_file_content` o `write_to_file`), verifica mentalmente:

### 1. Pre-Check (Impact Analysis)
- **¿Quién usa esto?**: Si modificas una función exportada o componente, busca todos sus usos.
  - *Herramienta*: `grep_search`.
- **¿Es un breaking change?**: Si cambias la firma (argumentos, props), debes actualizar TODOS los lugares de uso.

### 2. Dependency Check
- **Imports**: Si eliminas código, elimina sus imports no usados arriba.
- **Exports**: Si eliminas un archivo, revisa `index.ts` (barrell files) para no dejar exports rotos.

### 3. Cleanup (Limpieza Inmediata)
- No dejes código comentado ("por si acaso"). Si se va, se va. Git guarda la historia.
- No dejes variables declaradas pero no usadas (el linter fallará).

### 4. Post-Check (Verification)
- **Lint**: Ejecuta `npm run lint` (si existe) en el archivo modificado.
- **Type Check**: TypeScript debe compilar.

## Procedimiento ante Errores

Si después de editar encuentras errores:
1. **No entres en pánico**.
2. **Lee el error**: ¿Es de sintaxis o de tipos?
3. **Revertir es una opción**: Si el cambio es muy complejo y rompió mucho, mejor volver al estado anterior y repensar.

## Comandos Útiles

```bash
# Buscar usos de un símbolo
grep -r "NombreFuncion" .

# Verificar tipos (si tsc está disponible)
npx tsc --noEmit
```
