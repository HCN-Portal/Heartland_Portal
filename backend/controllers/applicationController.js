const nodemailer = require('nodemailer');
const Application = require('../models/applications');
const User = require('../models/user');
const {responseReturn}  = require("../utils/response")
const { sendEmail } = require('../utils/mailer');
const bcrypt = require('bcryptjs');
const generateEmployeeId = require('../utils/employeeId');

exports.createApplication = async (req, res) => {
  const formdata = req.body;
  try {
    const existingApplication = await Application.findOne({ email: formdata.email });
    if (existingApplication) {
      return responseReturn(res, 409, { error: 'An application with this email already exists' });
    }

    const application = new Application(formdata);
    const savedApplication = await application.save();

    // Send confirmation email
    await sendEmail(
      formdata.email,
      "Application Submitted - Heartland Community",
      `Dear Applicant,

Your application has been successfully submitted!

Please check your inbox for further updates. Kindly note that the review process may take a few days.

Thank you for your patience and for applying with us!

From,
Heartland Community`
      );

    return responseReturn(res, 201, { message: 'Application saved', savedApplication });

  } catch (error) {
    console.log('Error saving application:', error);
    return responseReturn(res, 500, { error: 'Server error occurred while creating application' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalPending = await Application.countDocuments({ status: 'pending' });
    const totalApproved = await Application.countDocuments({ status: 'Approved' });
    const ongoingProjects = 0; // Placeholder for ongoing projects count
    return res.status(200).json({
      pendingApplications: totalPending,
      activeEmployees: totalApproved,
      ongoingProjects,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ error: 'Server error while fetching dashboard statistics' });
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

// Utility to generate a strong random password
const generateTempPassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

exports.updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.status = status;
    await application.save();

    let emailBody = '';
    let tempPassword = '';

    if (status === 'Approved') {
      // Generate temp password and hash it
      tempPassword = generateTempPassword();

      // Check if user already exists
      let user = await User.findOne({ email: application.email });
      let employeeId = '';
      if (!user) {
        employeeId = await generateEmployeeId();
        user = new User({
          employeeId,
          email: application.email,
          password: tempPassword,
          role: 'employee',
          firstName: application.firstName,
          lastName: application.lastName,
          preferredName: application.preferredName,
          phoneNumber: application.phoneNumber,
          address1: application.address1,
          address2: application.address2
        });
        await user.save();
      }

      // Email content for approved application
      emailBody = `
Dear ${application.firstName},

Congratulations! We’re excited to inform you that your application has been approved.

To get started, please use the following temporary login credentials to access your account:

Temporary Login Details:
• Employee ID: ${employeeId}
• Username: ${application.email}
• Password: ${tempPassword}

Important:
- You will be prompted to change your password upon first login.
- For your security, please do not share these credentials with anyone.
- If you face any issues logging in, feel free to reach out to our support team.

Login Portal: https://yourapp.com/login

Welcome aboard, and we look forward to working with you!

Warm regards,  
Heartland Community Team
`;
    } else {
      // Email content for rejected application
      emailBody = `
Dear ${application.firstName},

Thank you for taking the time to apply to Heartland Community.

After careful consideration, we regret to inform you that your application has not been approved at this time.

We truly appreciate your interest in being a part of our community. Please don’t hesitate to apply again in the future—we’d be happy to reconsider your application.

Wishing you all the best in your future endeavors.

Sincerely,  
Heartland Community Team
`;
    }

    // Send the email
    await sendEmail(
      application.email,
      `Application ${status} - Heartland Community`,
      emailBody
    );

    return res.status(200).json({ message: `Application ${status.toLowerCase()} successfully.` });

  } catch (error) {
    console.error('Error updating application status:', error);
    return res.status(500).json({ error: 'Server error while updating status' });
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