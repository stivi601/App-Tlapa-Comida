# Plan de Pruebas - Tlapa Comida App

## Estado del Servidor
✅ El servidor de desarrollo está corriendo en: http://localhost:5175/

## Correcciones Realizadas
1. ✅ Agregado el icono `Camera` a las importaciones de CustomerApp.jsx
2. ✅ Función `updateOrder` implementada en AppContext para guardar calificaciones
3. ✅ Función `updateCustomerUser` implementada para actualizar foto de perfil

---

## PLAN DE PRUEBAS COMPLETO

### 1. CUSTOMER APP (Aplicación de Cliente)

#### 1.1 Registro y Login
- [ ] Ir a http://localhost:5175/
- [ ] Click en "Cliente"
- [ ] Verificar pantalla de login/registro
- [ ] Probar login con: juan@example.com
- [ ] Verificar que ingresa correctamente

#### 1.2 Perfil y Foto
- [ ] Click en tab "Perfil" (ícono de usuario abajo)
- [ ] Verificar que aparece el ícono de cámara en la esquina del avatar
- [ ] Click en el ícono de cámara
- [ ] Seleccionar una imagen
- [ ] Verificar que la imagen se muestra correctamente

#### 1.3 Navegación de Restaurantes
- [ ] Click en tab "Inicio"
- [ ] Verificar que aparecen los restaurantes
- [ ] Probar filtros de categorías (Tacos, Pizzas, etc.)
- [ ] Verificar búsqueda de restaurantes

#### 1.4 Agregar al Carrito
- [ ] Click en "Tacos El Paisa"
- [ ] Verificar que aparece el menú
- [ ] Click en botón "+" en "Combo Especial" (2 veces)
- [ ] Verificar que muestra "2" en el contador
- [ ] Verificar animación scale-up
- [ ] Click en botón "-" una vez
- [ ] Verificar que baja a "1"

#### 1.5 Carrito y Pedido
- [ ] Click en tab "Carrito"
- [ ] Verificar items con cantidades correctas
- [ ] Verificar total calculado correctamente
- [ ] Probar botones +/- en el carrito
- [ ] Click en "Confirmar Pedido"
- [ ] Verificar que se limpia el carrito

#### 1.6 Mis Pedidos
- [ ] Click en tab "Pedidos"
- [ ] Verificar que aparece el pedido nuevo con estado "Pendiente"
- [ ] Verificar que muestra el total correcto

#### 1.7 Direcciones
- [ ] Ir a "Perfil"
- [ ] Verificar direcciones guardadas
- [ ] Click en "Agregar Dirección"
- [ ] Llenar formulario y guardar
- [ ] Click en "Editar" en una dirección existente
- [ ] Modificar y guardar
- [ ] Verificar cambios

---

### 2. RESTAURANT APP (Aplicación de Restaurante)

#### 2.1 Login
- [ ] Ir a http://localhost:5175/
- [ ] Click en "Restaurante"
- [ ] Login: paisa / 123
- [ ] Verificar ingreso exitoso

#### 2.2 Gestión de Pedidos
- [ ] Verificar que aparece el pedido de Juan Perez
- [ ] Click en "Aceptar Pedido"
- [ ] Verificar cambio de estado a "Preparando"
- [ ] Click en "Listo para Recoger"
- [ ] Verificar cambio de estado a "ready"

#### 2.3 Gestión de Menú
- [ ] Click en tab "Menú"
- [ ] Verificar items existentes
- [ ] Click en "Agregar Platillo"
- [ ] Llenar formulario (nombre, precio, categoría, descripción)
- [ ] Subir imagen (opcional)
- [ ] Guardar
- [ ] Verificar que aparece en la lista
- [ ] Probar eliminar un item
- [ ] Probar eliminar una categoría completa

---

### 3. DELIVERY APP (Aplicación de Repartidor)

