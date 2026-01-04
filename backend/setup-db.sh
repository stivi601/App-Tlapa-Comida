#!/bin/bash

# Script para configurar la base de datos PostgreSQL local

echo "📝 Pasos para configurar tu base de datos PostgreSQL local:"
echo ""
echo "1️⃣  Actualiza tu archivo backend/.env con:"
echo "   DATABASE_URL=\"postgresql://adrianmendoza@localhost:5432/tlapa_comida_dev\""
echo ""
echo "2️⃣  Ejecuta las migraciones de Prisma:"
echo "   cd backend"
echo "   npx prisma migrate dev --name init"
echo ""
echo "3️⃣  (Opcional) Ejecuta el seed para datos de prueba:"
echo "   npx prisma db seed"
echo ""
echo "4️⃣  Inicia el servidor:"
echo "   npm run dev"
echo ""
echo "✅ PostgreSQL está corriendo en localhost:5432"
echo "✅ Base de datos: tlapa_comida_dev"
echo "✅ Usuario: adrianmendoza"
