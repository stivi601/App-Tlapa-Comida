const express = require('express');
const router = express.Router();
const {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    addMenuItem,
    updateRestaurant,
    deleteRestaurant
} = require('../controllers/restaurantController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Rutas Públicas (Cualquiera puede ver restaurantes)
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);

// Rutas Protegidas (Solo Admin puede crear restaurantes)
router.post('/', authMiddleware, requireRole('ADMIN'), createRestaurant);
router.put('/:id', authMiddleware, requireRole('ADMIN'), updateRestaurant);
router.delete('/:id', authMiddleware, requireRole('ADMIN'), deleteRestaurant);

// Rutas Protegidas (Agregar menú - Admin o el propio Restaurante)
router.post('/:id/menu', authMiddleware, requireRole('ADMIN', 'RESTAURANT'), addMenuItem);

module.exports = router;
