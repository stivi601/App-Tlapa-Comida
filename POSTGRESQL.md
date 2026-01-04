# 🗄️ Configuración de PostgreSQL Local - Tlapa Comida

## ✅ Estado Actual

PostgreSQL 15 está instalado y configurado correctamente.

### Información de la Base de Datos

- **Host**: `localhost`
- **Puerto**: `5432`
- **Base de Datos**: `tlapa_comida_dev`
- **Usuario**: `adrianmendoza` (sin contraseña requerida)
- **DATABASE_URL**: `postgresql://adrianmendoza@localhost:5432/tlapa_comida_dev`

### Datos de Prueba Cargados

✅ **Usuario Admin**
- Username: `admin`
- Password: `admin123`
- Role: `ADMIN`

✅ **Restaurantes Creados**
1. Tacos El Paisa (username: `paisa`)
2. Burger King Tlapa (username: `bk`)
3. Pizza Hut (username: `pizza`)

✅ **Repartidor**
- Nombre: Carlos Veloz
- Username: `carlos`
- Password: `123`

---

## 🚀 Comandos Útiles

### Gestión de PostgreSQL

Usa el script `postgres.sh` para gestionar PostgreSQL:

```bash
# Iniciar PostgreSQL
./postgres.sh start

# Detener PostgreSQL
./postgres.sh stop

# Ver estado
./postgres.sh status

# Reiniciar
./postgres.sh restart

# Abrir consola PostgreSQL
./postgres.sh psql

# Reiniciar base de datos (borra todos los datos)
./postgres.sh reset
```

### Comandos Manuales

```bash
# Iniciar PostgreSQL manualmente
/usr/local/opt/postgresql@15/bin/pg_ctl -D /usr/local/var/postgresql@15 start

# Detener PostgreSQL
/usr/local/opt/postgresql@15/bin/pg_ctl -D /usr/local/var/postgresql@15 stop

# Conectar a la base de datos
/usr/local/opt/postgresql@15/bin/psql -d tlapa_comida_dev

# Listar bases de datos
/usr/local/opt/postgresql@15/bin/psql -l
```

---

## 🔧 Comandos de Prisma

### Migraciones

```bash
cd backend

# Crear y aplicar una nueva migración
npx prisma migrate dev --name nombre_de_migracion

# Aplicar migraciones pendientes
npx prisma migrate deploy

# Ver estado de migraciones
npx prisma migrate status
```

### Gestión de Datos

```bash
# Ejecutar seed (poblar con datos de prueba)
npx prisma db seed

# Generar cliente de Prisma
npx prisma generate

# Abrir Prisma Studio (interfaz visual para la BD)
npx prisma studio
```

### Reset de Base de Datos

```bash
# Borrar y recrear toda la base de datos
npx prisma migrate reset
```

---

## 📝 Archivo `.env`

El archivo `backend/.env` debe contener:

```env
PORT=3000
DATABASE_URL="postgresql://adrianmendoza@localhost:5432/tlapa_comida_dev"
JWT_SECRET="secret_development_key"
```

---

## 🏗️ Estructura de Tablas Creadas

- `users` - Usuarios del sistema (clientes, admins)
- `addresses` - Direcciones de entrega
- `restaurants` - Restaurantes registrados
- `menu_items` - Elementos del menú de cada restaurante
- `orders` - Pedidos realizados
- `order_items` - Ítems de cada pedido
- `delivery_riders` - Repartidores
- `reviews` - Reseñas de pedidos
- `notifications` - Notificaciones del sistema
- `_prisma_migrations` - Historial de migraciones

---

## 🔍 Consultas SQL Útiles

```sql
-- Ver todos los usuarios
SELECT id, name, username, role FROM users;

-- Ver todos los restaurantes
SELECT id, name, username, rating FROM restaurants;

-- Ver todos los repartidores
SELECT id, name, username, is_online FROM delivery_riders;

-- Ver items del menú de un restaurante
SELECT mi.name, mi.price, mi.category, r.name as restaurant
FROM menu_items mi
JOIN restaurants r ON mi.restaurant_id = r.id;

-- Ver todos los pedidos
SELECT o.id, u.name as customer, r.name as restaurant, o.status, o.total
FROM orders o
JOIN users u ON o.customer_id = u.id
JOIN restaurants r ON o.restaurant_id = r.id;
```

---

## ⚠️ Notas Importantes

1. **PostgreSQL debe estar corriendo** antes de iniciar el backend
2. Verifica que PostgreSQL esté corriendo con: `./postgres.sh status`
3. Si tienes problemas de conexión, reinicia PostgreSQL: `./postgres.sh restart`
4. La base de datos local es solo para desarrollo
5. En producción (Render), se usa una base de datos PostgreSQL diferente

---

## 🐛 Solución de Problemas

### Error: "Connection refused"
```bash
# PostgreSQL no está corriendo, inícialo:
./postgres.sh start
```

### Error: "Database does not exist"
```bash
# Crea la base de datos:
/usr/local/opt/postgresql@15/bin/createdb tlapa_comida_dev

# Ejecuta las migraciones:
cd backend && npx prisma migrate dev --name init
```

### Error: "Role does not exist"
```bash
# Verifica el usuario en el DATABASE_URL del archivo .env
# Debe ser: adrianmendoza (tu usuario de macOS)
```

### Reiniciar todo desde cero
```bash
# Detener PostgreSQL
./postgres.sh stop

# Borrar la base de datos
/usr/local/opt/postgresql@15/bin/dropdb tlapa_comida_dev

# Iniciar PostgreSQL
./postgres.sh start

# Crear nueva base de datos
/usr/local/opt/postgresql@15/bin/createdb tlapa_comida_dev

# Ejecutar migraciones
cd backend && npx prisma migrate dev --name init

# Cargar datos de prueba
npx prisma db seed
```

---

## 🌐 Diferencias entre Desarrollo y Producción

| Aspecto | Desarrollo (Local) | Producción (Render) |
|---------|-------------------|---------------------|
| Host | localhost | Render PostgreSQL host |
| Puerto | 5432 | 5432 |
| BD | tlapa_comida_dev | tlapa_comida (o similar) |
| Usuario | adrianmendoza | Usuario de Render |
| SSL | No requerido | Requerido |

Para producción, usa la URL de conexión que Render proporciona.
