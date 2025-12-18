# 🚨 SOLUCIÓN RÁPIDA - Error de Git

## ❌ Problema Detectado

Hay una carpeta `Tlapa-Comida/` que está causando conflictos con Git.

## ✅ Solución (Sigue estos pasos)

### Paso 1: Eliminar carpeta problemática

**Opción A: Explorador de Windows**
1. Abre el Explorador de Windows
2. Navega a: `c:\Users\jebac\Downloads\App Tlapa Comida`
3. Busca la carpeta `Tlapa-Comida`
4. Elimínala (Shift + Delete para eliminar permanentemente)

**Opción B: PowerShell (si la Opción A no funciona)**
```powershell
# Cierra VS Code y cualquier programa que esté usando la carpeta
# Luego ejecuta:
Remove-Item -Path "c:\Users\jebac\Downloads\App Tlapa Comida\Tlapa-Comida" -Recurse -Force
```

### Paso 2: Configurar Git

Después de eliminar la carpeta, ejecuta estos comandos:

```bash
# 1. Navega al proyecto
cd "c:\Users\jebac\Downloads\App Tlapa Comida"

# 2. Agregar archivos
git add .

# 3. Hacer commit
git commit -m "Initial commit: Tlapa Comida - Plataforma completa de delivery

Características:
- 4 módulos integrados (Cliente, Restaurante, Repartidor, Admin)
- Sistema de pedidos completo
- Geolocalización y WhatsApp
- Sistema de calificaciones
- Gestión administrativa completa

Tecnologías:
- React 19.2.0
- Vite 7.2.4
- React Router DOM 7.11.0
"

# 4. Renombrar rama a main
git branch -M main

# 5. Crear repositorio en GitHub
# Ve a: https://github.com/new
# Nombre: tlapa-comida
# NO marques "Initialize with README"

# 6. Conectar con GitHub (REEMPLAZA TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/tlapa-comida.git

# 7. Subir a GitHub
git push -u origin main
```

## 🎯 Comandos Completos (Copia y Pega)

```powershell
# Ejecuta esto en PowerShell después de eliminar la carpeta Tlapa-Comida

cd "c:\Users\jebac\Downloads\App Tlapa Comida"
git add .
git commit -m "Initial commit: Tlapa Comida - Plataforma completa de delivery"
git branch -M main

# IMPORTANTE: Reemplaza TU-USUARIO con tu username de GitHub
git remote add origin https://github.com/TU-USUARIO/tlapa-comida.git
git push -u origin main
```

## ⚠️ Si Aparece Error de CRLF

Los warnings sobre LF/CRLF son normales en Windows. Puedes ignorarlos o configurar:

```bash
git config --global core.autocrlf true
```

## 📋 Checklist

- [ ] Eliminar carpeta `Tlapa-Comida`
- [ ] Ejecutar `git add .`
- [ ] Ejecutar `git commit -m "..."`
- [ ] Ejecutar `git branch -M main`
- [ ] Crear repositorio en GitHub
- [ ] Ejecutar `git remote add origin ...`
- [ ] Ejecutar `git push -u origin main`

## ✅ Después del Push Exitoso

Verás algo como:

```
Enumerating objects: 50, done.
Counting objects: 100% (50/50), done.
Delta compression using up to 8 threads
Compressing objects: 100% (45/45), done.
Writing objects: 100% (50/50), 25.00 KiB | 5.00 MiB/s, done.
Total 50 (delta 10), reused 0 (delta 0), pack-reused 0
To https://github.com/TU-USUARIO/tlapa-comida.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

¡Listo! Tu proyecto está en GitHub. 🎉

---

**¿Problemas?** Comparte el error exacto que te aparece.
