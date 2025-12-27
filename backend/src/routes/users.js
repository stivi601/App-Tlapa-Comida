const express = require('express');
const router = express.Router();
const { getAddresses, addAddress, deleteAddress } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

router.get('/addresses', authMiddleware, getAddresses);
router.post('/addresses', authMiddleware, addAddress);
router.delete('/addresses/:id', authMiddleware, deleteAddress);

module.exports = router;
