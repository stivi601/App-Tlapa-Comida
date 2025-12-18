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
            select: { totalDeliveries: true, rating: true } // Asumiendo que agregaremos rating al schema después
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

module.exports = {
    loginRider,
    toggleStatus,
    getRiderStats
};
