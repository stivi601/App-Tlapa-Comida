const express = require('express');
const router = express.Router();
const {
    loginRider,
    toggleStatus,
    getRiderStats,
    getAllRiders,
    createRider,
    updateRider,
    deleteRider,
    updateProfile
} = require('../controllers/deliveryController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Public
router.post('/login', loginRider);

// Protected
router.use(authMiddleware);

// Admin Routes (Riders Management) - Must be before global DELIVERY_RIDER check
router.get('/riders', requireRole('ADMIN'), getAllRiders);
router.post('/riders', requireRole('ADMIN'), createRider);
router.put('/riders/:id', requireRole('ADMIN'), updateRider);
router.delete('/riders/:id', requireRole('ADMIN'), deleteRider);

// Rider Specific Routes
router.use(requireRole('DELIVERY_RIDER'));

router.patch('/status', toggleStatus);
router.get('/stats', getRiderStats);
router.patch('/profile', updateProfile);

module.exports = router;
