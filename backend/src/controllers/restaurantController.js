const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_development_key';

/**
 * Login para Restaurantes
 * POST /api/restaurants/login
 */
const loginRestaurant = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
        }

        const restaurant = await prisma.restaurant.findUnique({
            where: { username }
        });

        if (!restaurant) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Verificar password (si es placeholder, fallará, pero en create lo hashearemos)
        // Nota: Para compatibilidad con legacy/seeds sin hash, podríamos checar texto plano si hash falla
        // pero por seguridad mejor enforced hash.
        // Si el password empieza con $2, asumimos hash. Si no, comparamos plano (solo dev).
        let isValid = false;
        if (restaurant.password.startsWith('$2')) {
            isValid = await bcrypt.compare(password, restaurant.password);
        } else {
            isValid = restaurant.password === password;
        }

        if (!isValid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar token
        const token = jwt.sign(
            { userId: restaurant.id, role: 'RESTAURANT', restaurantId: restaurant.id },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login exitoso',
            restaurant: {
                id: restaurant.id,
                name: restaurant.name,
                username: restaurant.username,
                image: restaurant.image,
                isOnline: restaurant.isOnline
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

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

        const hashedPassword = await bcrypt.hash(password || '123456', 10);

        const newRestaurant = await prisma.restaurant.create({
            data: {
                name,
                username,
                password: hashedPassword,
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

/**
 * Cambiar estado Abierto/Cerrado
 * PATCH /api/restaurants/:id/status
 */
const toggleRestaurantStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isOnline } = req.body;

        const updatedRestaurant = await prisma.restaurant.update({
            where: { id },
            data: { isOnline }
        });

        res.json(updatedRestaurant);
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ error: 'Error al actualizar estado del restaurante' });
    }
};

/**
 * Actualizar perfil del restaurante (Tiempo, Costo envío, Imagen, Nombre)
 * PATCH /api/restaurants/:id/profile
 */
const updateRestaurantProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, time, deliveryFee, image, username, password, categories } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (time) updateData.time = time;
        if (deliveryFee !== undefined) updateData.deliveryFee = parseFloat(deliveryFee);
        if (image) updateData.image = image;

        // Extended fields for Admin or Full Update
        if (username) updateData.username = username;
        if (password) updateData.password = await bcrypt.hash(password, 10);
        if (categories) updateData.categories = JSON.stringify(categories); // Expect array


        const updatedRestaurant = await prisma.restaurant.update({
            where: { id },
            data: updateData
        });

        res.json(updatedRestaurant);
    } catch (error) {
        console.error('Error al actualizar perfil del restaurante:', error);
        res.status(500).json({ error: 'Error al actualizar perfil del restaurante' });
    }
};

/**
 * Eliminar item del menú
 * DELETE /api/restaurants/:id/menu/:itemId
 */
const deleteMenuItem = async (req, res) => {
    try {
        const { id, itemId } = req.params;

        // Verificar que el item pertenezca al restaurante
        const menuItem = await prisma.menuItem.findFirst({
            where: {
                id: itemId,
                restaurantId: id
            }
        });

        if (!menuItem) {
            return res.status(404).json({ error: 'Item no encontrado o no pertenece al restaurante' });
        }

        await prisma.menuItem.delete({
            where: { id: itemId }
        });

        res.json({ message: 'Item eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar item:', error);
        res.status(500).json({ error: 'Error al eliminar platillo' });
    }
};

/**
 * Eliminar categoría del menú (elimina todos los items de esa categoría)
 * DELETE /api/restaurants/:id/menu/category/:categoryName
 */
const deleteMenuCategory = async (req, res) => {
    try {
        const { id, categoryName } = req.params;

        // Decode category name just in case (though express params usually handle it)
        const cat = decodeURIComponent(categoryName);

        // DeleteMany items with that category and restaurantId
        await prisma.menuItem.deleteMany({
            where: {
                restaurantId: id,
                category: cat
            }
        });

        res.json({ message: `Categoría ${cat} eliminada correctamente` });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({ error: 'Error al eliminar categoría' });
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
    deleteRestaurant,
    toggleRestaurantStatus,
    updateRestaurantProfile,
    loginRestaurant
};
