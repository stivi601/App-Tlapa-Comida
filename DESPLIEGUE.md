# 🚀 Guía de Despliegue Full Stack - Tlapa Comida

¡Tu código ya está en GitHub! Ahora vamos a ponerlo online.

Necesitamos desplegar dos partes:
1.  **Frontend (React)**: En **Vercel** (Gratis y rápido).
2.  **Backend (Node.js)**: En **Render** (Gratis para demos).

---

## 🌍 Paso 1: Desplegar Backend en Render
Primero el Backend, porque necesitamos su URL para dársela al Frontend.

1.  Crea una cuenta en [render.com](https://render.com).
2.  Click en **"New +"** -> **"Web Service"**.
3.  Selecciona "Build and deploy from a Git repository" y conecta tu cuenta de GitHub.
4.  Busca tu repo `App-Tlapa-Comida` y dale a **Connect**.
5.  **Configuración Crucial**:
    *   **Name**: `tlapa-backend` (o lo que quieras).
    *   **Root Directory**: `backend` (¡Muy importante!).
    *   **Runtime**: Node.js.
    *   **Build Command**: `npm install && npx prisma generate`
    *   **Start Command**: `node server.js`
6.  **Variables de Entorno (Environment Variables)**:
    Baja a la sección "Advanced" o "Environment" y añade:
    *   Key: `JWT_SECRET` | Value: `(inventa una contraseña larga y segura)`
    *   Key: `DATABASE_URL` | Value: `file:./dev.db`
    *   Key: `NODE_ENV` | Value: `production`
7.  Click en **Create Web Service**.

Espera a que termine el despliegue. Al final, Render te dará una URL (ej. `https://tlapa-backend.onrender.com`). **Copia esa URL**, la necesitarás para el paso 2.

> **⚠️ Advertencia Importante:** En la versión gratuita de Render con SQLite, **la base de datos se reiniciará** cada vez que el servidor se "duerma" por inactividad o hagas un nuevo deploy. Para producción real, necesitarías configurar PostgreSQL.

---

## 🖥️ Paso 2: Desplegar Frontend en Vercel

1.  Crea una cuenta en [vercel.com](https://vercel.com).
2.  Click en **"Add New..."** -> **"Project"**.
3.  Importa tu repo `App-Tlapa-Comida`.
4.  **Configuración (Build & Output Settings)**:
    *   **Framework Preset**: Vite (lo debería detectar solo).
    *   **Root Directory**: `.` (Déjalo en blanco / default).
5.  **Variables de Entorno (Environment Variables)**:
    *   Key: `VITE_API_URL`
    *   Value: **Pega la URL de tu Backend en Render** (ej. `https://tlapa-backend.onrender.com`). **¡Sin la barra `/` al final!**
6.  Click en **Deploy**.

---

## 🎉 ¡Listo!

Vercel te dará una URL para tu frontend (ej. `https://app-tlapa-comida.vercel.app`).
¡Entra y prueba tu aplicación en vivo!
