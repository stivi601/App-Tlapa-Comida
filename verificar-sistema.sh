#!/bin/bash

echo "🔍 Verificando Sistema Tlapa Comida..."
echo ""

# 1. PostgreSQL
echo "1️⃣ PostgreSQL:"
./postgres.sh status 2>&1 | grep -q "running" && echo "  ✅ Corriendo" || echo "  ❌ No está corriendo"
echo ""

# 2. Backend
echo "2️⃣ Backend API:"
curl -s http://localhost:3000/ | grep -q "funcionando" && echo "  ✅ Respondiendo" || echo "  ❌ No responde"
echo ""

# 3. Frontend
echo "3️⃣ Frontend:"
curl -s http://localhost:5173 | grep -q "app-tlapa-comida" && echo "  ✅ Activo" || echo "  ❌ No activo"
echo ""

# 4. Base de Datos
echo "4️⃣ Datos en Base de Datos:"
curl -s http://localhost:3000/api/restaurants | grep -q "Tacos El Paisa" && echo "  ✅ Datos cargados" || echo "  ❌ Sin datos"
echo ""

# 5. Login Admin
echo "5️⃣ Login de Admin:"
curl -s -X POST http://localhost:3000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | grep -q "token" && echo "  ✅ Funcionando" || echo "  ❌ No funciona"
echo ""

echo "✨ Verificación completa!"
echo ""
echo "📊 Resumen de URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo "   API Docs: http://localhost:3000/api/restaurants"
