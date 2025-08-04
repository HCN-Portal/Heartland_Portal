// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  employeeId: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'employee', 'manager'], default: 'employee' }, // Assuming roles for users
  firstName: { type: String, required: true },  
  lastName: { type: String, required: true },  
  preferredName: { type: String, default: '' },   
  phoneNumber: { type: String, required: false },   
  address1: { type: String, required: true },  
  address2: { type: String, default: '' },
  projectsAssigned: {
    type: [{
      projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
      title: { type: String, required: true, trim: true },
      _id: false
    }], // Array of objects to store  project IDs and names
    default: [] // Default to [] when no projects are assigned
  },

  // Immigration/Work Authorization 
  eadStartDate: { type: Date, required: false },
  citizenshipStatus: { type: String, required: true },  
  workAuthorizationType: { type: String, required: true },  
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
  // Checking First Time Login
  // This field is used to determine the user needs to reset their password on first login
  firstTimeLogin: {
  type: Boolean,
  default: true, // All new users must reset on first login
  },
  // Password Reset
  resetPasswordToken: {
    type: String,
    default: undefined
  },
  resetPasswordExpires: {
    type: Date,
    default: undefined
  }

});

// Before saving a user, hash their password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check if password is correct
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
