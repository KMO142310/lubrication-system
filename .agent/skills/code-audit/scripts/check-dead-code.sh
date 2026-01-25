#!/bin/bash

# Script para detectar exportaciones no utilizadas (Dead Code)
# Usa ts-prune via npx.
# Ignora archivos de configuración comunes y patrones específicos.

echo "🔍 Buscando código muerto con ts-prune..."

# Ejecutar ts-prune ignorando patrones comunes
npx -y ts-prune --ignore 'public|coverage|dist|.next|tailwind.config|postcss.config|jest.config|next.config' | grep -v '(used in module)' | head -n 20

echo "ℹ️  Nota: Si grep no muestra nada, ¡es una buena señal!"
echo "ℹ️  Nota 2: 'used in module' se filtra porque suelen ser falsos positivos en proyectos Next.js (pages/app router)."
