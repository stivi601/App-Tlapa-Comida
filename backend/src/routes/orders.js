const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getAvailableOrders,
    updateOrderStatus,
    assignOrder
} = require('../controllers/orderController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Rutas protegidas (Requieren Login)
router.use(authMiddleware);

// Clientes
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);

// Repartidores
router.get('/available', requireRole('DELIVERY_RIDER', 'ADMIN'), getAvailableOrders);
router.patch('/:id/assign', requireRole('DELIVERY_RIDER', 'ADMIN'), assignOrder);
router.patch('/:id/status', requireRole('DELIVERY_RIDER', 'RESTAURANT', 'ADMIN'), updateOrderStatus);

module.exports = router;
