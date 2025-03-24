const Application = require('../models/Application');

// Create a new application
exports.createApplication = async (req, res) => {
  try {
    // Check if an application with the same email already exists
    const existingApplication = await Application.findOne({ personalEmail: req.body.personalEmail });
    if (existingApplication) {
      return res.status(409).json({ error: 'An application with this email already exists' });
    }

    // Create new application
    const application = new Application(req.body);
    const savedApplication = await application.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error occurred while creating application' });
  }
};

// Get all applications
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find();
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Server error occurred while fetching applications' });
  }
};

// Get application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Application not found - Invalid ID' });
    }
    res.status(500).json({ error: 'Server error occurred while fetching application' });
  }
};