const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const { authMiddleware, isAdmin, isAuthUser } = require('../middlewares/authMiddleware');


router.get('/', userController.getAllUsers); // Get all users
router.post('/', userController.createUser); // Create a new user


router.get('/:id', authMiddleware, isAuthUser, userController.getUserById);
router.put('/:id', authMiddleware, isAuthUser, userController.updateUserProfile); // Update user by ID
router.put('/:id/change-password', authMiddleware, isAuthUser, userController.changePassword); // Update user role by ID
module.exports = router;
