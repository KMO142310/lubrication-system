---
name: academic-documentation
description: Skill para generar documentación técnica y académica rigurosa (Doctoral Level) sobre auditorías, aprendizajes y memoria del proyecto.
version: 1.0.0
author: Antigravity
---

# 🎓 Academic Documentation Skill

Esta skill establece un estándar de rigor académico doctoral para la documentación del proyecto AISA. Su objetivo es transformar "logs" y "reportes" en **evidencia científica** de la evolución del software, facilitando la trazabilidad, la replicabilidad y el análisis crítico.

## 🧠 Principios Fundamentales

1.  **Rigor Epistemológico**: Cada afirmación técnica debe estar sustentada en evidencia (código, logs, métricas). Evitar conjeturas no verificadas.
2.  **Estructura Formal**: Seguir formatos estandarizados (Introducción, Metodología, Resultados, Discusión, Conclusión).
3.  **Trazabilidad**: Vincular explícitamente decisiones de diseño con requisitos (User Stories) y resultados (Tests).
4.  **Memoria Activa**: La documentación no es un archivo muerto; es la base de conocimiento para futuras iteraciones.

## 📂 Tipos de Documentos y Estructuras

### 1. 🔍 Reporte de Auditoría (`audit-report`)

Uso: Cuando se audita un módulo, código o arquitectura.

**Estructura Markdown:**

```markdown
# 📑 Reporte de Auditoría Técnica: [Nombre del Módulo]
**Fecha:** YYYY-MM-DD
**Auditor:** [Agente/Skill]
**Versión del Código:** [Commit/Hash]

## 1. 🎯 Objetivos de la Auditoría
Definir claramente qué se busca verificar (e.g., "Validar la integridad de los datos en modo offline", "Evaluar cumplimiento de patrones de diseño").

## 2. 🧪 Metodología
Describir cómo se realizó la auditoría.
- Herramientas usadas (e.g., SonarQube, scripts personalizados, revisión manual).
- Alcance (archivos específicos, flujos completos).

## 3. 📊 Hallazgos (Evidencia)
Lista detallada de observaciones. Usar tablas para categorizar.
| ID | Severidad | Componente | Descripción de la Anomalía | Evidencia (Snippet/Log) |
|----|-----------|------------|----------------------------|-------------------------|
| 01 | Crítica   | Auth       | Bypass de seguridad posible| `if (dev) skip()`       |

## 4. 🧠 Discusión y Análisis
Interpretar los hallazgos. ¿Por qué ocurrió esto? ¿Qué impacto sistémico tiene?
- **Análisis Causa-Raíz (RCA):**
- **Deuda Técnica Identificada:**

## 5. ✅ Recomendaciones y Plan de Acción
Pasos **prescriptivos** y **accionables** para corregir.
1. [Inmediato] Fix bug X.
2. [Mediano Plazo] Refactorizar clase Y.
```

### 2. 💡 Bitácora de Aprendizaje (`learning-log`)

Uso: Para registrar nuevos conocimientos adquiridos por el sistema o decisiones de diseño críticas.

**Estructura Markdown:**

```markdown
# 💡 Bitácora de Aprendizaje Doctoral: [Tema]

## 1. ❓ Hipótesis o Problema Inicial
"Se creía que la sincronización con WebSockets sería suficiente..."

## 2. 🧪 Experimento / Implementación
"Se implementó X usando la librería Y..."

## 3. 📈 Resultados Observados
"La latencia aumentó en un 20% en redes 3G..."

## 4. 💎 Conocimiento Destilado (Insight)
El aprendizaje fundamental. 
> "En entornos industriales con conectividad intermitente, el polling adaptativo es superior a WebSockets puros."

## 5. 🔗 Implicancias Futuras
Cómo afecta esto a la arquitectura a largo plazo.
```

### 3. 🏛 Memoria del Proyecto (`project-memory`)

Uso: Para consolidar el estado del arte del proyecto en un momento dado.

**Estructura Markdown:**

```markdown
# 🏛 Memoria Técnica del Proyecto AISA
**Hito:** Post-Producción / Fase Beta
**Fecha:** YYYY-MM-DD

## 1. 📝 Resumen Ejecutivo (Abstract)
Síntesis del estado actual del proyecto, logros principales y desafíos pendientes.

## 2. 🏗 Arquitectura del Sistema
Descripción del diagrama de componentes actual, flujos de datos y modelos de base de datos.
- **Frontend:** Next.js, Tailwind (Design System v5.0).
- **Backend:** Supabase (Auth, DB, Storage).
- **Offline Strategy:** WatermelonDB / LocalStorage Sync.

## 3. 🔄 Ciclos de Desarrollo (Autonomía)
Resumen de los ciclos autónomos ejecutados y su impacto.

## 4. 📉 Análisis de Deuda Técnica
Mapa de calor de las áreas que requieren refactorización.

## 5. 🗺 Roadmap Científico
Próximos pasos en la evolución del software, justificados por los aprendizajes previos.
```

## 🛠 Comandos Sugeridos

- Cuando se pide un reporte: `write_to_file` creando un `.md` en `/docs/audits/` o `/docs/memory/` siguiendo estas plantillas.
- Mantener un índice maestro `INDEX.md` en esas carpetas.
