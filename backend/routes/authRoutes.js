const authControllers = require('../controllers/authController')
const { authMiddleware } = require('../middlewares/authMiddleware')

const router = require('express').Router()

// POST /login - Login route
router.post('/login', authControllers.login); // Login endpoint

module.exports = router