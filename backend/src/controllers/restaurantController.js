const prisma = require('../utils/prisma');

/**
 * Obtener todos los restaurantes
 * GET /api/restaurants
 */
const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await prisma.restaurant.findMany({
            include: {
                menu: true // Incluimos el menú básico
            }
        });

        // Parsear categories de JSON string a Array si es necesario
        const formattedRestaurants = restaurants.map(rest => ({
            ...rest,
            categories: rest.categories ? JSON.parse(rest.categories) : []
        }));

        res.json(formattedRestaurants);
    } catch (error) {
        console.error('Error al obtener restaurantes:', error);
        res.status(500).json({ error: 'Error al obtener restaurantes' });
    }
};

/**
 * Obtener restaurante por ID con su menú completo
 * GET /api/restaurants/:id
 */
const getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await prisma.restaurant.findUnique({
            where: { id },
            include: {
                menu: true
            }
        });

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurante no encontrado' });
        }

        // Parsear categories
        restaurant.categories = restaurant.categories ? JSON.parse(restaurant.categories) : [];

        res.json(restaurant);
    } catch (error) {
        console.error('Error al obtener restaurante:', error);
        res.status(500).json({ error: 'Error al obtener detalles del restaurante' });
    }
};

/**
 * Crear nuevo restaurante (Solo Admin)
 * POST /api/restaurants
 */
const createRestaurant = async (req, res) => {
    try {
        const { name, username, password, description, time, deliveryFee, categories, image } = req.body;

        // Aquí deberíamos hashear el password si se usará para login de panel de restaurante
        // Por simplificación en este paso, lo guardamos directo o usamos un hash placeholder

        const newRestaurant = await prisma.restaurant.create({
            data: {
                name,
                username,
                password: 'hashed_password_placeholder', // TODO: Implementar hash real
                time: time || '30-45 min',
                deliveryFee: parseFloat(deliveryFee) || 0,
                categories: JSON.stringify(categories || []),
                image,
                rating: 5.0
            }
        });

        res.status(201).json(newRestaurant);
    } catch (error) {
        console.error('Error al crear restaurante:', error);
        res.status(500).json({ error: 'Error al crear el restaurante' });
    }
};

/**
 * Agregar item al menú
 * POST /api/restaurants/:id/menu
 */
const addMenuItem = async (req, res) => {
    try {
        const { id } = req.params; // ID del restaurante
        const { name, description, price, category, image } = req.body;

        const newItem = await prisma.menuItem.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                category,
                image,
                restaurantId: id
            }
        });

        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error al agregar item al menú:', error);
        res.status(500).json({ error: 'Error al agregar platillo' });
    }
};

module.exports = {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    addMenuItem
};
