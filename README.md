# 🍕 Tlapa Comida - Plataforma de Delivery de Comida

<div align="center">

![Tlapa Comida](https://img.shields.io/badge/Tlapa-Comida-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Plataforma completa de delivery de comida inspirada en Uber Eats y DiDi Food**

[Demo](#demo) • [Características](#características) • [Instalación](#instalación) • [Documentación](#documentación)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Módulos de la Aplicación](#módulos-de-la-aplicación)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentación](#documentación)
- [Roadmap](#roadmap)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## 🎯 Descripción

**Tlapa Comida** es una plataforma completa de delivery de comida desarrollada con React y Vite. El sistema incluye 4 aplicaciones independientes que trabajan en conjunto para ofrecer una experiencia completa de pedido y entrega de comida.

### ✨ Características Principales

- 🛒 **Sistema de Pedidos Completo** - Desde la selección hasta la entrega
- 📱 **4 Aplicaciones Integradas** - Cliente, Restaurante, Repartidor y Admin
- 🌍 **Geolocalización en Tiempo Real** - Compartir ubicación vía WhatsApp
- ⭐ **Sistema de Calificaciones** - Feedback de clientes
- 🎨 **Diseño Moderno y Responsivo** - UI/UX premium
- 🔄 **Estados de Pedido en Tiempo Real** - Seguimiento completo
- 📊 **Dashboard Administrativo** - Gestión completa del negocio

---

## 🚀 Módulos de la Aplicación

### 1. 👤 Customer App (Aplicación de Cliente)

**Funcionalidades:**
- ✅ Login y registro de usuarios
- ✅ Navegación y búsqueda de restaurantes
- ✅ Filtros por categorías
- ✅ Carrito de compras con cantidades (+/-)
- ✅ Gestión de direcciones de entrega
- ✅ Historial de pedidos
- ✅ Calificación de restaurantes
- ✅ Foto de perfil
- ✅ Notificaciones del sistema

**Credenciales de prueba:**
- Email: `juan@example.com`
- Password: `123`

---

### 2. 🍽️ Restaurant App (Aplicación de Restaurante)

**Funcionalidades:**
- ✅ Login de restaurantes
- ✅ Gestión de pedidos entrantes
- ✅ Aceptar/rechazar pedidos
- ✅ Cambio de estados (Preparando → Listo)
- ✅ Gestión de menú
- ✅ Agregar/eliminar platillos
- ✅ Categorías de menú
- ✅ Subir imágenes de platillos

**Credenciales de prueba:**
- Usuario: `paisa`
- Password: `123`

---

### 3. 🛵 Delivery App (Aplicación de Repartidor)

**Funcionalidades:**
- ✅ Login de repartidores
- ✅ Estado ONLINE/OFFLINE
- ✅ Ver pedidos disponibles
- ✅ Filtrado por restaurante asignado
- ✅ **Compartir ubicación por WhatsApp** 📍
- ✅ Geolocalización GPS
- ✅ Marcar pedidos como entregados
- ✅ Contador de entregas totales
- ✅ Foto de perfil

**Credenciales de prueba:**
- Usuario: `carlos`
- Password: `123`

**🆕 Característica Destacada: Compartir Ubicación**
- Obtiene ubicación GPS en tiempo real
- Genera enlace de Google Maps
- Abre WhatsApp con mensaje personalizado
- Fallback si no hay permisos de ubicación

---

### 4. 🔐 Admin App (Panel de Administración)

**Funcionalidades:**
- ✅ Dashboard con estadísticas
- ✅ Gestión de usuarios registrados
- ✅ Gestión de restaurantes
- ✅ Gestión de repartidores
- ✅ **Asignación de restaurantes a repartidores**
- ✅ Búsqueda avanzada (usuarios, restaurantes, repartidores)
- ✅ Gestión de categorías
- ✅ Envío de notificaciones masivas
- ✅ Edición completa de datos

**Acceso:**
- Ruta: `/admin`

---

## 🛠️ Tecnologías

### Frontend
- **React 19.2.0** - Biblioteca de UI
- **Vite 7.2.4** - Build tool y dev server
- **React Router DOM 7.11.0** - Enrutamiento
- **Lucide React 0.561.0** - Iconos modernos

### Características Técnicas
- **Context API** - Gestión de estado global
- **CSS Vanilla** - Estilos personalizados
- **Responsive Design** - Mobile-first
- **Geolocation API** - Ubicación GPS
- **WhatsApp API** - Integración de mensajería

---

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/tlapa-comida.git
cd tlapa-comida
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:5173
```

---

## 🎮 Uso

### Flujo Completo de Pedido

1. **Cliente hace pedido**
   - Login en Customer App
   - Seleccionar restaurante
   - Agregar items al carrito
   - Confirmar pedido
   - Estado: `PENDING`

2. **Restaurante prepara**
   - Login en Restaurant App
   - Aceptar pedido → `PREPARING`
   - Marcar como listo → `READY`

3. **Repartidor entrega**
   - Login en Delivery App
   - Estar ONLINE
   - Recoger pedido → `DELIVERING`
   - **Compartir ubicación por WhatsApp** 📍
   - Marcar como entregado → `COMPLETED`

4. **Cliente califica**
   - Ver pedido en historial
   - Calificar con estrellas ⭐
   - Rating se actualiza en el restaurante

---

## 📁 Estructura del Proyecto

```
tlapa-comida/
├── src/
│   ├── pages/
│   │   ├── Welcome.jsx          # Pantalla de bienvenida
│   │   ├── CustomerApp.jsx      # App de cliente
│   │   ├── RestaurantApp.jsx    # App de restaurante
│   │   ├── DeliveryApp.jsx      # App de repartidor
│   │   └── AdminApp.jsx         # Panel de admin
│   ├── context/
│   │   └── AppContext.jsx       # Estado global
│   ├── App.jsx                  # Componente principal
│   ├── main.jsx                 # Entry point
│   └── index.css                # Estilos globales
├── public/                      # Archivos estáticos
├── docs/
│   ├── PLAN_DE_PRUEBAS.md      # Plan de testing
│   ├── MEJORAS_DELIVERY_WHATSAPP.md
│   └── CORRECCION_PEDIDOS_REPARTIDOR.md
├── package.json
├── vite.config.js
└── README.md
```

---

## 📚 Documentación

### Documentos Disponibles

- **[Plan de Pruebas](PLAN_DE_PRUEBAS.md)** - Guía completa de testing
- **[Mejoras Delivery WhatsApp](MEJORAS_DELIVERY_WHATSAPP.md)** - Documentación de geolocalización
- **[Corrección Pedidos](CORRECCION_PEDIDOS_REPARTIDOR.md)** - Fix de filtrado de pedidos

### Estados de Pedidos

```
PENDING → PREPARING → READY → DELIVERING → COMPLETED
```

| Estado | Descripción | Quién lo ve |
|--------|-------------|-------------|
| `pending` | Pedido recién creado | Cliente, Restaurante |
| `preparing` | Restaurante preparando | Cliente, Restaurante |
| `ready` | Listo para recoger | Cliente, Restaurante, Repartidor |
| `delivering` | En camino | Cliente, Repartidor |
| `completed` | Entregado | Cliente |

---

## 🎨 Características de Diseño

### Paleta de Colores
- **Primary:** `#FF6B35` (Naranja vibrante)
- **Success:** `#10B981` (Verde)
- **Warning:** `#F59E0B` (Amarillo)
- **Error:** `#EF4444` (Rojo)
- **WhatsApp:** `#25D366` (Verde WhatsApp)

### Animaciones
- ✨ Scale-up en items del menú
- 🎯 Bounce en items del carrito
- 🌊 Fade-in en transiciones
- 💫 Hover effects en botones

---

## 🗺️ Roadmap

### ✅ Completado
- [x] Sistema de pedidos completo
- [x] 4 módulos funcionales
- [x] Geolocalización y WhatsApp
- [x] Sistema de calificaciones
- [x] Asignación de repartidores
- [x] Búsqueda avanzada

### 🚧 En Desarrollo
- [ ] Backend real con base de datos
- [ ] Autenticación con JWT
- [ ] Pasarela de pagos
- [ ] Notificaciones push
- [ ] Chat en tiempo real

### 💡 Futuro
- [ ] Tracking en tiempo real con mapa
- [ ] App móvil nativa
- [ ] Sistema de cupones
- [ ] Programa de lealtad
- [ ] Analytics avanzado

---

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👥 Autores

- **Tu Nombre** - *Desarrollo Inicial* - [tu-usuario](https://github.com/tu-usuario)

---

## 🙏 Agradecimientos

- Inspirado en Uber Eats y DiDi Food
- Iconos por [Lucide](https://lucide.dev/)
- Imágenes de [Unsplash](https://unsplash.com/)

---

## 📞 Contacto

- **Email:** tu-email@example.com
- **GitHub:** [@tu-usuario](https://github.com/tu-usuario)
- **LinkedIn:** [Tu Nombre](https://linkedin.com/in/tu-perfil)

---

<div align="center">

**⭐ Si te gusta este proyecto, dale una estrella en GitHub! ⭐**

Hecho con ❤️ y ☕ por [Tu Nombre]

</div>
