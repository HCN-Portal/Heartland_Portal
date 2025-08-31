const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const userController = require('../controllers/usersController');
const { authMiddleware, isAdmin, isAuthUser, isAdminOrManager, isManager, isEmployee } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, isEmployee, projectController.getAllProjectTitles); // Get all project titles
router.post('/', authMiddleware, isAdmin, projectController.createProject); // Create a new project
router.get('/applications', authMiddleware, isAdminOrManager, projectController.getProjectApplications); // Get all requests for a project
router.get('/:id', authMiddleware, isEmployee, projectController.getProjectById); // Get project by ID
router.put('/:id', authMiddleware, isAdminOrManager, projectController.updateProject); // Update project by ID
router.delete('/:id', authMiddleware, isAdmin, projectController.deleteProject); // Delete project by ID
router.post('/:id/employees', authMiddleware, isAdminOrManager, projectController.addEmployeesToProject); // Add employees to project
router.post('/:id/managers', authMiddleware, isAdmin, projectController.addManagersToProject); // Add managers to project
router.delete('/:projectId/employees/:employeeId', authMiddleware, isAdminOrManager, projectController.removeEmployeeFromProject); // Remove employee from project
router.delete('/:projectId/managers/:managerId', authMiddleware, isAdmin, projectController.removeManagerFromProject); // Remove manager from project
router.post('/:id/apply-manager', authMiddleware, isManager, projectController.applyToManageProject); // Apply to manage a project
router.get('/:id/applications', authMiddleware, isAdminOrManager, projectController.getProjectApplicationsById); // Get a specific project request by ID
router.post('/:id/apply-employee', authMiddleware, isEmployee, projectController.applyToJoinProject); // Apply to join a project
router.post('/:projectId/applications/:applicationId/approve', authMiddleware, isAdmin, projectController.approveProjectApplication); // Approve a project application
router.post('/:projectId/applications/:applicationId/decline', authMiddleware, isAdmin, projectController.declineProjectApplication); // Decline a project application


//router.get('/', projectController.getAllProjectTitles); // Get all project titles
//router.post('/', projectController.createProject); // Create a new project
//router.get('/applications', projectController.getProjectApplications); // Get all requests for a project
//router.get('/:id', projectController.getProjectById); // Get project by ID
//router.put('/:id', projectController.updateProject); // Update project by ID
//router.delete('/:id', projectController.deleteProject); // Delete project by ID
//router.post('/:id/employees', projectController.addEmployeesToProject); // Add employees to project
//router.post('/:id/managers', projectController.addManagersToProject); // Add managers to project
//router.delete('/:projectId/employees/:employeeId', projectController.removeEmployeeFromProject); // Remove employee from project
//router.delete('/:projectId/managers/:managerId', projectController.removeManagerFromProject); // Remove manager from project
//router.post('/:id/apply-manager', projectController.applyToManageProject); // Apply to manage a project
//router.get('/:id/applications', projectController.getProjectApplicationsById); // Get a specific project request by ID
//router.post('/:id/apply-employee', projectController.applyToJoinProject); // Apply to join a project
//router.post('/:projectId/applications/:applicationId/approve', projectController.approveProjectApplication); // Approve a project application
//router.post('/:projectId/applications/:applicationId/decline', projectController.declineProjectApplication); // Decline a project application


module.exports = router;