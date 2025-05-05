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
    type: [String], // Array of strings to store multiple project IDs or names
    default: ['N/A'] // Default to 'N/A' when no projects are assigned
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
