

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Personal Information
  firstName: { type: String, required: true },  
  lastName: { type: String, required: true },  
  preferredName: { type: String, default: '' },  
  email: { type: String, required: true },  
  phoneNumber: { type: String, required: false }, 
  dob: { type: Date, required: true },   
  address1: { type: String, required: true },  
  address2: { type: String, default: '' },

  // Employment Information
  eadStartDate: { type: Date, required: false },
  roleInterest: { type: String, required: true }, 
  department: { type: String, default: "Not Specified" },  
  // workLocation: { type: String, required: true },  
  reportingManager: { type: String, default: "Not Assigned" },  

  // Immigration/Work Authorization Information
  citizenshipStatus: { type: String, required: true },  
  workAuthorizationType: { type: String, required: true },  
  visaType: { type: String, default: '' },  
  visaEADNumber: { type: String, default: '' },  
  visaEADExpiryDate: { type: Date, default: null },  

  // Educational Background
  highestDegreeEarned: { type: String, required: true },  
  fieldOfStudy: { type: String, required: true },  
  universityName: { type: String, required: true },  
  graduationYear: { type: String, required: true },  

  // Professional Experience
  totalYearsExperience: { type: String, required: true }, 
  relevantSkills: { type: [String], required: true },  
  previousEmployer: { type: String, required: true },  
  previousPosition: { type: String, required: true },  

  // Additional Information
  whyJoin: { type: String, required: false }, 
  
  // Acknowledgments (Applicant's confirmation of provided info)
  acknowledgments: {
    isAccurate: { type: Boolean, required: true, default: true },  
    understandFalseInfoConsequences: { type: Boolean, required: true, default: true },  
  },

  // Meta Information
  dateOfSubmission: { type: Date, default: Date.now },  
  // digitalSignature: { type: String, required: true },  
});

// Export the updated model
module.exports = mongoose.model('Application', applicationSchema);
