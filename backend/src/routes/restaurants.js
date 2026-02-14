const express = require('express');
const router = express.Router();
const {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    addMenuItem,
    deleteMenuItem,
    deleteMenuCategory,
    updateRestaurant,
    deleteRestaurant,
    toggleRestaurantStatus,
    updateRestaurantProfile,
    loginRestaurant
} = require('../controllers/restaurantController');
const { authMiddleware, requireRole, requireRestaurantOwner } = require('../middleware/auth');

// Rutas Públicas
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.post('/login', loginRestaurant);

// Rutas Admin (Catálogo General)
router.post('/', authMiddleware, requireRole('ADMIN'), createRestaurant);
router.put('/:id', authMiddleware, requireRole('ADMIN'), updateRestaurant);
router.delete('/:id', authMiddleware, requireRole('ADMIN'), deleteRestaurant);

// Rutas de Gestión del Restaurante (Dueño o Admin)
router.patch('/:id/status', authMiddleware, requireRestaurantOwner, toggleRestaurantStatus);
router.patch('/:id/profile', authMiddleware, requireRestaurantOwner, updateRestaurantProfile);
router.post('/:id/menu', authMiddleware, requireRestaurantOwner, addMenuItem);
router.delete('/:id/menu/:itemId', authMiddleware, requireRestaurantOwner, deleteMenuItem);
router.delete('/:id/menu/category/:categoryName', authMiddleware, requireRestaurantOwner, deleteMenuCategory);

module.exports = router;
