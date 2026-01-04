# 🧪 Guía de Pruebas - Frontend Tlapa Comida

## ✅ Estado Actual del Sistema

### Servicios Corriendo:

1. ✅ **PostgreSQL** - `localhost:5432`
2. ✅ **Backend API** - `http://localhost:3000`
3. ✅ **Frontend (Vite)** - `http://localhost:5173`

---

## 🎯 Cómo Probar la Aplicación

### 1️⃣ Abrir la Aplicación en el Navegador

Abre tu navegador favorito (Chrome, Safari, Firefox) y ve a:

```
http://localhost:5173
```

Deberías ver la página principal de **Tlapa Comida** con restaurantes disponibles.

---

## 🔍 Pruebas que Debes Realizar

### **PRUEBA 1: Ver Restaurantes**

1. Abre http://localhost:5173
2. Deberías ver una lista de restaurantes:
   - Tacos El Paisa
   - Burger King Tlapa
   - Pizza Hut
3. Verifica que las imágenes se carguen correctamente
4. Verifica que se muestren los ratings y tiempos de entrega

**✅ Resultado esperado:** Lista de restaurantes con toda su información

---

### **PRUEBA 2: Login de Admin**

1. Ve a http://localhost:5173 y busca el botón de **Admin** o **Login**
2. Ingresa las credenciales:
   - **Username:** `admin`
   - **Password:** `admin123`
3. Click en "Iniciar Sesión"

**✅ Resultado esperado:** Deberías entrar al panel de administración

**Panel de Admin debe mostrar:**
- Resumen de pedidos
- Lista de restaurantes
- Gestión de usuarios
- Estadísticas

---

### **PRUEBA 3: Ver Menú de un Restaurante**

1. Desde la página principal
2. Click en cualquier restaurante (ej: "Tacos El Paisa")
3. Deberías ver el menú completo con:
   - Orden de Pastor - $65
   - Gringa - $45
   - Horchata - $25

**✅ Resultado esperado:** Menú completo del restaurante con precios e imágenes

---

### **PRUEBA 4: Agregar al Carrito** (si está implementado)

1. Selecciona items del menú
2. Click en "Agregar al Carrito"
3. Verifica que el contador del carrito aumente

**✅ Resultado esperado:** Items se agregan correctamente

---

### **PRUEBA 5: Login de Repartidor** (si está implementado)

1. Ve a la sección de repartidores
2. Ingresa:
   - **Username:** `carlos`
   - **Password:** `123`

**✅ Resultado esperado:** Acceso al panel de repartidor

---

## 🐛 Problemas Comunes y Soluciones

### ❌ "No se pueden cargar los restaurantes"

**Causa:** El backend no está corriendo o hay un error de conexión

**Solución:**
```bash
# Verifica que el backend esté corriendo
# Deberías tener una terminal con:
# "🚀 Servidor corriendo en: http://localhost:3000"

# Si no está corriendo:
cd /Users/adrianmendoza/Documents/UBEREATS-TLAPA/App-Tlapa-Comida/backend
npm run dev
```

---

### ❌ Error de CORS

**Causa:** Problemas de comunicación entre frontend y backend

**Solución:**
1. Verifica que el backend tenga CORS habilitado (ya está configurado)
2. Reinicia el backend:
   - Presiona `Ctrl+C` en la terminal del backend
   - Ejecuta `npm run dev` nuevamente

---

### ❌ "Database connection error"

**Causa:** PostgreSQL no está corriendo

**Solución:**
```bash
cd /Users/adrianmendoza/Documents/UBEREATS-TLAPA/App-Tlapa-Comida
./postgres.sh status

# Si no está corriendo:
./postgres.sh start
```

---

### ❌ El frontend muestra página en blanco

**Causa:** Errores de JavaScript en el navegador

**Solución:**
1. Abre la **Consola del Navegador** (F12 o Cmd+Option+I)
2. Ve a la pestaña **Console**
3. Busca errores en rojo
4. Copia el error y analízalo

**Errores comunes:**
- Si dice `Failed to fetch`: El backend no está corriendo
- Si dice `Unauthorized`: Problemas con el token de autenticación
- Si dice `404`: La ruta del API no existe

---

## 🧪 Pruebas con curl (desde Terminal)

Si el navegador no funciona, puedes probar los endpoints con curl:

