const prisma = require('../utils/prisma');
const { socketEvents } = require('../utils/socketUtils');

/**
 * Crear un nuevo pedido
 * POST /api/orders
 */
const createOrder = async (req, res) => {
    try {
        const { restaurantId, items, total, addressId, deliveryAddress, deliveryLat, deliveryLng } = req.body;
        const { userId, role } = req.user;

        // Solo CUSTOMER puede crear pedidos
        if (role !== 'CUSTOMER' && role !== 'ADMIN') {
            return res.status(403).json({ error: 'Solo los clientes pueden crear pedidos.' });
        }

        // Crear el pedido con sus items en una transacción
        const newOrder = await prisma.order.create({
            data: {
                customerId: userId,
                restaurantId,
                total: parseFloat(total),
                status: 'PENDING',
                // Persistir ubicación de entrega snapshot
                deliveryAddress: deliveryAddress || "Dirección no especificada",
                deliveryLat: deliveryLat ? parseFloat(deliveryLat) : null,
                deliveryLng: deliveryLng ? parseFloat(deliveryLng) : null,

                items: {
                    create: items.map(item => ({
                        menuItemId: item.id,
                        quantity: item.quantity,
                        price: parseFloat(item.price)
                    }))
                }
            },
            include: {
                items: true,
                restaurant: true,
                customer: { select: { name: true, phone: true } }
            }
        });

        // WEBSOCKETS: Notificar
        // 1. Al restaurante
        socketEvents.emitToRestaurant(restaurantId, 'new_order', newOrder);

        // 2. Unir al usuario a la sala del pedido
        socketEvents.emitToUser(userId, 'join_auto_room', newOrder.id);

        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error al crear pedido:', error);
        res.status(500).json({ error: 'Error al procesar el pedido' });
    }
};

/**
 * Obtener pedidos del usuario actual (Cliente, Restaurante o Repartidor)
 * GET /api/orders
 */
const getMyOrders = async (req, res) => {
    try {
        const { userId, role } = req.user;
        let where = {};

        // Filtrar según el rol
        if (role === 'CUSTOMER') {
            where.customerId = userId;
        } else if (role === 'RESTAURANT') {
            where.restaurantId = userId;
        } else if (role === 'DELIVERY_RIDER') {
            where.riderId = userId;
        }

        const orders = await prisma.order.findMany({
            where,
            include: {
                restaurant: true,
                items: {
                    include: {
                        menuItem: true
                    }
                },
                customer: {
                    select: { name: true, phone: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Parsear datos necesarios
        const formattedOrders = orders.map(order => ({
            ...order,
            time: new Date(order.createdAt).toLocaleString(), // Formato simple de fecha
            // status traducido o mantenido igual
        }));

        res.json(formattedOrders);
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ error: 'Error al obtener mis pedidos' });
    }
};

/**
 * Obtener pedidos disponibles para repartidores (Que no tienen rider asignado y están listos/preparando)
 * GET /api/orders/available
 */
const getAvailableOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                status: { in: ['PREPARING', 'READY'] },
                riderId: null
            },
            include: {
                restaurant: true,
                customer: {
                    select: { name: true, phone: true }
                }
            }
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar pedidos disponibles' });
    }
};

/**
 * Actualizar estado del pedido
 * PATCH /api/orders/:id/status
 */
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const { userId, role } = req.user;

        // Buscar la orden para verificar propiedad
        const order = await prisma.order.findUnique({
            where: { id },
            include: { customer: true, restaurant: true, rider: true }
        });

        if (!order) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        // Validaciones de propiedad por rol
        if (role === 'RESTAURANT' && order.restaurantId !== userId) {
            return res.status(403).json({ error: 'No tienes permisos para actualizar este pedido.' });
        }

        if (role === 'DELIVERY_RIDER' && order.riderId !== userId) {
            return res.status(403).json({ error: 'Este pedido no te pertenece.' });
        }

        // Los clientes no pueden actualizar estados (ej. marcar como entregado se hace vía endpoint separado o Admin)
        if (role === 'CUSTOMER') {
            return res.status(403).json({ error: 'Acción no permitida para clientes.' });
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status }
        });

        // WEBSOCKETS: Notificaciones
        // Notificar al cliente
        socketEvents.emitToUser(order.customerId, 'order_status_update', updatedOrder);

        // Si el estado es Preparing/Ready, notificar a conductores disponibles si no tiene rider
        if ((status === 'PREPARING' || status === 'READY') && !order.riderId) {
            socketEvents.broadcastToDrivers('new_order_available', { ...updatedOrder, restaurant: order.restaurant });
        }

        // Si se completa, notificar al restaurante también (si fue el rider quien lo completó)
        if (status === 'COMPLETED') {
            socketEvents.emitToRestaurant(order.restaurantId, 'order_completed', updatedOrder);
        }

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error actualizando orden:', error);
        res.status(500).json({ error: 'Error al actualizar el pedido' });
    }
};

/**
 * Asignar pedido a repartidor (Self-assign o Admin)
 * PATCH /api/orders/:id/assign
 */
const assignOrder = async (req, res) => {
    try {
        const { id } = req.params; // Order ID
        const { userId, role } = req.user;
        let finalRiderId = userId;

        // Si es ADMIN, puede estar asignando a un tercero
        if (role === 'ADMIN' && req.body.riderId) {
            finalRiderId = req.body.riderId;
        }

        // Verificar que el pedido no tenga ya un riderId 
        // para evitar condiciones de carrera (excepto si es ADMIN sobrescribiendo)
        const order = await prisma.order.findUnique({ where: { id } });
        if (order.riderId && role !== 'ADMIN') {
            return res.status(400).json({ error: 'Este pedido ya fue tomado por otro repartidor.' });
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                riderId: finalRiderId,
                status: 'PREPARING'
                // No cambiamos a PREPARING si ya estaba en READY? Asumimos flujo simple.
            }
        });

        // Notificar al restaurante que ya tiene rider
        socketEvents.emitToRestaurant(order.restaurantId, 'driver_assigned', { orderId: id, riderId: finalRiderId });

        // Notificar al cliente
        socketEvents.emitToUser(order.customerId, 'order_status_update', updatedOrder);

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error asignando pedido:', error);
        res.status(500).json({ error: 'Error al asignar el pedido' });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getAvailableOrders,
    updateOrderStatus,
    assignOrder
};
