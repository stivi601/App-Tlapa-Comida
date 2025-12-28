const prisma = require('../utils/prisma');

/**
 * Crear un nuevo pedido
 * POST /api/orders
 */
const createOrder = async (req, res) => {
    try {
        const { restaurantId, items, total, addressId, deliveryAddress, deliveryLat, deliveryLng } = req.body;
        const userId = req.user.userId; // Del token JWT

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
                restaurant: true
            }
        });

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

        // Validar transiciones de estado válidas aquí si se desea

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status }
        });

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
        const riderId = req.user.userId; // El repartidor que llama al endpoint

        /* 
           Validación extra: Verificar que el pedido no tenga ya un riderId 
           para evitar condiciones de carrera (dos riders aceptando al mismo tiempo).
        */
        const order = await prisma.order.findUnique({ where: { id } });
        if (order.riderId) {
            return res.status(400).json({ error: 'Este pedido ya fue tomado por otro repartidor.' });
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                riderId: riderId,
                status: 'PREPARING' // O 'ACCEPTED' si existiera ese estado intermedio
            }
        });

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
