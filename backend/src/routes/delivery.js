const express = require('express');
const router = express.Router();
const { loginRider, toggleStatus, getRiderStats, getAllRiders, createRider, updateRider, deleteRider } = require('../controllers/deliveryController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Public
router.post('/login', loginRider);

// Protected
router.use(authMiddleware);
router.use(requireRole('DELIVERY_RIDER'));

router.patch('/status', toggleStatus);
router.get('/stats', getRiderStats);

// Admin Routes (Riders Management)
router.get('/riders', authMiddleware, requireRole('ADMIN'), getAllRiders);
router.post('/riders', authMiddleware, requireRole('ADMIN'), createRider);
router.put('/riders/:id', authMiddleware, requireRole('ADMIN'), updateRider);
router.delete('/riders/:id', authMiddleware, requireRole('ADMIN'), deleteRider);

module.exports = router;
