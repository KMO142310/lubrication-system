---
description: Flujo para rediseñar la UI actual hacia estándares industriales usando la skill industrial-ux-design.
---

# Industrial UI Redesign Workflow

Este workflow transforma componentes React estándar en interfaces industriales robustas.

## Pasos

1.  **Auditoría UX**:
    -   Lee `SKILL.md` de `industrial-ux-design`.
    -   Analiza las páginas clave (`/tasks`, `/login`).
    -   Identifica violaciones a la "Regla del Dedo Gordo" y contrastes bajos.

2.  **Generación de Componentes Base**:
    -   Crea/Actualiza `components/ui/IndustrialButton.tsx`.
    -   Crea/Actualiza `components/ui/IndustrialCard.tsx`.
    -   Implementa variables CSS para colores de seguridad (Safety Colors).

3.  **Refactorización de Páginas**:
    -   Itera por cada página crítica.
    -   Reemplaza botones estándar por `IndustrialButton`.
    -   Ajusta layouts para operación a una mano.

4.  **Verificación**:
    -   Comprueba contraste y tamaños de toque.
