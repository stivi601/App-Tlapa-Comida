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

        // Parsear categories para la respuesta
        newRestaurant.categories = JSON.parse(newRestaurant.categories);

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
        const { userId, role } = req.user;

        // Validar propiedad: El restauranteID debe coincidir con el userId (si es RESTAURANT)
        if (role === 'RESTAURANT' && id !== userId) {
            return res.status(403).json({ error: 'No tienes permisos para editar este menú.' });
        }

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

/**
 * Eliminar item del menú
 * DELETE /api/restaurants/:id/menu/:itemId
 */
const deleteMenuItem = async (req, res) => {
    try {
        const { id, itemId } = req.params; // id = restaurantId
        const { userId, role } = req.user;

        // Validar propiedad
        if (role === 'RESTAURANT' && id !== userId) {
            return res.status(403).json({ error: 'No tienes permisos para editar este menú.' });
        }

        await prisma.menuItem.deleteMany({
            where: {
                id: itemId,
                restaurantId: id
            }
        });

        res.json({ message: 'Item eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar item:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

/**
 * Eliminar toda una categoría del menú
 * DELETE /api/restaurants/:id/menu/category/:categoryName
 */
const deleteMenuCategory = async (req, res) => {
    try {
        const { id, categoryName } = req.params;
        const { userId, role } = req.user;

        // Validar propiedad
        if (role === 'RESTAURANT' && id !== userId) {
            return res.status(403).json({ error: 'No tienes permisos para editar este menú.' });
        }

        await prisma.menuItem.deleteMany({
            where: {
                restaurantId: id,
                category: categoryName
            }
        });

        res.json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({ error: 'Error al eliminar la categoría' });
    }
};


/**
 * Actualizar restaurante (Solo Admin)
 * PUT /api/restaurants/:id
 */
const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Evitar actualizar ID
        delete data.id;

        // Si viene categories como array, convertir a string para DB
        if (data.categories && Array.isArray(data.categories)) {
            data.categories = JSON.stringify(data.categories);
        }

        const updated = await prisma.restaurant.update({
            where: { id },
            data
        });

        // Parsear categories para la respuesta
        if (updated.categories) {
            updated.categories = JSON.parse(updated.categories);
        }

        res.json(updated);
    } catch (error) {
        console.error('Error al actualizar restaurante:', error);
        res.status(500).json({ error: 'Error al actualizar restaurante' });
    }
};

/**
 * Eliminar restaurante (Solo Admin)
 * DELETE /api/restaurants/:id
 */
const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.restaurant.delete({
            where: { id }
        });
        res.json({ message: 'Restaurante eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar restaurante:', error);
        res.status(500).json({ error: 'Error al eliminar restaurante' });
    }
};

module.exports = {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    addMenuItem,
    deleteMenuItem,
    deleteMenuCategory,
    updateRestaurant,
    deleteRestaurant
};
