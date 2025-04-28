const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.post('/login', authControllers.login);


router.get('/admin-only', authMiddleware, isAdmin, (req, res) => {
  res.json({ message: 'You are an admin!' });
});

module.exports = router;