#### 3.1 Login
- [ ] Ir a http://localhost:5175/
- [ ] Click en "Repartidor"
- [ ] Login: carlos / 123
- [ ] Verificar ingreso exitoso

#### 3.2 Perfil
- [ ] Click en tab "Perfil"
- [ ] Verificar información del repartidor
- [ ] Verificar contador de entregas totales
- [ ] Click en ícono de cámara
- [ ] Subir foto de perfil
- [ ] Verificar que se actualiza

#### 3.3 Gestión de Entregas
- [ ] Click en tab "Pedidos"
- [ ] Verificar botón ONLINE/OFFLINE
- [ ] Asegurarse de estar ONLINE
- [ ] Verificar que aparece el pedido "Listo para Recoger"
- [ ] Click en "Recoger Pedido"
- [ ] Verificar cambio a estado "En Camino"
- [ ] Click en "Marcar como Entregado"
- [ ] Verificar que desaparece de la lista
- [ ] Ir a "Perfil" y verificar que aumentó el contador de entregas

#### 3.4 Asignación de Restaurante
- [ ] Si el repartidor está asignado a un restaurante específico
- [ ] Verificar que SOLO ve pedidos de ese restaurante
- [ ] Si no está asignado, debe ver pedidos de todos los restaurantes

---

### 4. ADMIN APP (Panel de Administración)

#### 4.1 Dashboard
- [ ] Ir a http://localhost:5175/
- [ ] Click en "Admin"
- [ ] Verificar estadísticas:
  - Total de ventas
  - Pedidos activos
  - Restaurantes registrados
  - Usuarios registrados

#### 4.2 Gestión de Usuarios
- [ ] Click en "Usuarios" en el sidebar
- [ ] Verificar lista de usuarios registrados
- [ ] Usar barra de búsqueda (por nombre, email, teléfono)
- [ ] Verificar que filtra correctamente

#### 4.3 Gestión de Restaurantes
- [ ] Click en "Restaurantes"
- [ ] Usar barra de búsqueda
- [ ] Click en "Agregar Restaurante"
- [ ] Llenar formulario:
  - Nombre
  - Usuario
  - Contraseña
  - Categorías (seleccionar múltiples)
  - Imagen (opcional)
- [ ] Guardar
- [ ] Verificar que aparece en la lista
- [ ] Click en "Editar" en un restaurante
- [ ] Modificar datos
- [ ] Guardar cambios
- [ ] Click en "Eliminar"
- [ ] Confirmar eliminación

#### 4.4 Gestión de Repartidores
- [ ] Click en "Repartidores"
- [ ] Usar barra de búsqueda (por nombre o RFC)
- [ ] Click en "Nuevo Repartidor"
- [ ] Llenar formulario:
  - Nombre
  - Usuario
  - Contraseña
  - Teléfono
  - Email
  - Dirección
  - RFC
  - Asignar Restaurante (opcional)
- [ ] Guardar
- [ ] Verificar que aparece en la tabla
- [ ] Verificar columna "Asignado a"
- [ ] Click en "Editar"
- [ ] Cambiar restaurante asignado
- [ ] Guardar cambios
- [ ] Verificar actualización en la tabla

#### 4.5 Categorías
- [ ] Click en "Categorías"
- [ ] Agregar nueva categoría
- [ ] Verificar que aparece en la lista
- [ ] Eliminar una categoría
- [ ] Verificar que se elimina

#### 4.6 Notificaciones
- [ ] Click en "Notificaciones"
- [ ] Llenar formulario:
  - Título
  - Mensaje
- [ ] Click en "Enviar Notificación Masiva"
- [ ] Verificar mensaje de confirmación
- [ ] Ir a Customer App
- [ ] Click en ícono de campana
- [ ] Verificar que aparece la notificación

---

### 5. FLUJO COMPLETO (End-to-End)

