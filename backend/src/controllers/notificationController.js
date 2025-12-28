const prisma = require('../utils/prisma');

/**
 * Obtener notificaciones del sistema
 */
const getNotifications = async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            orderBy: { date: 'desc' },
            take: 20
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener notificaciones' });
    }
};

/**
 * Crear notificación (Admin)
 */
const createNotification = async (req, res) => {
    try {
        const { title, message } = req.body;
        const notification = await prisma.notification.create({
            data: { title, message }
        });
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear notificación' });
    }
};

module.exports = {
    getNotifications,
    createNotification
};
