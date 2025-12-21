const express = require('express');
const router = express.Router();
const { register, login, getProfile, adminLogin, restaurantLogin } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Login de Admin
router.post('/admin/login', adminLogin);

// Login de Restaurante
router.post('/restaurant/login', restaurantLogin);

// Rutas protegidas
router.get('/me', authMiddleware, getProfile);

module.exports = router;

