const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_development_key';

/**
 * Middleware para verificar el token JWT
 */
const authMiddleware = (req, res, next) => {
    try {
        // Obtener token del header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'No autorizado. Token no proporcionado.'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Agregar info del usuario al request
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Token inválido o expirado.'
        });
    }
};

/**
 * Middleware para verificar roles específicos
 */
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'No tienes permisos para esta acción'
            });
        }

        next();
    };
};

/**
 * Middleware para asegurar que la operación la hace el dueño del restaurante o Admin
 * Se debe usar DESPUÉS de authMiddleware
 */
const requireRestaurantOwner = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    // Admin tiene acceso total
    if (req.user.role === 'ADMIN') {
        return next();
    }

    // Verificar si es Restaurant Role
    if (req.user.role !== 'RESTAURANT') {
        return res.status(403).json({ error: 'Acceso denegado: No es cuenta de Restaurante' });
    }

    // Verificar ownership
    const requestRestaurantId = req.params.id; // Asumimos rutas tipo /api/restaurants/:id/...
    const userRestaurantId = req.user.restaurantId; // Del token

    if (requestRestaurantId && userRestaurantId && requestRestaurantId === userRestaurantId) {
        return next();
    }

    return res.status(403).json({ error: 'Acceso denegado: No eres dueño de este restaurante' });
};

module.exports = { authMiddleware, requireRole, requireRestaurantOwner };
