# 🍕 Backend - Tlapa Comida API

API REST para la plataforma de delivery de comida Tlapa Comida.

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ instalado
- PostgreSQL 14+ instalado y corriendo
- npm o yarn

### Instalación

1. **Instalar dependencias:**
```bash
cd backend
npm install
```

2. **Configurar variables de entorno:**
Crea un archivo `.env` en la carpeta `backend/`:
```env
PORT=3000
DATABASE_URL="postgresql://postgres:admin@localhost:5432/tlapa_comida"
JWT_SECRET="tu_clave_secreta_super_segura_aqui"
```

3. **Crear base de datos:**
```bash
# En PostgreSQL, crear la base de datos
createdb tlapa_comida

# O desde psql:
# CREATE DATABASE tlapa_comida;
```

4. **Ejecutar migraciones:**
```bash
npx prisma migrate dev --name init
```

5. **Generar Prisma Client:**
```bash
npx prisma generate
```

6. **Iniciar servidor:**
```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

---

## 📁 Estructura del Proyecto

```
backend/
├── prisma/
│   ├── schema.prisma      # Esquema de base de datos
│   └── migrations/        # Migraciones de DB
├── src/
│   ├── controllers/       # Lógica de negocio
│   ├── routes/            # Definición de rutas
│   ├── middleware/        # Auth, validación, etc.
│   ├── utils/             # Funciones auxiliares
│   └── config/            # Configuraciones
├── server.js              # Punto de entrada
├── package.json
└── .env
```

---

## 🛠️ Scripts Disponibles

```bash
npm run dev      # Inicia servidor en modo desarrollo (con watch)
npm start        # Inicia servidor en modo producción
npx prisma studio # Abre GUI para ver/editar datos
```

---

## 📡 Endpoints Principales

### Health Check
```
GET /              → Estado del servidor
GET /api/health    → Estado de conexión a DB
```

### Autenticación
```
POST /api/auth/register    → Registrar nuevo usuario
POST /api/auth/login       → Iniciar sesión
GET  /api/auth/me          → Obtener perfil (requiere token)
```

### Restaurantes
```
GET  /api/restaurants      → Listar todos los restaurantes
GET  /api/restaurants/:id  → Obtener restaurante específico
```

### Pedidos
```
POST  /api/orders          → Crear nuevo pedido
GET   /api/orders          → Listar pedidos del usuario
PATCH /api/orders/:id      → Actualizar estado del pedido
```

---

## 🔐 Autenticación

La API usa JWT (JSON Web Tokens). Para acceder a rutas protegidas:

1. Obtén un token haciendo login:
```bash
POST /api/auth/login
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

2. Incluye el token en el header de tus peticiones:
```
Authorization: Bearer <tu_token_aqui>
```

---

## 🗄️ Base de Datos

### Ver datos en Prisma Studio
```bash
npx prisma studio
```

### Resetear base de datos (CUIDADO: borra todo)
```bash
npx prisma migrate reset
```

### Crear nueva migración
```bash
npx prisma migrate dev --name nombre_de_la_migracion
```

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"
- Verifica que PostgreSQL esté corriendo
- Verifica que la URL en `.env` sea correcta
- Verifica que la base de datos exista

### Error: "Prisma Client not generated"
```bash
npx prisma generate
```

### Error de permisos en PostgreSQL
```bash
# Dar permisos al usuario
GRANT ALL PRIVILEGES ON DATABASE tlapa_comida TO tu_usuario;
```

---

## 📚 Documentación Adicional

- [ARQUITECTURA.md](./ARQUITECTURA.md) - Diseño completo del sistema
- [Prisma Docs](https://www.prisma.io/docs)
- [Express Docs](https://expressjs.com/)

---

## 🚀 Próximos Pasos

1. Implementar endpoints de autenticación
2. Crear middleware de validación
3. Implementar CRUD completo de todas las entidades
4. Agregar tests unitarios
5. Configurar CI/CD
6. Desplegar en Railway/Render

---

**Estado Actual:** ✅ Estructura base creada, esquema de DB definido
**Siguiente:** Implementar autenticación y endpoints básicos
