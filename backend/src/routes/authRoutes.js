const authControllers = require('../controllers/authController')
const { authMiddleware } = require('../middlewares/authMiddleware')

const router = require('express').Router()



module.exports = router