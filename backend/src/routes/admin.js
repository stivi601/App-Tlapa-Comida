const express = require('express');
const router = express.Router();
const { getDashboardStats, getUsers, getCategories, addCategory, deleteCategory, getReports, getSummary } = require('../controllers/adminController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Todas las rutas requieren ser ADMIN
router.use(authMiddleware);
router.use(requireRole('ADMIN'));

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.get('/categories', getCategories);
router.post('/categories', addCategory);
router.delete('/categories/:id', deleteCategory);
router.get('/reports', getReports);
router.get('/summary', getSummary);

module.exports = router;
