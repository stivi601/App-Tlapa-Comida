const prisma = require('../utils/prisma');
const { socketEvents } = require('../utils/socketUtils');

/**
 * Crear un nuevo pedido
 * POST /api/orders
 */
const createOrder = async (req, res) => {
    try {
        console.log("📥 Recibiendo petición para crear pedido:", req.body);
        const { restaurantId, items, total, deliveryAddress, deliveryLat, deliveryLng } = req.body;
        const { userId, role } = req.user;

        // Solo CUSTOMER puede crear pedidos (o ADMIN)
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

        console.log('✅ Pedido creado exitosamente:', newOrder.id);

        // WEBSOCKETS: Notificar
        socketEvents.emitToRestaurant(restaurantId, 'new_order', newOrder);
        socketEvents.emitToUser(userId, 'join_auto_room', newOrder.id);

        res.status(201).json(newOrder);
    } catch (error) {
        console.error('❌ Error al crear pedido:', error);
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

        const formattedOrders = orders.map(order => ({
            ...order,
            time: new Date(order.createdAt).toLocaleString()
        }));

        res.json(formattedOrders);
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ error: 'Error al obtener mis pedidos' });
    }
};

/**
 * Obtener pedidos disponibles para repartidores
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

        const order = await prisma.order.findUnique({
            where: { id },
            include: { customer: true, restaurant: true, rider: true }
        });

        if (!order) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        if (role === 'RESTAURANT' && order.restaurantId !== userId) {
            return res.status(403).json({ error: 'No tienes permisos para actualizar este pedido.' });
        }

        if (role === 'DELIVERY_RIDER' && order.riderId !== userId) {
            return res.status(403).json({ error: 'Este pedido no te pertenece.' });
        }

        if (role === 'CUSTOMER') {
            return res.status(403).json({ error: 'Acción no permitida para clientes.' });
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status }
        });

        socketEvents.emitToUser(order.customerId, 'order_status_update', updatedOrder);

        if ((status === 'PREPARING' || status === 'READY') && !order.riderId) {
            socketEvents.broadcastToDrivers('new_order_available', { ...updatedOrder, restaurant: order.restaurant });
        }

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
 * Asignar pedido a repartidor
 * PATCH /api/orders/:id/assign
 */
const assignOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, role } = req.user;
        let finalRiderId = userId;

        if (role === 'ADMIN' && req.body.riderId) {
            finalRiderId = req.body.riderId;
        }

        const order = await prisma.order.findUnique({ where: { id } });
        if (order.riderId && role !== 'ADMIN') {
            return res.status(400).json({ error: 'Este pedido ya fue tomado por otro repartidor.' });
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                riderId: finalRiderId,
                status: 'PREPARING'
            }
        });

        socketEvents.emitToRestaurant(order.restaurantId, 'driver_assigned', { orderId: id, riderId: finalRiderId });
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
