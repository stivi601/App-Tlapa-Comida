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

module.exports = { authMiddleware, requireRole };
