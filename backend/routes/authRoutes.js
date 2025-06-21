const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Login Route
router.post('/login', authControllers.login);

// Forgot Password Route
// This will handle the email submission for a password reset.
router.post('/forgot-password', authControllers.forgotPassword);

// Reset Password Route
// Reset First Time Password Route
router.post('/reset-passwords/first-time',authMiddleware, authControllers.resetFirstTimePassword);

// This will handle the actual password reset using the token from the URL.
router.post('/reset-password/:token', authControllers.resetPassword);


// Admin only route (Protected route)
router.get('/admin-only', authMiddleware, isAdmin, (req, res) => {
  res.json({ message: 'You are an admin!' });
});

module.exports = router;


