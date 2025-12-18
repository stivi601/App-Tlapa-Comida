const prisma = require('../utils/prisma');

/**
 * Obtener dashboard stats
 * GET /api/admin/stats
 */
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalOrders = await prisma.order.count();
        const totalRestaurants = await prisma.restaurant.count();
        const totalRiders = await prisma.deliveryRider.count();

        // Calcular ventas totales
        const orders = await prisma.order.findMany({
            where: { status: 'COMPLETED' },
            select: { total: true }
        });
        const totalSales = orders.reduce((acc, curr) => acc + curr.total, 0);

        res.json({
            users: totalUsers,
            orders: totalOrders,
            restaurants: totalRestaurants,
            riders: totalRiders,
            sales: totalSales
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};

module.exports = {
    getDashboardStats
};
