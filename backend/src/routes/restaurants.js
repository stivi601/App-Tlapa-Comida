const express = require('express');
const router = express.Router();
const {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    addMenuItem
} = require('../controllers/restaurantController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Rutas Públicas (Cualquiera puede ver restaurantes)
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);

// Rutas Protegidas (Solo Admin puede crear restaurantes por ahora)
router.post('/', authMiddleware, requireRole('ADMIN'), createRestaurant); // TODO: Descomentar auth cuando tengamos users admin

// Rutas Protegidas (Agregar menú - idealmente Admin o el propio Restaurante)
// Por ahora lo dejamos abierto para facilitar pruebas del seed, o protegido con auth básico
router.post('/:id/menu', addMenuItem);

module.exports = router;
