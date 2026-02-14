const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { uploadFile } = require('../controllers/uploadController');
const { authMiddleware } = require('../middleware/auth');

// Protected route - any authenticated user can upload
router.post('/', authMiddleware, upload.single('image'), uploadFile);

module.exports = router;
