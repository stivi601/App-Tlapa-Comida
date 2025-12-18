#!/bin/bash

# ========================================
# Script para Subir Tlapa Comida a GitHub
# ========================================

echo "🚀 Preparando Tlapa Comida para GitHub..."

# 1. Inicializar Git (si no está inicializado)
echo "📦 Inicializando repositorio Git..."
git init

# 2. Agregar todos los archivos
echo "➕ Agregando archivos..."
git add .

# 3. Hacer el primer commit
echo "💾 Creando commit inicial..."
git commit -m "Initial commit: Tlapa Comida - Plataforma completa de delivery

Características:
- 4 módulos integrados (Cliente, Restaurante, Repartidor, Admin)
- Sistema de pedidos completo
- Geolocalización y WhatsApp
- Sistema de calificaciones
- Gestión administrativa completa
- Búsqueda avanzada
- Asignación de repartidores

Tecnologías:
- React 19.2.0
- Vite 7.2.4
- React Router DOM 7.11.0
- Context API
- Geolocation API
"

# 4. Renombrar rama a main
echo "🌿 Configurando rama principal..."
git branch -M main

# 5. Conectar con GitHub
echo ""
echo "⚠️  IMPORTANTE: Reemplaza TU-USUARIO con tu username de GitHub"
echo ""
echo "Ejecuta estos comandos manualmente:"
echo ""
echo "git remote add origin https://github.com/TU-USUARIO/tlapa-comida.git"
echo "git push -u origin main"
echo ""

# 6. Mostrar estado
echo "✅ Repositorio local listo!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Crea el repositorio en GitHub: https://github.com/new"
echo "2. Nombre: tlapa-comida"
echo "3. Ejecuta: git remote add origin https://github.com/TU-USUARIO/tlapa-comida.git"
echo "4. Ejecuta: git push -u origin main"
echo ""
echo "🎉 ¡Listo para GitHub!"
