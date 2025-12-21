#!/bin/sh

echo "🚀 Iniciando proceso de arranque..."

# 1. Sincronizar esquema de base de datos
echo "🔄 Sincronizando esquema con la base de datos (Prisma DB Push)..."
npx prisma db push --accept-data-loss

# 2. Iniciar el servidor
echo "📡 Arrancando el servidor principal..."
node server.js
