# 📤 Guía para Subir a GitHub

## Paso 1: Inicializar Git (si no está inicializado)

```bash
cd "c:\Users\jebac\Downloads\App Tlapa Comida"
git init
```

## Paso 2: Agregar todos los archivos

```bash
git add .
```

## Paso 3: Hacer el primer commit

```bash
git commit -m "Initial commit: Tlapa Comida - Plataforma completa de delivery"
```

## Paso 4: Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `tlapa-comida`
3. Descripción: `Plataforma completa de delivery de comida con 4 módulos integrados`
4. Público o Privado (tu elección)
5. **NO** marques "Initialize with README" (ya tenemos uno)
6. Click en "Create repository"

## Paso 5: Conectar con GitHub

Reemplaza `TU-USUARIO` con tu nombre de usuario de GitHub:

```bash
git remote add origin https://github.com/TU-USUARIO/tlapa-comida.git
git branch -M main
git push -u origin main
```

## Paso 6: Verificar

Ve a tu repositorio en GitHub y verifica que todo se haya subido correctamente.

---

## 🔄 Comandos para Actualizaciones Futuras

### Agregar cambios

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

### Ver estado

```bash
git status
```

### Ver historial

```bash
git log --oneline
```

---

## 📝 Convenciones de Commits

Usa estos prefijos para tus commits:

```bash
git commit -m "feat: agregar nueva característica"
git commit -m "fix: corregir bug en carrito"
git commit -m "docs: actualizar README"
git commit -m "style: formatear código"
git commit -m "refactor: reorganizar componentes"
git commit -m "test: agregar tests"
git commit -m "chore: actualizar dependencias"
```

---

## 🌿 Trabajar con Ramas

### Crear nueva rama

```bash
git checkout -b feature/nueva-caracteristica
```

### Cambiar de rama

```bash
git checkout main
```

### Fusionar rama

```bash
git checkout main
git merge feature/nueva-caracteristica
```

### Eliminar rama

```bash
git branch -d feature/nueva-caracteristica
```

---

## 🚀 GitHub Pages (Opcional)

Para desplegar en GitHub Pages:

1. Instala gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Agrega en `package.json`:
```json
{
  "homepage": "https://TU-USUARIO.github.io/tlapa-comida",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Despliega:
```bash
npm run deploy
```

4. Configura en GitHub:
   - Settings → Pages
   - Source: gh-pages branch
   - Save

---

## 🔐 .gitignore

Ya está configurado para ignorar:

- `node_modules/`
- `dist/`
- `.env`
- Archivos de editor

---

## ✅ Checklist antes de Subir

- [ ] README.md completo
- [ ] LICENSE agregado
- [ ] .gitignore configurado
- [ ] package.json actualizado
- [ ] Código funcional
- [ ] Sin errores de ESLint
- [ ] Documentación actualizada

---

## 🎯 Estructura Recomendada de Ramas

```
main (producción)
  ├── develop (desarrollo)
  │   ├── feature/nueva-caracteristica
  │   ├── feature/otra-caracteristica
  │   └── fix/correccion-bug
  └── hotfix/correccion-urgente
```

---

## 📊 Badges para README

Agrega estos badges a tu README.md:

```markdown
![GitHub stars](https://img.shields.io/github/stars/TU-USUARIO/tlapa-comida?style=social)
![GitHub forks](https://img.shields.io/github/forks/TU-USUARIO/tlapa-comida?style=social)
![GitHub issues](https://img.shields.io/github/issues/TU-USUARIO/tlapa-comida)
![GitHub license](https://img.shields.io/github/license/TU-USUARIO/tlapa-comida)
```

---

## 🤝 Colaboradores

Para agregar colaboradores:

1. Settings → Manage access
2. Invite a collaborator
3. Ingresa su username de GitHub

---

## 📢 Promocionar tu Proyecto

1. **README atractivo** ✅ (Ya lo tienes)
2. **Screenshots** - Agrega capturas de pantalla
3. **Demo en vivo** - Despliega en Vercel/Netlify
4. **Topics** - Agrega tags en GitHub
5. **Social media** - Comparte en Twitter/LinkedIn

---

## 🎉 ¡Listo!

Tu proyecto está listo para GitHub. ¡Buena suerte! 🚀

**Recuerda:**
- Hacer commits frecuentes
- Escribir mensajes descriptivos
- Mantener la documentación actualizada
- Responder a issues y PRs

---

## 📞 Soporte

Si tienes problemas:
- [Documentación de Git](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/git)
