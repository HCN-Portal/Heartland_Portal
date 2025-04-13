const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

// POST /applications - Create a new application
router.post('/submit-application', applicationController.createApplication);

// GET /applications - Get all applications
router.get('/', applicationController.getAllApplications);

// PUT /applications/:id/status - Update application status
router.put('/:id/status', applicationController.updateApplicationStatus);

// GET /applications/:id - Get application by ID
router.get('/:id', applicationController.getApplicationById);

module.exports = router;