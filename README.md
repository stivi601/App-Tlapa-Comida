# 🍕 Tlapa Comida - Plataforma de Delivery de Comida

<div align="center">

![Tlapa Comida](https://img.shields.io/badge/Tlapa-Comida-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Plataforma completa de delivery de comida con backend real, base de datos PostgreSQL y autenticación JWT**

[Demo](#demo) • [Características](#características) • [Instalación](#instalación) • [API](#api-endpoints)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [API Endpoints](#api-endpoints)
- [Módulos de la Aplicación](#módulos-de-la-aplicación)
- [Despliegue](#despliegue)
- [Roadmap](#roadmap)

---

## 🎯 Descripción

**Tlapa Comida** es una plataforma completa de delivery de comida con arquitectura cliente-servidor. Incluye un backend robusto con Node.js, Express y PostgreSQL, junto con 4 aplicaciones frontend que trabajan en conjunto para ofrecer una experiencia completa de pedido y entrega.

### ✨ Características Principales

- 🔐 **Autenticación JWT** - Sistema seguro de login y registro
- 🗄️ **Base de Datos PostgreSQL** - Persistencia real con Prisma ORM
- 📱 **4 Aplicaciones Integradas** - Cliente, Restaurante, Repartidor y Admin
- ⭐ **Sistema de Reseñas** - Calificaciones y comentarios de clientes
- 🎨 **Diseño Moderno y Responsivo** - UI/UX premium mobile-first
- 🔄 **Seguimiento de Pedidos** - Estados en tiempo real con stepper visual
- 📊 **Dashboard Administrativo** - Gestión completa del negocio
- 🌍 **Geolocalización** - Compartir ubicación vía WhatsApp
- 🚀 **Desplegado en Render** - Backend y base de datos en producción

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Customer │  │Restaurant│  │ Delivery │  │ Admin  │ │
│  │   App    │  │   App    │  │   App    │  │  Panel │ │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘  └────┬───┘ │
└────────┼─────────────┼─────────────┼─────────────┼─────┘
         │             │             │             │
         └─────────────┴─────────────┴─────────────┘
                         │ REST API
         ┌───────────────┴───────────────┐
         │   BACKEND (Node.js + Express) │
         │  ┌──────────────────────────┐ │
         │  │  Controllers & Routes    │ │
         │  │  - Auth (JWT)            │ │
         │  │  - Restaurants           │ │
         │  │  - Orders                │ │
         │  │  - Reviews               │ │
         │  │  - Delivery              │ │
         │  └────────┬─────────────────┘ │
         └───────────┼───────────────────┘
                     │ Prisma ORM
         ┌───────────┴───────────────┐
         │   PostgreSQL Database     │
         │  - Users                  │
         │  - Restaurants            │
         │  - Orders                 │
         │  - Reviews                │
         │  - DeliveryRiders         │
         └───────────────────────────┘
```

---

## 🛠️ Tecnologías

### Backend
- **Node.js 18+** - Runtime de JavaScript
- **Express 4.18** - Framework web
- **Prisma 5.10** - ORM para PostgreSQL
- **PostgreSQL 16** - Base de datos relacional
- **JWT** - Autenticación y autorización
- **bcryptjs** - Hashing de contraseñas
- **Twilio** - SMS (opcional)

### Frontend
- **React 19.2.0** - Biblioteca de UI
- **Vite 7.2.4** - Build tool y dev server
- **React Router DOM 7.11.0** - Enrutamiento
- **Lucide React 0.561.0** - Iconos modernos
- **Context API** - Gestión de estado global

### DevOps
- **Render** - Hosting de backend y base de datos
- **Git/GitHub** - Control de versiones

---

## 📦 Instalación

### Prerrequisitos

- Node.js 18+
- PostgreSQL 14+ (o usar la base de datos de Render)
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/stivi601/App-Tlapa-Comida.git
cd App-Tlapa-Comida
```

2. **Instalar dependencias del backend**
```bash
cd backend
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env en /backend
cp .env.example .env
```

Editar `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/tlapa_comida"
JWT_SECRET="tu_secreto_super_seguro"
PORT=3000
```

4. **Configurar base de datos**
```bash
# Generar cliente de Prisma
npx prisma generate

# Sincronizar esquema con la base de datos
npx prisma db push

# Poblar con datos de prueba
npx prisma db seed
```

5. **Instalar dependencias del frontend**
```bash
cd ..
npm install
```

6. **Configurar API URL del frontend**
```bash
# Crear archivo .env en la raíz
echo "VITE_API_URL=http://localhost:3000" > .env
```

7. **Iniciar el proyecto**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
npm run dev
```

8. **Abrir en el navegador**
```
http://localhost:5173
```

---

## ⚙️ Configuración

### Variables de Entorno

#### Backend (`/backend/.env`)
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="clave_secreta_jwt"
PORT=3000
NODE_ENV=development

# Opcional - Twilio para SMS
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

#### Frontend (`/.env`)
```env
VITE_API_URL=http://localhost:3000
```

### Base de Datos

El proyecto usa **Prisma** como ORM. El esquema incluye:

- **User** - Usuarios del sistema (clientes y admins)
- **Restaurant** - Restaurantes con menú
- **MenuItem** - Platillos de cada restaurante
- **Order** - Pedidos con items y estados
- **OrderItem** - Items individuales de cada pedido
- **Review** - Reseñas de clientes
- **DeliveryRider** - Repartidores
- **Address** - Direcciones de entrega
- **Notification** - Notificaciones del sistema

---

## 🔌 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Login de cliente | No |
| POST | `/api/auth/admin/login` | Login de administrador | No |
| POST | `/api/auth/restaurant/login` | Login de restaurante | No |
| GET | `/api/auth/me` | Obtener perfil actual | Sí |

### Restaurantes

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/restaurants` | Listar todos los restaurantes | No |
| GET | `/api/restaurants/:id` | Obtener restaurante por ID | No |
| POST | `/api/restaurants` | Crear restaurante | Admin |
| PUT | `/api/restaurants/:id` | Actualizar restaurante | Admin |
| DELETE | `/api/restaurants/:id` | Eliminar restaurante | Admin |
| POST | `/api/restaurants/:id/menu` | Agregar platillo al menú | Admin/Restaurant |
| DELETE | `/api/restaurants/:id/menu/:itemId` | Eliminar platillo | Admin/Restaurant |

### Pedidos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/orders` | Listar pedidos (filtrado por rol) | Sí |
| POST | `/api/orders` | Crear nuevo pedido | Customer |
| PUT | `/api/orders/:id/status` | Actualizar estado del pedido | Sí |
| PUT | `/api/orders/:id/assign` | Asignar repartidor | Delivery |

### Reseñas

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/reviews` | Crear reseña | Customer |
| GET | `/api/reviews/restaurant/:id` | Obtener reseñas de restaurante | No |

### Repartidores

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/delivery/available-orders` | Pedidos disponibles para recoger | Delivery |

### Admin

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/users` | Listar usuarios | Admin |
| GET | `/api/admin/riders` | Listar repartidores | Admin |
| POST | `/api/admin/riders` | Crear repartidor | Admin |
| PUT | `/api/admin/riders/:id` | Actualizar repartidor | Admin |
| DELETE | `/api/admin/riders/:id` | Eliminar repartidor | Admin |

---

## 🚀 Módulos de la Aplicación

### 1. 👤 Customer App

**Funcionalidades:**
- ✅ Registro y login con JWT
- ✅ Navegación y búsqueda de restaurantes
- ✅ Filtros por categorías
- ✅ Carrito de compras con cantidades
- ✅ Gestión de direcciones de entrega
- ✅ Historial de pedidos con stepper visual
- ✅ Sistema de reseñas (estrellas + comentarios)
- ✅ Foto de perfil
- ✅ Notificaciones

**Credenciales de prueba:**
- Email: `juan@example.com`
- Password: `123`

---

### 2. 🍽️ Restaurant App

**Funcionalidades:**
- ✅ Login con JWT
- ✅ Gestión de pedidos entrantes
- ✅ Cambio de estados (Pending → Preparing → Ready)
- ✅ Gestión completa de menú
- ✅ Agregar/eliminar platillos con imágenes
- ✅ Categorías de menú
- ✅ Ver reseñas recibidas

**Credenciales de prueba:**
- Usuario: `paisa`
- Password: `123`

---

### 3. 🛵 Delivery App

**Funcionalidades:**
- ✅ Login con JWT
- ✅ Estado ONLINE/OFFLINE
- ✅ Ver pedidos disponibles (filtrado por restaurante asignado)
- ✅ Compartir ubicación por WhatsApp con GPS
- ✅ Marcar pedidos como entregados
- ✅ Contador de entregas totales
- ✅ Foto de perfil

**Credenciales de prueba:**
- Usuario: `carlos`
- Password: `123`

---

### 4. 🔐 Admin Panel

**Funcionalidades:**
- ✅ Dashboard con estadísticas
- ✅ Gestión completa de usuarios
- ✅ Gestión de restaurantes (CRUD completo)
- ✅ Gestión de repartidores con asignación
- ✅ Búsqueda avanzada
- ✅ Gestión de categorías
- ✅ Envío de notificaciones masivas

**Acceso:**
- Ruta: `/admin`
- Usuario: `admin`
- Password: `admin123`

---

## 🌐 Despliegue

### Render (Recomendado)

El proyecto incluye configuración para Render (`render.yaml`):

1. **Crear cuenta en Render.com**

2. **Conectar repositorio de GitHub**

3. **El archivo `render.yaml` configura automáticamente:**
   - Servicio web (backend)
   - Base de datos PostgreSQL
   - Variables de entorno
   - Build y start commands

4. **Variables de entorno en Render:**
   - `DATABASE_URL` - Auto-configurada
   - `JWT_SECRET` - Auto-generada
   - `NODE_ENV=production`

5. **Frontend:**
   - Desplegar en Vercel/Netlify
   - Configurar `VITE_API_URL` con la URL del backend de Render

---

## 📁 Estructura del Proyecto

```
App-Tlapa-Comida/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Esquema de base de datos
│   │   └── seed.js                # Datos de prueba
│   ├── src/
│   │   ├── controllers/           # Lógica de negocio
│   │   │   ├── authController.js
│   │   │   ├── restaurantController.js
│   │   │   ├── orderController.js
│   │   │   ├── reviewController.js
│   │   │   └── deliveryController.js
│   │   ├── routes/                # Definición de rutas
│   │   │   ├── auth.js
│   │   │   ├── restaurants.js
│   │   │   ├── orders.js
│   │   │   ├── reviews.js
│   │   │   └── delivery.js
│   │   ├── middleware/            # Middlewares
│   │   │   └── auth.js
│   │   └── utils/
│   │       └── prisma.js          # Cliente de Prisma
│   ├── server.js                  # Entry point del backend
│   ├── start.sh                   # Script de inicio
│   └── package.json
├── src/
│   ├── pages/
│   │   ├── Welcome.jsx
│   │   ├── CustomerApp.jsx
│   │   ├── RestaurantApp.jsx
│   │   ├── DeliveryApp.jsx
│   │   └── AdminApp.jsx
│   ├── context/
│   │   └── AppContext.jsx         # Estado global + API calls
│   ├── components/
│   │   └── AdminLogin.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── render.yaml                    # Configuración de Render
├── package.json
└── README.md
```

---

## 🗺️ Roadmap

### ✅ Fase 1 - Completada
- [x] Backend con Express y PostgreSQL
- [x] Autenticación JWT
- [x] CRUD completo de restaurantes
- [x] Sistema de pedidos
- [x] Sistema de reseñas
- [x] Seguimiento visual de pedidos
- [x] Despliegue en Render

### 🚧 Fase 2 - En Desarrollo
- [ ] Pasarela de pagos (Stripe/PayPal)
- [ ] OTP para verificación de entrega
- [ ] Login con OTP (sin contraseña)
- [ ] Notificaciones push en tiempo real

### 💡 Fase 3 - Futuro
- [ ] Tracking en tiempo real con mapa
- [ ] Chat en tiempo real (Socket.io)
- [ ] App móvil nativa (React Native)
- [ ] Sistema de cupones y descuentos
- [ ] Programa de lealtad
- [ ] Analytics avanzado

---

## 🎨 Características de Diseño

### Paleta de Colores
- **Primary:** `#FF6B35` (Naranja vibrante)
- **Success:** `#10B981` (Verde)
- **Warning:** `#F59E0B` (Amarillo)
- **Error:** `#EF4444` (Rojo)
- **WhatsApp:** `#25D366`

### Animaciones
- ✨ Scale-up en items del menú
- 🎯 Bounce en items del carrito
- 🌊 Fade-in en transiciones
- 💫 Hover effects en botones
- 🔄 Stepper animado para estados de pedido

---

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Autenticación JWT con expiración
- ✅ Validación de roles (RBAC)
- ✅ Validación de ownership en pedidos
- ✅ CORS configurado
- ✅ Variables de entorno para secretos
- ✅ SQL injection prevention (Prisma)

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 👥 Autor

- **Adrian Mendoza** - *Desarrollo Completo* - [stivi601](https://github.com/stivi601)

---

## 🙏 Agradecimientos

- Inspirado en Uber Eats y DiDi Food
- Iconos por [Lucide](https://lucide.dev/)
- Desarrollado con asistencia de IA

---

<div align="center">

**⭐ Si te gusta este proyecto, dale una estrella en GitHub! ⭐**

Hecho con ❤️ y ☕

</div>
