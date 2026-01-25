#!/bin/bash

# Script para ejecutar un test específico usando Jest
# Uso: ./run-test.sh <path-to-file>

TEST_FILE=$1

if [ -z "$TEST_FILE" ]; then
  echo "Error: Debes especificar el archivo de test."
  echo "Uso: ./run-test.sh __tests__/MiComponente.test.tsx"
  exit 1
fi

# Ejecutar el test usando npm y pasar argumentos a jest
# Se asume que el comando 'test' en package.json es 'jest'
npx jest "$TEST_FILE" --passWithNoTests
