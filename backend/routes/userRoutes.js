const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
<<<<<<< HEAD
const { authMiddleware, isAdmin, isAuthUser } = require('../middlewares/authMiddleware');
const user = require('../models/user');
=======
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
>>>>>>> origin/karunakar/frontend


router.get('/', userController.getAllUsers); // Get all users
router.post('/', userController.createUser); // Create a new user

<<<<<<< HEAD

router.get('/:id', authMiddleware, isAuthUser, userController.getUserById);
router.put('/:id', authMiddleware, isAuthUser, userController.updateUserProfile); // Update user by ID
router.put('/:id/change-password', authMiddleware, isAuthUser, userController.changePassword); // Update user role by ID
router.get('/list/allManagers', userController.getAllManagers); // Get all managers
router.get('/list/allEmployees', userController.getAllEmployees); // Get all employees
module.exports = router;
=======
module.exports = router;
>>>>>>> origin/karunakar/frontend
