# 🚀 Guía Rápida - Tlapa Comida

## 📍 ¿Dónde ejecutar los comandos?

**IMPORTANTE:** Todos estos comandos se ejecutan en la **Terminal** dentro del directorio raíz del proyecto:

```bash
/Users/adrianmendoza/Documents/UBEREATS-TLAPA/App-Tlapa-Comida
```

## 🎯 Cómo abrir la Terminal en este directorio

### Opción 1: Desde VS Code
1. Abre VS Code
2. Abre el proyecto `App-Tlapa-Comida`
3. Presiona **`` Ctrl + ` ``** (o ve a Terminal → New Terminal)
4. La terminal se abrirá automáticamente en el directorio del proyecto

### Opción 2: Desde Finder
1. Abre Finder
2. Navega a `/Users/adrianmendoza/Documents/UBEREATS-TLAPA/App-Tlapa-Comida`
3. Haz clic derecho en la carpeta
4. Selecciona "Services" → "New Terminal at Folder"

### Opción 3: Usando cd
```bash
# Abre la Terminal y escribe:
cd /Users/adrianmendoza/Documents/UBEREATS-TLAPA/App-Tlapa-Comida
```

---

## ⚡ Comandos Principales

### 🗄️ Gestionar PostgreSQL

```bash
# Ver si PostgreSQL está corriendo
./postgres.sh status

# Iniciar PostgreSQL (si está detenido)
./postgres.sh start

# Detener PostgreSQL
./postgres.sh stop

# Reiniciar PostgreSQL
./postgres.sh restart

# Abrir consola de PostgreSQL
./postgres.sh psql

# Reiniciar base de datos (CUIDADO: borra todos los datos)
./postgres.sh reset
```

### 🚀 Iniciar el Backend

```bash
# Opción 1: Ir al directorio backend
cd backend
npm run dev

# Opción 2: Desde la raíz
cd /Users/adrianmendoza/Documents/UBEREATS-TLAPA/App-Tlapa-Comida/backend && npm run dev
```

### 🎨 Iniciar el Frontend

```bash
# Desde la raíz del proyecto
npm run dev

# O si estás en otra carpeta:
cd /Users/adrianmendoza/Documents/UBEREATS-TLAPA/App-Tlapa-Comida
npm run dev
```

### 🧪 Probar el API

```bash
# Ver todos los restaurantes
curl http://localhost:3000/api/restaurants

# Ver endpoint principal
curl http://localhost:3000/

# Probar login de admin
curl -X POST http://localhost:3000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 📋 Flujo de trabajo típico

### Al iniciar tu día de desarrollo:

1️⃣ **Verificar que PostgreSQL esté corriendo:**
```bash
./postgres.sh status
```

Si no está corriendo:
```bash
./postgres.sh start
```

2️⃣ **Iniciar el backend:**
```bash
cd backend
npm run dev
```
Deberías ver:
```
✅ Conexión a la base de datos exitosa
🚀 Servidor corriendo en: http://localhost:3000
```

3️⃣ **Iniciar el frontend** (en otra terminal):
```bash
npm run dev
```

---

## 🐛 Solución rápida de problemas

### ❌ Error: "Connection refused" al backend
```bash
# PostgreSQL no está corriendo
./postgres.sh start
```

### ❌ Error: "./postgres.sh: Permission denied"
```bash
# Dar permisos de ejecución
chmod +x postgres.sh
```

### ❌ Backend no conecta a la base de datos
```bash
# Verificar que el archivo backend/.env tenga:
# DATABASE_URL="postgresql://adrianmendoza@localhost:5432/tlapa_comida_dev"

# Reiniciar PostgreSQL
./postgres.sh restart

# Reiniciar el backend
# Presiona Ctrl+C en la terminal del backend y vuelve a ejecutar:
cd backend && npm run dev
```

### ❌ Quiero empezar de cero la base de datos
```bash
./postgres.sh reset
# Esto borrará todos los datos y volverá a cargar los datos de prueba
```

---

## 📊 Verificar que todo funciona

Ejecuta estos comandos uno por uno para verificar:

```bash
# 1. PostgreSQL está corriendo
./postgres.sh status
# Debe decir: "server is running"

# 2. Backend está respondiendo
curl http://localhost:3000/
# Debe devolver JSON con el mensaje de bienvenida

# 3. Base de datos tiene datos
curl http://localhost:3000/api/restaurants
# Debe devolver lista de restaurantes

# 4. Login funciona
curl -X POST http://localhost:3000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
# Debe devolver un token
```

Si todos estos comandos funcionan, ¡todo está perfecto! ✅

---

## 💡 Consejos

- **Siempre mantén PostgreSQL corriendo** mientras desarrollas
- **Usa 2 terminales**: Una para el backend, otra para el frontend
- **Consulta `POSTGRESQL.md`** para comandos más avanzados
- **Los datos de prueba** se cargan automáticamente con el seed

---

## 🔑 Credenciales de prueba

**Admin:**
- Username: `admin`
- Password: `admin123`
- URL: http://localhost:3000/api/auth/admin/login

**Restaurante - Tacos El Paisa:**
- Username: `paisa`
- Password: `123`

**Repartidor:**
- Username: `carlos`
- Password: `123`