#### 5.1 Flujo de Pedido Completo
1. **Cliente:**
   - [ ] Login como cliente
   - [ ] Seleccionar restaurante
   - [ ] Agregar items al carrito
   - [ ] Confirmar pedido
   - [ ] Verificar en "Mis Pedidos" (estado: Pendiente)

2. **Restaurante:**
   - [ ] Login como restaurante
   - [ ] Ver pedido nuevo
   - [ ] Aceptar pedido (estado: Preparando)
   - [ ] Marcar como "Listo para Recoger" (estado: ready)

3. **Repartidor:**
   - [ ] Login como repartidor
   - [ ] Estar ONLINE
   - [ ] Ver pedido disponible
   - [ ] Recoger pedido (estado: delivering)
   - [ ] Marcar como entregado (estado: completed)

4. **Cliente (Calificación):**
   - [ ] Ir a "Mis Pedidos"
   - [ ] Verificar pedido "Entregado"
   - [ ] Click en "Calificar"
   - [ ] Seleccionar 5 estrellas
   - [ ] Click en "Enviar Calificación"
   - [ ] Verificar que aparece "Tu calificación: 5 ⭐"
   - [ ] Ir a "Inicio"
   - [ ] Verificar que el rating del restaurante se actualizó

---

## ERRORES CONOCIDOS Y SOLUCIONES

### ✅ Corregidos:
1. **Falta icono Camera en CustomerApp** - CORREGIDO
2. **Calificaciones no se guardan** - CORREGIDO (función updateOrder)
3. **Foto de perfil no funciona** - CORREGIDO (función updateCustomerUser)

### Posibles Mejoras Futuras:
1. Validación de formularios más robusta
2. Mensajes de error más descriptivos
3. Confirmación antes de eliminar items
4. Persistencia de datos (localStorage o backend real)
5. Autenticación real con tokens
6. Integración con pasarela de pagos
7. Notificaciones push reales
8. Geolocalización para repartidores

---

## CHECKLIST DE FUNCIONALIDADES PRINCIPALES

### Customer App
- [x] Login/Registro
- [x] Foto de perfil con cámara
- [x] Navegación de restaurantes
- [x] Filtros de categorías
- [x] Búsqueda de restaurantes
- [x] Agregar items con +/-
- [x] Animaciones en items
- [x] Carrito con cantidades
- [x] Confirmar pedido
- [x] Ver historial de pedidos
- [x] Calificar pedidos completados
- [x] Gestión de direcciones
- [x] Editar direcciones
- [x] Ver notificaciones

### Restaurant App
- [x] Login
- [x] Ver pedidos entrantes
- [x] Aceptar/rechazar pedidos
- [x] Cambiar estado de pedidos
- [x] Agregar items al menú
- [x] Subir imágenes de platillos
- [x] Eliminar items del menú
- [x] Gestión de categorías de menú

### Delivery App
- [x] Login
- [x] Foto de perfil
- [x] Estado ONLINE/OFFLINE
- [x] Ver pedidos disponibles
- [x] Filtrado por restaurante asignado
- [x] Recoger pedidos
- [x] Marcar como entregado
- [x] Contador de entregas totales

### Admin App
- [x] Dashboard con estadísticas
- [x] Gestión de usuarios
- [x] Búsqueda de usuarios
- [x] Gestión de restaurantes
- [x] Búsqueda de restaurantes
- [x] Editar restaurantes
- [x] Eliminar restaurantes
- [x] Gestión de repartidores
- [x] Búsqueda de repartidores
- [x] Editar repartidores
- [x] Asignar restaurantes a repartidores
- [x] Gestión de categorías
- [x] Envío de notificaciones masivas

---

## NOTAS FINALES

- La aplicación usa datos mock (simulados) que se resetean al recargar la página
- Para producción se necesitaría un backend real con base de datos
- Las imágenes subidas son URLs temporales (blob URLs)
- Los pagos son simulados, no hay integración real
- La geolocalización no está implementada

**Estado General: ✅ FUNCIONAL Y LISTO PARA PRUEBAS**
