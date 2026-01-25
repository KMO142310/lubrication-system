---
description: Skill para generar y mantener tests unitarios automáticamente.
---

# Test Generation Skill (test-gen)

Esta skill permite al agente generar, ejecutar y corregir tests unitarios para componentes React y lógica de negocio.

## Capacidades
1.  **Generate**: Crear un archivo `.test.tsx` o `.test.ts` para un archivo fuente dado.
2.  **Fix**: Analizar un test fallido y proponer correcciones.
3.  **Run**: Ejecutar el test suite específico para un archivo.

## Instrucciones de Uso

### 1. Generar nuevo test

Para generar un test para `components/MiComponente.tsx`:

1.  Analizar el componente fuente (`view_file`).
2.  Crear archivo `__tests__/MiComponente.test.tsx`.
3.  Usar patrón estándar:
    ```typescript
    import { render, screen } from '@testing-library/react';
    import MiComponente from '@/components/MiComponente';
    
    describe('MiComponente', () => {
      it('renders correctly', () => {
        render(<MiComponente />);
        expect(screen.getByText('Texto esperado')).toBeInTheDocument();
      });
    });
    ```

### 2. Ejecutar tests

Usar el script auxiliar:
```bash
./.agent/skills/test-gen/scripts/run-test.sh <path-to-test-file>
```

### 3. Estrategia de Testing (AISA Standards)
- **Componentes UI**: Verificar renderizado, props y eventos básicos.
- **Lógica (lib/)**: Verificar casos de éxito, borde y error.
- **Mocks**: Mockear `useAuth`, `useRouter`, y llamadas a `localStorage`.
