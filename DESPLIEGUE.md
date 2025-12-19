# 🚀 Guía de Despliegue Full Stack - Tlapa Comida

¡Tu código ya está en GitHub! Ahora vamos a ponerlo online siguiendo estos pasos.

---

## 🌍 Paso 1: Desplegar Backend en Render.com
Primero desplegamos el Backend para obtener su URL.

1.  Crea una cuenta en [render.com](https://render.com).
2.  Click en **"New +"** -> **"Web Service"**.
3.  Conecta tu cuenta de GitHub y selecciona el repo `App-Tlapa-Comida`.
4.  **Configuración**:
    *   **Root Directory**: `backend`
    *   **Build Command**: `npm install && npx prisma generate`
    *   **Start Command**: `node server.js`
5.  **Variables de Entorno (Environment Variables)**:
    Añade estas variables en la sección "Environment":
    *   `JWT_SECRET`: (Escribe una clave larga y segura, ej: `TlapaComidaSecret2025!`)
    *   `DATABASE_URL`: `file:./dev.db`
    *   `NODE_ENV`: `production`
6.  Click en **Create Web Service**.

**Copia la URL** que te dé Render al final (ej. `https://tlapa-backend.onrender.com`).

---

## 🖥️ Paso 2: Desplegar Frontend en Vercel
Ahora subimos la interfaz y la conectamos al backend.

1.  Crea una cuenta en [vercel.com](https://vercel.com).
2.  Click en **"Add New..."** -> **"Project"** e importa tu repo.
3.  **Variables de Entorno**:
    *   Key: `VITE_API_URL`
    *   Value: **Pega la URL de Render** (ej. `https://tlapa-backend.onrender.com`). **¡Sin la barra `/` al final!**
4.  Click en **Deploy**.

---

## 🎉 ¡Listo!
Vercel te dará una URL (ej. `https://app-tlapa-comida.vercel.app`). ¡Tu app ya está en la nube!

> **Nota:** En el plan gratuito de Render, el backend se "duerme" tras 15 min de inactividad. La primera vez que abras la app después de un tiempo, puede tardar unos 30 segundos en cargar.
