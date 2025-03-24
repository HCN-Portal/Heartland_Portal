const mongoose = require('mongoose');

// Define the schema for the onboarding application
const applicationSchema = new mongoose.Schema({
  // Personal Information
  firstName: { type: String, required: true },  // Applicant's first name
  lastName: { type: String, required: true },   // Applicant's last name
  preferredName: { type: String, default: '' },  // Optional preferred name
  personalEmail: { type: String, required: true, unique: true }, // Email (unique)
  phoneNumber: { type: String, required: true }, // Phone number
  dateOfBirth: { type: Date, required: true },   // Date of birth
  currentAddress: { type: String, required: true }, // Current address

  // Employment Information
  startDate: { type: Date, required: true },     // Start date at the company
  position: { type: String, required: true },    // Job position
  department: { type: String, required: true },  // Department in the company
  workLocation: { type: String, required: true }, // Work location
  reportingManager: { type: String, required: true }, // Reporting manager's name

  // Immigration/Work Authorization Information
  citizenshipStatus: { type: String, required: true }, // Citizenship status
  workAuthorizationType: { type: String, default: '' }, // Work authorization type (optional)
  visaType: { type: String, default: '' }, // Visa type (optional)
  visaEADNumber: { type: String, default: '' }, // Visa/EAD number (optional)
  visaEADExpiryDate: { type: Date, default: null }, // Visa/EAD expiry date (optional)

  // Educational Background
  highestDegreeEarned: { type: String, required: true }, // Highest degree earned
  fieldOfStudy: { type: String, required: true }, // Field of study
  universityInstitution: { type: String, required: true }, // University or institution
  yearOfGraduation: { type: Number, required: true }, // Graduation year

  // Professional Experience
  totalYearsOfExperience: { type: Number, required: true }, // Total years of work experience
  relevantSkills: { type: [String], required: true }, // List of relevant skills
  previousEmployer: { type: String, required: true }, // Previous employer's name
  previousPosition: { type: String, required: true }, // Previous position

  // Acknowledgments (Applicant's confirmation of provided info)
  acknowledgments: {
    isAccurate: { type: Boolean, required: true }, // Confirm the accuracy of the information
    understandFalseInfoConsequences: { type: Boolean, required: true }, // Understand the consequences of false info
  },

  // Meta Information
  dateOfSubmission: { type: Date, default: Date.now }, // Automatically sets the date when the form is submitted
  digitalSignature: { type: String, required: true }, // Digital signature of the applicant
});

// Create the model using the schema and export it
module.exports = mongoose.model('Application', applicationSchema);