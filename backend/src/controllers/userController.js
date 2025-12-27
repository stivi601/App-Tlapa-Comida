const prisma = require('../utils/prisma');

/**
 * Obtener direcciones del usuario autenticado
 * GET /api/users/addresses
 */
const getAddresses = async (req, res) => {
    try {
        const userId = req.user.userId;
        const addresses = await prisma.address.findMany({
            where: { userId }
        });
        res.json(addresses);
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ error: 'Error al obtener direcciones' });
    }
};

/**
 * Agregar nueva dirección
 * POST /api/users/addresses
 */
const addAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { label, address, lat, lng } = req.body;

        const newAddress = await prisma.address.create({
            data: {
                label,
                address,
                lat,
                lng,
                userId
            }
        });

        res.status(201).json(newAddress);
    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).json({ error: 'Error al agregar dirección' });
    }
};

/**
 * Eliminar dirección
 * DELETE /api/users/addresses/:id
 */
const deleteAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        // Verificar que la dirección pertenezca al usuario
        const address = await prisma.address.findUnique({
            where: { id }
        });

        if (!address || address.userId !== userId) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        await prisma.address.delete({
            where: { id }
        });

        res.json({ message: 'Dirección eliminada' });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ error: 'Error al eliminar dirección' });
    }
};

module.exports = {
    getAddresses,
    addAddress,
    deleteAddress
};
