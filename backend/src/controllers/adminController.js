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



/**
 * Obtener lista de usuarios registrados
 * GET /api/admin/users
 */
const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'CUSTOMER' }, // Opcional: solo clientes? Mejor todos o filtrar en frontend. Por ahora mostramos todos, o solo Customers? El mock implicaba clientes. Vamos a mostrar todos menos quiza el admin mismo? O simple findMany. 
            // El mock decia "Usuarios Registrados". Usually means customers.
            // Pero si el sistema crece, 'Customer' es el rol clave.
            // Vamos a filtrar por role: 'CUSTOMER' para que no salga el admin ni otros.
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true,
                role: true
            }
        });

        const formatted = users.map(u => ({
            id: u.id,
            name: u.name || 'Sin nombre',
            email: u.email,
            phone: u.phone || 'Pendiente',
            date: u.createdAt ? u.createdAt.toISOString().split('T')[0] : 'N/A',
            role: u.role
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

module.exports = {
    getDashboardStats,
    getUsers
};
