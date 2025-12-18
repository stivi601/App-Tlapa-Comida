# 🚀 Guía de Despliegue - Tlapa Comida

Esta guía te llevará paso a paso para poner tu aplicación en internet, accesible para todo el mundo.

## 📋 Estrategia de Despliegue
Como la aplicación actualmente es una SPA (Single Page Application) independiente del backend:
- **Frontend:** Se alojará en **Vercel** (Recomendado) o Netlify. Es gratis y rápido.
- **Backend/Base de Datos:** (Futuro) Se desplegará en Railway o Render.

---

## 🛠️ Paso 1: Subir código a GitHub
Necesitas tener tu código en un repositorio remoto.

1.  Ve a [GitHub.com](https://github.com) y crea un **Nuevo Repositorio** (ej. `tlapa-comida`).
2.  **No** lo inicialices con README, .gitignore ni licencia (ya tienes todo eso localmente).
3.  Copia la URL del repositorio (HTTPS o SSH).
4.  Ejecuta estos comandos en tu terminal (reemplaza la URL):

```bash
# Vincula tu repositorio local con el remoto
git remote add origin https://github.com/TU_USUARIO/tlapa-comida.git

# Renombra la rama principal a 'main' (estándar moderno)
git branch -M main

# Sube tu código
git push -u origin main
```

---

## ☁️ Paso 2: Desplegar en Vercel (Opción A - Recomendada)
Vercel es la mejor plataforma para apps React/Vite.

1.  Crea una cuenta en [vercel.com](https://vercel.com).
2.  Instala Vercel CLI (opcional) o hazlo desde la web.
    - **Desde la Web (Más fácil):**
        1. Click en **"Add New..."** -> **"Project"**.
        2. Selecciona tu repositorio de GitHub `tlapa-comida` y dale a **Import**.
        3. **Build Settings:** Vercel detectará que es Vite automáticamente.
           - Build Command: `npm run build`
           - Output Directory: `dist`
        4. **Environment Variables:**
           - Copia el contenido de tu archivo `.env` local (o `.env.example`).
           - Clave: `VITE_API_URL`, Valor: `https://api.tudominio.com` (o lo que tengas).
        5. Click en **Deploy**.

---

## 🌐 Paso 3: Configurar Variables de Entorno
Para que la app funcione correctamente en producción, asegúrate de configurar las variables en el panel de Vercel/Netlify:

| Variable | Valor (Ejemplo) |
|----------|-----------------|
| `VITE_APP_TITLE` | `Tlapa Comida` |
| `VITE_API_URL` | `https://api.tu-backend.com` (o dejar vacío por ahora) |

⚠️ **Nota:** No subas la `JWT_SECRET` ni claves privadas al frontend. Esas solo son para el backend.

---

## 🔄 Actualizar tu App
Cada vez que hagas cambios:

1.  Guarda tus cambios:
    ```bash
    git add .
    git commit -m "Descripción de los cambios"
    ```
2.  Sube los cambios:
    ```bash
    git push
    ```
3.  **Vercel detectará el cambio y re-desplegará automáticamente.**

---

## 🐛 Solución de Problemas Comunes

### Error 404 al recargar páginas
Si entras a `/customer/menu` y recargas, podrías ver un error 404.
**Solución:**
Crea un archivo llamado `vercel.json` en la raíz del proyecto con este contenido:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Esto asegura que todas las rutas sean manejadas por React Router.
