#!/bin/bash

# Script para detectar duplicados de código (Copy/Paste)
# Usa jscpd via npx.

echo "🔍 Buscando duplicados con jscpd..."

# --min-lines 5: Reportar bloques de 5 líneas o más idénticas
# --min-tokens 50: Mínimo de tokens para considerar
# --threshold 0: Reportar todo (no fallar el comando por umbral)
# --ignore "**/*.json,**/*.md,**/.next/**,**/node_modules/**"

npx -y jscpd . \
  --min-lines 5 \
  --min-tokens 50 \
  --threshold 0 \
  --ignore "**/*.json,**/*.md,**/.next/**,**/node_modules/**,**/*.d.ts,**/dist/**,**/.git/**" \
  --reporters console

echo "✅ Análisis de duplicados completado."
