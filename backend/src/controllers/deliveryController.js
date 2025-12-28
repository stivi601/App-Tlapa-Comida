const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_development_key';

/**
 * Login de Repartidor
 * POST /api/delivery/login
 */
const loginRider = async (req, res) => {
    try {
        const { username, password } = req.body;

        const rider = await prisma.deliveryRider.findUnique({
            where: { username }
        });

        if (!rider) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Verificar password (asumiendo bcrypt, pero si el seed guardó texto plano temporalmente, ajustamos)
        // En seed pusimos texto plano "123". En producción debe ser bcrypt.compare.
        // Para este MVP vamos a permitir ambos o asumir comparación directa si falla bcrypt
        let isValid = false;
        try {
            isValid = await bcrypt.compare(password, rider.password);
        } catch (e) {
            // Fallback para dev si guardamos sin hash en seed
            isValid = (password === rider.password);
        }

        // Si el seed no usó hash, la comparación directa es necesaria
        if (!isValid && password === rider.password) isValid = true;

        if (!isValid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar Token
        const token = jwt.sign(
            { userId: rider.id, role: 'DELIVERY_RIDER', name: rider.name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Bienvenido Repartidor',
            rider: {
                id: rider.id,
                name: rider.name,
                isOnline: rider.isOnline
            },
            token
        });

    } catch (error) {
        console.error('Login Rider Error:', error);
        res.status(500).json({ error: 'Error en login de repartidor' });
    }
};

/**
 * Cambiar estado (Online/Offline)
 * PATCH /api/delivery/status
 */
const toggleStatus = async (req, res) => {
    try {
        const riderId = req.user.userId;
        const { isOnline } = req.body;

        const updatedRider = await prisma.deliveryRider.update({
            where: { id: riderId },
            data: { isOnline }
        });

        res.json({ isOnline: updatedRider.isOnline });
    } catch (error) {
        res.status(500).json({ error: 'Error al cambiar estado' });
    }
};

/**
 * Obtener estadísticas básicas del repartidor
 * GET /api/delivery/stats
 */
const getRiderStats = async (req, res) => {
    try {
        const riderId = req.user.userId;
        const rider = await prisma.deliveryRider.findUnique({
            where: { id: riderId },
            select: { totalDeliveries: true }
        });

        // Calcular ganancias del día (mockup logic)
        const todayEarnings = rider.totalDeliveries * 25; // 25 pesos por entrega promedio

        res.json({
            totalDeliveries: rider.totalDeliveries,
            todayEarnings,
            rating: 4.9 // Hardcoded por ahora
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};

/**
 * Admin: Obtener todos los repartidores
 * GET /api/delivery/riders
 */
const getAllRiders = async (req, res) => {
    try {
        const riders = await prisma.deliveryRider.findMany({
            include: { assignedRestaurant: true },
            orderBy: { name: 'asc' }
        });
        res.json(riders);
    } catch (error) {
        console.error('Error fetching riders:', error);
        res.status(500).json({ error: 'Error al obtener repartidores' });
    }
};

/**
 * Admin: Crear Repartidor
 * POST /api/delivery/riders
 */
const createRider = async (req, res) => {
    try {
        const { name, username, password, phone, rfc, email, address, assignedRestaurantId, image } = req.body;

        // Hashear password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newRider = await prisma.deliveryRider.create({
            data: {
                name,
                username,
                password: hashedPassword,
                phone,
                rfc,
                assignedRestaurantId,
                image,
                totalDeliveries: 0,
                isOnline: false
            }
        });

        res.status(201).json(newRider);
    } catch (error) {
        console.error('Error creating rider:', error);
        res.status(500).json({ error: 'Error al crear repartidor' });
    }
};

/**
 * Admin: Actualizar Repartidor
 * PUT /api/delivery/riders/:id
 */
const updateRider = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;

        // Filtrar solo campos permitidos en el esquema actual
        const data = {};
        const allowed = ['name', 'username', 'password', 'phone', 'rfc', 'image', 'assignedRestaurantId', 'isOnline', 'totalDeliveries'];

        allowed.forEach(field => {
            if (body[field] !== undefined) data[field] = body[field];
        });

        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        const updated = await prisma.deliveryRider.update({
            where: { id },
            data
        });

        res.json(updated);
    } catch (error) {
        console.error('Error updating rider:', error);
        res.status(500).json({ error: 'Error al actualizar repartidor' });
    }
};

/**
 * Admin: Eliminar Repartidor
 * DELETE /api/delivery/riders/:id
 */
const deleteRider = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.deliveryRider.delete({
            where: { id }
        });
        res.json({ message: 'Repartidor eliminado' });
    } catch (error) {
        console.error('Error deleting rider:', error);
        res.status(500).json({ error: 'Error al eliminar repartidor' });
    }
};

module.exports = {
    loginRider,
    toggleStatus,
    getRiderStats,
    getAllRiders,
    createRider,
    updateRider,
    deleteRider
};

