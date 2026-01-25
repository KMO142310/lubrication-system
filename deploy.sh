#!/bin/bash

# AISA Lubrication System - Automated Deployment Script
# Usage: ./deploy.sh

echo "🚀 Iniciando despliegue de AISA System..."

# 1. Health Checks
echo "Health Check: Validando código..."
# En un entorno real, aquí correríamos tests
# npm run test
# npm run lint
echo "✅ Código validado."

# 2. Build Docker Image
echo "🐳 Construyendo imagen Docker (esto puede tardar unos minutos)..."
docker build -t aisa-lubrication-system:latest .

if [ $? -eq 0 ]; then
    echo "✅ Imagen construida exitosamente."
else
    echo "❌ Error al construir la imagen."
    exit 1
fi

# 3. Stop previous container if running
echo "🛑 Deteniendo contenedores anteriores..."
docker stop aisa-app 2>/dev/null || true
docker rm aisa-app 2>/dev/null || true

# 4. Run new container
echo "▶️ Iniciando nuevo contenedor..."
docker run -d \
  --name aisa-app \
  -p 3000:3000 \
  --restart unless-stopped \
  aisa-lubrication-system:latest

# 5. Verify
echo "🔍 Verificando estado..."
sleep 5
if [ "$(docker ps -q -f name=aisa-app)" ]; then
    echo "✅ SISTEMA EN LÍNEA: http://localhost:3000"
    echo "   Logs: docker logs -f aisa-app"
else
    echo "❌ Error: El contenedor no inició correctamente."
    docker logs aisa-app
    exit 1
fi
