const express = require('express');
const router = express.Router();
const { getNotifications, createNotification } = require('../controllers/notificationController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Public/Authenticated users can see notifications
router.get('/', getNotifications);

// Only Admin can create notifications
router.post('/', authMiddleware, requireRole('ADMIN'), createNotification);

module.exports = router;
