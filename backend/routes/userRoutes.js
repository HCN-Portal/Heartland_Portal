const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');


router.get('/', userController.getAllUsers); // Get all users
router.post('/', userController.createUser); // Create a new user

module.exports = router;