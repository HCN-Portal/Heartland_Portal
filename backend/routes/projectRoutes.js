const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const userController = require('../controllers/usersController');
const { authMiddleware, isAdmin, isAuthUser, isAdminOrManager } = require('../middlewares/authMiddleware');


router.get('/', authMiddleware, isAuthUser, projectController.getAllProjectTitles); // Get all project titles
router.post('/', authMiddleware, isAdmin, projectController.createProject); // Create a new project
router.get('/:id', authMiddleware, isAuthUser, projectController.getProjectById); // Get project by ID
router.put('/:id', authMiddleware, isAdminOrManager, projectController.updateProject); // Update project by ID
router.delete('/:id', authMiddleware, isAdmin, projectController.deleteProject); // Delete project by ID
router.post('/:id/employees', authMiddleware, isAdminOrManager, projectController.addEmployeesToProject); // Add employees to project
router.post('/:id/managers', authMiddleware, isAdmin, projectController.addManagersToProject); // Add managers to project
router.delete('/:projectId/employees/:employeeId', authMiddleware, isAdminOrManager, projectController.removeEmployeeFromProject); // Remove employee from project
router.delete('/:projectId/managers/:managerId', authMiddleware, isAdmin, projectController.removeManagerFromProject); // Remove manager from project


module.exports = router;