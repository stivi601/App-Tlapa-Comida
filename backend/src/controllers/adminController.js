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

/**
 * Obtener reporte resumido de operaciones
 * GET /api/admin/summary
 */
const getSummary = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalOrders = await prisma.order.count();
        const completedOrders = await prisma.order.count({ where: { status: 'COMPLETED' } });
        const totalRestaurants = await prisma.restaurant.count();

        const orders = await prisma.order.findMany({
            where: { status: 'COMPLETED' },
            select: { total: true }
        });
        const totalSales = orders.reduce((sum, o) => sum + o.total, 0);

        res.json({
            users: totalUsers,
            restaurants: totalRestaurants,
            orders: totalOrders,
            completedOrders,
            totalSales
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener resumen' });
    }
};

module.exports = {
    getDashboardStats,
    getUsers,
    getSummary,
    getCategories: async (req, res) => {
        try {
            const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
            res.json(categories);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener categorías' });
        }
    },
    addCategory: async (req, res) => {
        try {
            const { name, image } = req.body;
            if (!name) return res.status(400).json({ error: 'Nombre requerido' });

            const category = await prisma.category.create({
                data: { name, image }
            });
            res.status(201).json(category);
        } catch (error) {
            console.error(error);
            if (error.code === 'P2002') {
                return res.status(400).json({ error: 'Esta categoría ya existe' });
            }
            res.status(500).json({ error: 'Error al crear categoría' });
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            await prisma.category.delete({ where: { id } });
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar categoría' });
        }
    },

    getReports: async (req, res) => {
        try {
            const { period, date, startDate: queryStartDate, endDate: queryEndDate, restaurantId, riderId } = req.query;

            let startDate, endDate;
            const now = new Date();

            if (queryStartDate && queryEndDate) {
                startDate = new Date(queryStartDate);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(queryEndDate);
                endDate.setHours(23, 59, 59, 999);
            } else {
                const selectedDate = date ? new Date(date) : now;
                if (period === 'day') {
                    startDate = new Date(selectedDate.setHours(0, 0, 0, 0));
                    endDate = new Date(selectedDate.setHours(23, 59, 59, 999));
                } else if (period === 'month') {
                    startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
                    endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59);
                } else if (period === 'year') {
                    startDate = new Date(selectedDate.getFullYear(), 0, 1);
                    endDate = new Date(selectedDate.getFullYear(), 11, 31, 23, 59, 59);
                } else {
                    startDate = new Date(now.setHours(0, 0, 0, 0));
                    endDate = new Date(now.setHours(23, 59, 59, 999));
                }
            }

            const where = {
                createdAt: {
                    gte: startDate,
                    lte: endDate
                },
                status: 'COMPLETED'
            };

            if (restaurantId) where.restaurantId = restaurantId;
            if (riderId) where.riderId = riderId;

            const orders = await prisma.order.findMany({
                where,
                include: {
                    restaurant: { select: { name: true } },
                    rider: { select: { name: true } }
                }
            });

            const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
            const totalOrders = orders.length;

            let chartData = [];
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 2) {
                const hours = {};
                for (let i = 0; i < 24; i++) hours[i] = 0;
                orders.forEach(o => {
                    const h = new Date(o.createdAt).getHours();
                    hours[h] += o.total;
                });
                chartData = Object.entries(hours).map(([key, val]) => ({ label: `${key}:00`, value: val }));
            } else if (diffDays <= 61) {
                const days = {};
                orders.forEach(o => {
                    const dateObj = new Date(o.createdAt);
                    const label = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
                    days[label] = (days[label] || 0) + o.total;
                });
                chartData = Object.entries(days).map(([key, val]) => ({ label: key, value: val }));
            } else {
                const months = {};
                const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
                orders.forEach(o => {
                    const m = new Date(o.createdAt).getMonth();
                    const label = monthNames[m];
                    months[label] = (months[label] || 0) + o.total;
                });
                chartData = Object.entries(months).map(([key, val]) => ({ label: key, value: val }));
            }

            const restMap = {};
            orders.forEach(o => {
                const name = o.restaurant.name;
                restMap[name] = (restMap[name] || 0) + o.total;
            });
            const restaurantRanking = Object.entries(restMap)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value);

            const riderMap = {};
            orders.forEach(o => {
                const name = o.rider ? o.rider.name : 'Sin Asignar';
                riderMap[name] = (riderMap[name] || 0) + 1;
            });
            const riderRanking = Object.entries(riderMap)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value);

            res.json({
                summary: { totalSales, totalOrders },
                chartData,
                restaurantRanking,
                riderRanking,
                periodInfo: { startDate, endDate, diffDays }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al generar el reporte' });
        }
    }
};