### Obtener Restaurantes
```bash
curl http://localhost:3000/api/restaurants
```

### Login de Admin
```bash
curl -X POST http://localhost:3000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Login de Restaurante
```bash
curl -X POST http://localhost:3000/api/auth/restaurant/login \
  -H "Content-Type: application/json" \
  -d '{"username":"paisa","password":"123"}'
```

### Health Check
```bash
curl http://localhost:3000/api/health
```

---

## 📊 Verificación Completa del Sistema

Ejecuta este script para verificar que todo funciona:

```bash
#!/bin/bash

echo "🔍 Verificando Sistema Tlapa Comida..."
echo ""

# 1. PostgreSQL
echo "1️⃣ PostgreSQL:"
./postgres.sh status | grep "running" && echo "  ✅ Corriendo" || echo "  ❌ No está corriendo"
echo ""

# 2. Backend
echo "2️⃣ Backend API:"
curl -s http://localhost:3000/ | grep "funcionando" && echo "  ✅ Respondiendo" || echo "  ❌ No responde"
echo ""

# 3. Frontend
echo "3️⃣ Frontend:"
curl -s http://localhost:5173 | grep "app-tlapa-comida" && echo "  ✅ Activo" || echo "  ❌ No activo"
echo ""

# 4. Base de Datos
echo "4️⃣ Datos en Base de Datos:"
curl -s http://localhost:3000/api/restaurants | grep "Tacos El Paisa" && echo "  ✅ Datos cargados" || echo "  ❌ Sin datos"
echo ""

# 5. Login Admin
echo "5️⃣ Login de Admin:"
curl -s -X POST http://localhost:3000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | grep "token" && echo "  ✅ Funcionando" || echo "  ❌ No funciona"
echo ""

echo "✨ Verificación completa!"
```

Guarda esto como `verificar-sistema.sh`, dale permisos y ejecútalo:

```bash
chmod +x verificar-sistema.sh
./verificar-sistema.sh
```

---

## 🚀 URLs Importantes

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend | http://localhost:5173 | Aplicación web principal |
| Backend API | http://localhost:3000 | API REST |
| API Health | http://localhost:3000/api/health | Estado del servidor |
| API Restaurantes | http://localhost:3000/api/restaurants | Lista de restaurantes |
| PostgreSQL | localhost:5432 | Base de datos |

---

## 🎨 Explorando la Interfaz

### Página Principal
- Lista de restaurantes disponibles
- Búsqueda y filtros
- Carrito de compras

### Panel de Admin
- Dashboard con estadísticas
- Gestión de restaurantes
- Gestión de pedidos
- Usuarios registrados

### Panel de Restaurante
- Ver pedidos entrantes
- Actualizar menú
- Estadísticas del restaurante

### Panel de Repartidor
- Ver pedidos asignados
- Actualizar estado de entrega
- Mapa de entregas

---

## 💡 Consejos para Desarrollo

1. **Usa dos navegadores o ventanas de incógnito** para probar diferentes roles simultáneamente (Admin en una, Cliente en otra)

2. **Mantén la consola del navegador abierta** (F12) para ver errores en tiempo real

3. **Usa las DevTools del navegador** para:
   - Ver requests al API (pestaña Network)
   - Debuggear JavaScript (pestaña Console)
   - Inspeccionar el estado de React (con React DevTools)

4. **Recarga con Ctrl+Shift+R** para limpiar el caché si algo no se actualiza

---

## 🔑 Credenciales de Prueba

### Admin
```
Username: admin
Password: admin123
Endpoint: POST /api/auth/admin/login
```

### Restaurante - Tacos El Paisa
```
Username: paisa
Password: 123
Endpoint: POST /api/auth/restaurant/login
```

### Repartidor
```
Username: carlos
Password: 123
Endpoint: POST /api/auth/delivery/login (si existe)
```

---

## ✅ Checklist de Pruebas

- [ ] Frontend carga correctamente en http://localhost:5173
- [ ] Se muestran los 3 restaurantes
- [ ] Puedo ver el menú de un restaurante
- [ ] Login de admin funciona
- [ ] Panel de admin muestra información
- [ ] Login de restaurante funciona
- [ ] Carrito funciona (si está implementado)
- [ ] Sin errores en la consola del navegador
- [ ] Backend responde correctamente
- [ ] PostgreSQL está corriendo

---

¡Buena suerte con las pruebas! 🎉
