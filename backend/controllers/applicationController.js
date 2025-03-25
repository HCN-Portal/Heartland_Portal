const applications = require('../models/applications');
const Application = require('../models/applications');
const {responseReturn}  = require("../utils/response")

// Create a new application
exports.createApplication = async (req, res) => {
  const formdata = req.body
  try {
    // Check if an application with the same email already exists
    const existingApplication = await applications.findOne({ email: formdata.email });
    if (existingApplication) {
      return responseReturn(res, 409, {error: 'An application with this email already exists'})
    }
    // Create new application
    const application = new Application(formdata);
    const savedApplication = await application.save();
    responseReturn(res, 201, {message: 'Application saved', savedApplication})
  } catch (error) {
    console.log('Error saving application:', error);
    if (error.name === 'ValidationError') {
      responseReturn(res, 400, {error: error.message})
    }
    responseReturn(res, 500, {error: 'Server error occurred while creating application'})
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