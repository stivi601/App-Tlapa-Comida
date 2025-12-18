# Corrección: Pedidos no llegan al Repartidor

## Problema Identificado
Los repartidores no veían pedidos disponibles en su panel.

## Causa Raíz
El DeliveryApp filtra pedidos que están en estado `'ready'` (listos para recoger), pero los pedidos mock iniciales solo tenían estados `'pending'` y `'preparing'`.

## Solución Implementada
Se agregó un pedido de prueba en estado `'ready'` en el AppContext:

```javascript
{ 
  id: 103, 
  customer: "Maria Lopez", 
  restaurant: "Tacos El Paisa", 
  items: "2x Combo Especial, 1x Horchata", 
  total: 225, 
  status: "ready", 
  time: "Hace 2 min" 
}
```

## Flujo de Estados de Pedidos

1. **pending** - Pedido recién creado por el cliente
2. **preparing** - Restaurante aceptó y está preparando
3. **ready** - Restaurante terminó, listo para recoger ← **AQUÍ el repartidor lo ve**
4. **delivering** - Repartidor recogió el pedido
5. **completed** - Pedido entregado al cliente

## Cómo Probar

### Opción 1: Usar el pedido de prueba
1. Ir a http://localhost:5175/
2. Click en "Repartidor"
3. Login: carlos / 123
4. Asegurarse de estar ONLINE
5. Deberías ver el pedido de "Maria Lopez" listo para recoger

### Opción 2: Flujo completo
1. **Como Cliente:**
   - Login en Customer App
   - Hacer un pedido en "Tacos El Paisa"

2. **Como Restaurante:**
   - Login en Restaurant App (paisa / 123)
   - Aceptar el pedido (cambia a "preparing")
   - Click en "Listo para Recoger" (cambia a "ready")

3. **Como Repartidor:**
   - Login en Delivery App (carlos / 123)
   - Estar ONLINE
   - Ahora deberías ver el pedido disponible

## Verificación de Asignación de Restaurantes

El repartidor Carlos NO tiene restaurante asignado, por lo que:
- ✅ Ve pedidos de TODOS los restaurantes que estén en estado "ready"

Si un repartidor tiene `assignedRestaurant: "Tacos El Paisa"`:
- ✅ Solo verá pedidos de "Tacos El Paisa" en estado "ready"
- ❌ NO verá pedidos de otros restaurantes

## Estado Actual
✅ **CORREGIDO** - Los repartidores ahora pueden ver pedidos listos para recoger
