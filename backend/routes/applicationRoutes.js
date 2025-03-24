const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

// POST /applications - Create a new application
router.post('/', applicationController.createApplication);

// GET /applications - Get all applications
router.get('/', applicationController.getAllApplications);

// GET /applications/:id - Get application by ID
router.get('/:id', applicationController.getApplicationById);

module.exports = router;