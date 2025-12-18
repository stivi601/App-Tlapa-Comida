# 🏗️ Arquitectura del Backend - Tlapa Comida

## 📊 Stack Tecnológico

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma
- **Autenticación:** JWT (JSON Web Tokens)
- **Validación:** Express Validator
- **Seguridad:** bcrypt, helmet, cors

---

## 🗄️ Esquema de Base de Datos

### Tablas Principales

#### 1. **users** (Clientes)
```sql
- id (UUID)
- email (único)
- phone (único, opcional)
- password (hash bcrypt)
- name
- image (URL)
- role (CUSTOMER | ADMIN)
- createdAt, updatedAt
```

#### 2. **restaurants**
```sql
- id (UUID)
- username (único, para login)
- password (hash bcrypt)
- name
- image (URL)
- rating (Float)
- time (String: "20-30 min")
- deliveryFee (Float)
- categories (Array de strings)
- createdAt, updatedAt
```

#### 3. **menu_items**
```sql
- id (UUID)
- name
- description
- price (Float)
- category
- image (URL)
- restaurantId (FK -> restaurants)
- createdAt
```

#### 4. **orders**
```sql
- id (UUID)
- customerId (FK -> users)
- restaurantId (FK -> restaurants)
- riderId (FK -> delivery_riders, nullable)
- status (PENDING | PREPARING | READY | DELIVERING | COMPLETED | CANCELLED)
- total (Float)
- rating (1-5, nullable)
- createdAt, updatedAt
```

#### 5. **order_items**
```sql
- id (UUID)
- orderId (FK -> orders)
- menuItemId (FK -> menu_items)
- quantity (Int)
- price (Float, precio al momento del pedido)
```

#### 6. **delivery_riders**
```sql
- id (UUID)
- username (único)
- password (hash bcrypt)
- name
- phone
- rfc (opcional)
- image (URL)
- totalDeliveries (Int)
- isOnline (Boolean)
- assignedRestaurantId (FK -> restaurants, nullable)
- createdAt, updatedAt
```

#### 7. **addresses**
```sql
- id (UUID)
- label (String: "Casa", "Trabajo")
- address (String)
- userId (FK -> users)
- createdAt
```

#### 8. **notifications**
```sql
- id (UUID)
- title
- message
- date
```

---

## 🔐 Sistema de Autenticación

### Flujo de Login
1. Cliente envía `email` y `password`
2. Backend busca usuario en DB
3. Compara password con bcrypt
4. Genera JWT con payload: `{ userId, role }`
5. Retorna token al cliente
6. Cliente guarda token en localStorage
7. Cliente envía token en header `Authorization: Bearer <token>` en cada petición

### Endpoints de Auth
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me (requiere token)
```

---

## 📡 API Endpoints

### **Usuarios (Clientes)**
```
POST   /api/users/register
POST   /api/users/login
GET    /api/users/profile (auth)
PUT    /api/users/profile (auth)
POST   /api/users/addresses (auth)
GET    /api/users/addresses (auth)
DELETE /api/users/addresses/:id (auth)
```

### **Restaurantes**
```
GET    /api/restaurants (público)
GET    /api/restaurants/:id (público)
POST   /api/restaurants/login
GET    /api/restaurants/menu/:id (público)
POST   /api/restaurants/menu (auth restaurante)
DELETE /api/restaurants/menu/:itemId (auth restaurante)
```

### **Pedidos**
```
POST   /api/orders (auth cliente)
GET    /api/orders (auth - filtrado por rol)
GET    /api/orders/:id (auth)
PATCH  /api/orders/:id/status (auth restaurante/repartidor)
POST   /api/orders/:id/rating (auth cliente)
DELETE /api/orders/:id (auth cliente, solo si pending)
```

### **Repartidores**
```
POST   /api/delivery/login
GET    /api/delivery/orders (auth repartidor)
PATCH  /api/delivery/status (auth - toggle online/offline)
PATCH  /api/delivery/orders/:id/pickup (auth)
PATCH  /api/delivery/orders/:id/complete (auth)
```

### **Admin**
```
GET    /api/admin/stats (auth admin)
GET    /api/admin/users (auth admin)
POST   /api/admin/restaurants (auth admin)
PUT    /api/admin/restaurants/:id (auth admin)
DELETE /api/admin/restaurants/:id (auth admin)
POST   /api/admin/riders (auth admin)
PUT    /api/admin/riders/:id (auth admin)
POST   /api/admin/notifications (auth admin)
```

---

## 🚀 Próximos Pasos de Implementación

### Fase 1: Configuración Base ✅
- [x] Inicializar proyecto Node.js
- [x] Instalar dependencias (express, cors, dotenv, pg)
- [x] Crear servidor básico
- [x] Instalar Prisma
- [x] Crear esquema de base de datos

### Fase 2: Base de Datos (SIGUIENTE)
- [ ] Instalar PostgreSQL localmente o usar servicio cloud
- [ ] Ejecutar `npx prisma migrate dev` para crear tablas
- [ ] Generar Prisma Client
- [ ] Crear seeds (datos iniciales de prueba)

### Fase 3: Autenticación
- [ ] Instalar bcrypt y jsonwebtoken
- [ ] Crear middleware de autenticación
- [ ] Implementar endpoints de registro/login
- [ ] Proteger rutas con middleware

### Fase 4: CRUD Básico
- [ ] Implementar endpoints de usuarios
- [ ] Implementar endpoints de restaurantes
- [ ] Implementar endpoints de pedidos
- [ ] Implementar endpoints de repartidores

### Fase 5: Lógica de Negocio
- [ ] Sistema de estados de pedidos
- [ ] Asignación automática de repartidores
- [ ] Cálculo de totales y comisiones
- [ ] Sistema de calificaciones

### Fase 6: Integración Frontend
- [ ] Actualizar AppContext para usar API real
- [ ] Reemplazar datos mock por llamadas fetch/axios
- [ ] Implementar manejo de errores
- [ ] Agregar loading states

### Fase 7: Despliegue
- [ ] Configurar variables de entorno de producción
- [ ] Desplegar base de datos (Supabase/Railway)
- [ ] Desplegar backend (Railway/Render)
- [ ] Conectar frontend con backend en producción

---

## 💾 Comandos Útiles de Prisma

```bash
# Crear migración y aplicar cambios a la DB
npx prisma migrate dev --name init

# Generar Prisma Client (después de cambios en schema)
npx prisma generate

# Abrir Prisma Studio (GUI para ver/editar datos)
npx prisma studio

# Resetear base de datos (CUIDADO: borra todo)
npx prisma migrate reset

# Crear seed data
npx prisma db seed
```

---

## 🔒 Variables de Entorno Requeridas

```env
# Backend/.env
PORT=3000
DATABASE_URL="postgresql://usuario:password@localhost:5432/tlapa_comida"
JWT_SECRET="clave_super_secreta_minimo_32_caracteres"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
```

---

## 📦 Dependencias Adicionales Necesarias

```bash
# Autenticación y seguridad
npm install bcryptjs jsonwebtoken
npm install helmet express-rate-limit

# Validación
npm install express-validator

# Utilidades
npm install morgan  # Logging de peticiones
```

---

**Siguiente Acción Recomendada:**
Instalar PostgreSQL y ejecutar la primera migración para crear las tablas en la base de datos.
