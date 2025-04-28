const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// POST /applications - Create a new application
router.post('/submit-application', applicationController.createApplication);

// GET /applications/dashboard - Get dashboard statistics
router.get('/dashboard-stats', applicationController.getDashboardStats);

// GET /applications - Get all applications
router.get('/', authMiddleware, isAdmin, applicationController.getAllApplications);

// PUT /applications/:id/status - Update application status
router.put('/:id/status', authMiddleware, isAdmin, applicationController.updateApplicationStatus);

// GET /applications/:id - Get application by ID
router.get('/:id', authMiddleware, isAdmin, applicationController.getApplicationById);

module.exports = router;