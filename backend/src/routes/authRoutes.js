const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const authenticate = require('../middleware/auth');

// Signup
router.post('/signup', authController.signup);

// Login
router.post('/login', authController.login);

// Forgot Password
router.post('/forgot-password', authController.forgotPassword);

// Get real-time User Details
router.get('/me', authenticate, authController.getMe);

module.exports = router;
