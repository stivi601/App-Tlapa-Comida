# ========================================
# Script para Subir Tlapa Comida a GitHub
# PowerShell Version (Windows)
# ========================================

Write-Host "🚀 Preparando Tlapa Comida para GitHub..." -ForegroundColor Green

# 1. Inicializar Git (si no está inicializado)
Write-Host "`n📦 Inicializando repositorio Git..." -ForegroundColor Cyan
git init

# 2. Agregar todos los archivos
Write-Host "`n➕ Agregando archivos..." -ForegroundColor Cyan
git add .

# 3. Hacer el primer commit
Write-Host "`n💾 Creando commit inicial..." -ForegroundColor Cyan
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
Write-Host "`n🌿 Configurando rama principal..." -ForegroundColor Cyan
git branch -M main

# 5. Instrucciones para conectar con GitHub
Write-Host "`n" -ForegroundColor Yellow
Write-Host "⚠️  IMPORTANTE: Reemplaza TU-USUARIO con tu username de GitHub" -ForegroundColor Yellow
Write-Host "`n"

Write-Host "Ejecuta estos comandos manualmente:" -ForegroundColor White
Write-Host "`n"
Write-Host "git remote add origin https://github.com/TU-USUARIO/tlapa-comida.git" -ForegroundColor Magenta
Write-Host "git push -u origin main" -ForegroundColor Magenta
Write-Host "`n"

# 6. Mostrar estado
Write-Host "✅ Repositorio local listo!" -ForegroundColor Green
Write-Host "`n"
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Crea el repositorio en GitHub: https://github.com/new" -ForegroundColor White
Write-Host "2. Nombre: tlapa-comida" -ForegroundColor White
Write-Host "3. Ejecuta: git remote add origin https://github.com/TU-USUARIO/tlapa-comida.git" -ForegroundColor White
Write-Host "4. Ejecuta: git push -u origin main" -ForegroundColor White
Write-Host "`n"
Write-Host "🎉 ¡Listo para GitHub!" -ForegroundColor Green

# Pausar para que el usuario pueda leer
Write-Host "`nPresiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
