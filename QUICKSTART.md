# 🚀 Guía Rápida de Inicio - Tlapa Comida

Esta guía te ayudará a tener la aplicación corriendo en menos de 5 minutos.

## ⚡ Inicio Rápido

### 1. Clonar e Instalar

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/tlapa-comida.git
cd tlapa-comida

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### 2. Abrir en el Navegador

```
http://localhost:5173
```

¡Listo! La aplicación está corriendo. 🎉

---

## 🎮 Credenciales de Prueba

### 👤 Customer App
- **Email:** `juan@example.com`
- **Password:** `123`

### 🍽️ Restaurant App
- **Usuario:** `paisa`
- **Password:** `123`

### 🛵 Delivery App
- **Usuario:** `carlos`
- **Password:** `123`

### 🔐 Admin App
- **Acceso directo:** `/admin`

---

## 📱 Probar los Módulos

### 1. Customer App (Cliente)

```
1. Click en "Cliente"
2. Login con juan@example.com
3. Explorar restaurantes
4. Agregar items al carrito
5. Confirmar pedido
```

### 2. Restaurant App (Restaurante)

```
1. Click en "Restaurante"
2. Login con paisa / 123
3. Ver pedidos entrantes
4. Aceptar pedido
5. Marcar como "Listo para Recoger"
```

### 3. Delivery App (Repartidor)

```
1. Click en "Repartidor"
2. Login con carlos / 123
3. Activar estado ONLINE
4. Ver pedidos disponibles
5. Recoger pedido
6. Compartir ubicación por WhatsApp 📍
7. Marcar como entregado
```

### 4. Admin App (Administrador)

```
1. Click en "Admin"
2. Ver dashboard con estadísticas
3. Gestionar restaurantes
4. Gestionar repartidores
5. Asignar restaurantes a repartidores
6. Enviar notificaciones
```

---

## 🔥 Características Destacadas

### 📍 Compartir Ubicación (Delivery App)

Cuando un repartidor recoge un pedido:

1. Aparece botón verde "Compartir Ubicación"
2. Click en el botón
3. Acepta permisos de ubicación
4. Se abre WhatsApp con mensaje y ubicación GPS
5. El cliente recibe enlace de Google Maps

**Mensaje enviado:**
```
¡Hola! Soy Carlos Velasquez, tu repartidor de Tlapa Comida 🛵

Estoy en camino con tu pedido #103

Mi ubicación actual: https://www.google.com/maps?q=19.4326,-99.1332

¡Llegaré pronto! 😊
```

### ⭐ Sistema de Calificaciones

Los clientes pueden calificar restaurantes:

1. Ir a "Mis Pedidos"
2. Ver pedidos completados
3. Click en "Calificar"
4. Seleccionar estrellas (1-5)
5. Enviar calificación
6. El rating del restaurante se actualiza

### 🔍 Búsqueda Avanzada (Admin)

El admin puede buscar:

- **Usuarios:** Por nombre, email o teléfono
- **Restaurantes:** Por nombre
- **Repartidores:** Por nombre o RFC

---

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Crea build de producción
npm run preview      # Preview del build

# Calidad de Código
npm run lint         # Ejecuta ESLint
```

---

## 📊 Flujo Completo de Pedido

```
Cliente → Pedido → Restaurante → Repartidor → Entrega → Calificación
   ↓         ↓          ↓             ↓           ↓          ↓
 Login   Carrito   Aceptar      Recoger    WhatsApp   Estrellas
         Items    Preparar     Ubicación   Entregar    Rating
```

### Estados del Pedido

```
PENDING → PREPARING → READY → DELIVERING → COMPLETED
```

| Estado | Descripción |
|--------|-------------|
| `pending` | Pedido recién creado |
| `preparing` | Restaurante preparando |
| `ready` | Listo para recoger |
| `delivering` | En camino |
| `completed` | Entregado |

---

## 🎨 Personalización

### Cambiar Colores

Edita `src/index.css`:

```css
:root {
    --primary: #FF6B35;      /* Color principal */
    --success: #10B981;      /* Verde */
    --warning: #F59E0B;      /* Amarillo */
    --error: #EF4444;        /* Rojo */
}
```

### Agregar Restaurantes

Edita `src/context/AppContext.jsx`:

```javascript
const [restaurants, setRestaurants] = useState([
    {
        id: 1,
        name: "Tu Restaurante",
        username: "usuario",
        password: "123",
        rating: 5.0,
        time: "20-30 min",
        deliveryFee: 20,
        image: "URL_DE_IMAGEN",
        categories: ["Categoria1", "Categoria2"],
        menu: []
    }
]);
```

---

## 🐛 Solución de Problemas

### El servidor no inicia

```bash
# Limpiar node_modules
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Puerto 5173 ocupado

```bash
# Vite buscará automáticamente otro puerto
# O especifica uno manualmente en vite.config.js
```

### Errores de ESLint

```bash
npm run lint
# Revisar y corregir errores mostrados
```

---

## 📚 Documentación Completa

- **[README.md](README.md)** - Documentación principal
- **[PLAN_DE_PRUEBAS.md](PLAN_DE_PRUEBAS.md)** - Guía de testing
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guía de contribución
- **[MEJORAS_DELIVERY_WHATSAPP.md](MEJORAS_DELIVERY_WHATSAPP.md)** - Geolocalización

---

## 🆘 Ayuda

¿Problemas? 

1. Revisa la [documentación](README.md)
2. Busca en [issues](https://github.com/tu-usuario/tlapa-comida/issues)
3. Crea un nuevo issue

---

## 🎉 ¡Listo para Desarrollar!

Ahora tienes todo configurado. Explora el código y empieza a contribuir! 🚀

**Happy Coding! 💻**
