const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
// const { authMiddleware, requireRole } = require('../middleware/auth');

// router.use(authMiddleware);
// router.use(requireRole('ADMIN')); // Descomentar cuando tengamos users con rol ADMIN real

router.get('/stats', adminController.getDashboardStats);

// Categorías Globales
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.addCategory);
router.delete('/categories/:id', adminController.deleteCategory);
router.get('/reports', adminController.getReports);

module.exports = router;
