const prisma = require('../utils/prisma');

/**
 * Crear una nueva reseña para un pedido
 * POST /api/reviews
 */
const createReview = async (req, res) => {
    try {
        const { orderId, rating, comment } = req.body;
        const { userId, role } = req.user;

        // 1. Validar que la orden existe y pertenece al usuario
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { review: true }
        });

        if (!order) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        if (order.customerId !== userId) {
            return res.status(403).json({ error: 'No tienes permisos para calificar este pedido.' });
        }

        // 2. Validar que el pedido esté completado
        if (order.status !== 'COMPLETED') {
            return res.status(400).json({ error: 'Solo puedes calificar pedidos completados.' });
        }

        // 3. Validar que no haya sido calificada ya
        if (order.review) {
            return res.status(400).json({ error: 'Este pedido ya ha sido calificado.' });
        }

        // 4. Crear la reseña y actualizar el restaurante en una transacción
        const review = await prisma.$transaction(async (tx) => {
            const newReview = await tx.review.create({
                data: {
                    orderId,
                    restaurantId: order.restaurantId,
                    rating: parseInt(rating),
                    comment
                }
            });

            // Vincular la reseña al pedido (aunque tenemos orderId en Review, Order tiene reviewId opcional por diseño circular o redundancia)
            // Según el esquema: Order tiene reviewId (FK a Review.id)
            await tx.order.update({
                where: { id: orderId },
                data: { reviewId: newReview.id }
            });

            // Calcular nuevo promedio del restaurante
            const aggregate = await tx.review.aggregate({
                where: { restaurantId: order.restaurantId },
                _avg: { rating: true }
            });

            await tx.restaurant.update({
                where: { id: order.restaurantId },
                data: { rating: aggregate._avg.rating || 0 }
            });

            return newReview;
        });

        res.status(201).json(review);
    } catch (error) {
        console.error('Error al crear reseña:', error);
        res.status(500).json({ error: 'Error al procesar la calificación' });
    }
};

/**
 * Obtener reseñas de un restaurante
 * GET /api/reviews/restaurant/:id
 */
const getRestaurantReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await prisma.review.findMany({
            where: { restaurantId: id },
            orderBy: { createdAt: 'desc' },
            include: {
                order: {
                    include: {
                        customer: { select: { name: true } }
                    }
                }
            }
        });
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Error al obtener reseñas' });
    }
};

module.exports = {
    createReview,
    getRestaurantReviews
};
