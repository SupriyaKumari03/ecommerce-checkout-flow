const express = require('express');
const router = express.Router();
const { signup, signin, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Authentication routes
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/me', protect, getProfile);

module.exports = router; 