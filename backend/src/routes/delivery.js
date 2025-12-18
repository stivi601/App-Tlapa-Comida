const express = require('express');
const router = express.Router();
const { loginRider, toggleStatus, getRiderStats } = require('../controllers/deliveryController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Public
router.post('/login', loginRider);

// Protected
router.use(authMiddleware);
router.use(requireRole('DELIVERY_RIDER'));

router.patch('/status', toggleStatus);
router.get('/stats', getRiderStats);

module.exports = router;
