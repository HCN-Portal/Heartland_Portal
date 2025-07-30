const nodemailer = require('nodemailer');
const Application = require('../models/applications');
const User = require('../models/user');
const Project = require('../models/projects')
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
      `<div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">
        <p>Dear Applicant,</p>
        <p>Your application has been <strong>successfully submitted</strong>!</p>
        <p>Please check your inbox for further updates. Kindly note that the review process may take a few days.</p>
        <p>Thank you for your patience and for applying with us!</p>
        <p>From,<br/>
        <strong>Heartland Community</strong></p>
      </div>
      `,
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
    const ongoingProjects = await Project.countDocuments({status : 'Active'})
    return res.status(200).json({
      pendingApplications: totalPending,
      activeEmployees: totalApproved,
      ongoingProjects: ongoingProjects,
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
    let employeeId = '';

    if (status === 'Approved') {
      // Generate temporary password
      tempPassword = generateTempPassword();

      // Check if user already exists
      let user = await User.findOne({ email: application.email });
      if (!user) {
        // Generate employee ID and create user
        employeeId = await generateEmployeeId();
        user = new User({
        employeeId,
        email: application.email,
        password: tempPassword,
        role: 'employee',

        // Personal Information
        firstName: application.firstName,
        lastName: application.lastName,
        preferredName: application.preferredName,
        phoneNumber: application.phoneNumber,
        address1: application.address1,
        address2: application.address2,

        // Immigration/Work Authorization
        eadStartDate: application.eadStartDate,
        citizenshipStatus: application.citizenshipStatus,
        workAuthorizationType: application.workAuthorizationType,

        // Educational Background
        highestDegreeEarned: application.highestDegreeEarned,
        fieldOfStudy: application.fieldOfStudy,
        universityName: application.universityName,
        graduationYear: application.graduationYear,

        // Professional Experience
        totalYearsExperience: application.totalYearsExperience,
        relevantSkills: application.relevantSkills,
        previousEmployer: application.previousEmployer,
        previousPosition: application.previousPosition,

        // First-time login + reset fields (defaulted)
        firstTimeLogin: true,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,

        // Optional - Set default projects if needed
        projectsAssigned: ['N/A']
      });

        await user.save();
      } else {
        employeeId = user.employeeId;
      }

      // Approved email HTML
      emailBody = `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">
        <p>Dear <strong>${application.firstName}</strong>,</p>

        <p>Congratulations! We’re excited to inform you that your application has been <strong>approved</strong>.</p>

        <p>To get started, please use the following temporary login credentials to access your account:</p>

        <p><strong>Temporary Login Details:</strong><br/>
        • Employee ID: ${employeeId}<br/>
        • Username: ${application.email}<br/>
        • Password: ${tempPassword}</p>

        <p><strong>Important:</strong></p>
        <ul>
          <li>You will be prompted to change your password upon first login.</li>
          <li>For your security, please do not share these credentials with anyone.</li>
          <li>If you face any issues logging in, feel free to reach out to our support team.</li>
        </ul>

        <p><strong>Login Portal:</strong> <a href="https://yourapp.com/login">https://yourapp.com/login</a></p>

        <p>Welcome aboard, and we look forward to working with you!</p>

        <p>Warm regards,<br/>
        <strong>Heartland Community Team</strong></p>
      </div>
      `;
    } else if (status === 'Rejected') {
      // Rejected email HTML
      emailBody = `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">
        <p>Dear <strong>${application.firstName}</strong>,</p>

        <p>Thank you for taking the time to apply to <strong>Heartland Community</strong>.</p>

        <p>After careful consideration, we regret to inform you that your application has not been approved at this time.</p>

        <p>We truly appreciate your interest in being a part of our community. Please don’t hesitate to apply again in the future—we’d be happy to reconsider your application.</p>

        <p>Wishing you all the best in your future endeavors.</p>

        <p>Sincerely,<br/>
        <strong>Heartland Community Team</strong></p>
      </div>
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
    return res.status(500).json({ error: 'Server error while updating application status' });
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