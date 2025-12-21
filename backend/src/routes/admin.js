const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Todas las rutas requieren ser ADMIN
router.use(authMiddleware);
router.use(requireRole('ADMIN'));

router.get('/stats', getDashboardStats);

module.exports = router;
