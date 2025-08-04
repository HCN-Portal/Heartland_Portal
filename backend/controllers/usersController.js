const mongoose = require('mongoose'); // For ObjectId validation
const User = require('../models/user'); // Assuming you have a User model
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For JWT token generation
const generateEmployeeId = require('../utils/employeeId'); // Assuming you have a utility to generate employee IDs
const hashPassword = require('../utils/hashPassword'); // Assuming you have a utility to hash passwords
// Controller function to fetch all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.status(200).json(users); // Send the users as a JSON response
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Controller function to create a new user for testing purposes
exports.createUser = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        let employeeId = '';
        employeeId = await generateEmployeeId(); // Generate a new employee ID
        
        // Create a new user - the model's pre-save hook will handle password hashing
        const newUser = new User({
            ...req.body,
            employeeId
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ 
            message: 'User created successfully', 
            user: { 
                email: newUser.email, 
                role: newUser.role,
                _id: newUser._id
            } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Validate if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        
        // Find user by ID
        const user = await User.findById(userId);
        
        // If no user found, return 404
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Return user data, excluding sensitive information like password
        res.status(200).json({
            _id: user._id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            preferredName: user.preferredName,
            phoneNumber: user.phoneNumber,
            address1: user.address1,
            address2: user.address2,
            employeeId: user.employeeId,
            projectsAssigned: user.projectsAssigned
            // Add other fields you want to return
        });
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Validate if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        
        // Find user by ID
        const user = await User.findById(userId);
        
        // If no user found, return 404
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Define fields that users are allowed to update
        const allowedUpdates = [
            'firstName',
            'lastName',
            'preferredName',
            'phoneNumber',
            'address1',
            'address2',
            'projectsAssigned',//needs to be only accessible to admin
            'eadStartDate',
            'citizenshipStatus',
            'workAuthorizationType',
            'highestDegreeEarned',
            'fieldOfStudy',
            'universityName',
            'graduationYear',
            'totalYearsExperience',
            'relevantSkills',
            'previousEmployer',
            'previousPosition'
        ];
        
        // Create an object with only the allowed fields
        const updates = {};
        for (const field of allowedUpdates) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }
        
        // Update the user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true } // Return updated user and run validators
        );
        
        // Return updated user data
        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                _id: updatedUser._id,
                email: updatedUser.email,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                preferredName: updatedUser.preferredName,
                phoneNumber: updatedUser.phoneNumber,
                address1: updatedUser.address1,
                address2: updatedUser.address2,
                employeeId: updatedUser.employeeId,
                projectsAssigned: updatedUser.projectsAssigned,
                eadStartDate: updatedUser.eadStartDate,
                citizenshipStatus: updatedUser.citizenshipStatus,
                workAuthorizationType: updatedUser.workAuthorizationType,
                highestDegreeEarned: updatedUser.highestDegreeEarned,
                fieldOfStudy: updatedUser.fieldOfStudy,
                universityName: updatedUser.universityName,
                graduationYear: updatedUser.graduationYear,
                totalYearsExperience: updatedUser.totalYearsExperience,
                relevantSkills: updatedUser.relevantSkills,
                previousEmployer: updatedUser.previousEmployer,
                previousPosition: updatedUser.previousPosition
            }
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const userId = req.params.id;
        const { currentPassword, newPassword } = req.body;
        
        // Validate inputs
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }
        
        // Validate password strength
        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'New password must be at least 8 characters long' });
        }
        
        // Validate if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        
        // Find user by ID
        const user = await User.findById(userId);
        
        // If no user found, return 404
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Verify the current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            console.log("Password mismatch for user:", user.password, currentPassword);
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        
        user.password = newPassword;
        await user.save();
        
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Error changing password', error: error.message });
    }
};

exports.getAllManagers = async (req, res) => {
    try {
        // Find all users with role 'manager'
        const managers = await User.find({ role: 'manager' }, 'firstName lastName _id');
        
        // Format the response
        const formattedManagers = managers.map(manager => ({
            id: manager._id,
            firstName: manager.firstName,
            lastName: manager.lastName,
            fullName: `${manager.firstName} ${manager.lastName}`
        }));
        
        res.status(200).json({
            count: formattedManagers.length,
            managers: formattedManagers
        });
    } catch (error) {
        console.error('Error fetching managers:', error);
        res.status(500).json({ message: 'Error fetching managers', error: error.message });
    }
};

exports.getAllEmployees = async (req, res) => {
    try {
        // Find all users with role 'employee'
        const employees = await User.find({ role: 'employee' }, 'firstName lastName _id');
        
        // Format the response
        const formattedEmployees = employees.map(employee => ({
            id: employee._id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            fullName: `${employee.firstName} ${employee.lastName}`
        }));
        
        res.status(200).json({
            count: formattedEmployees.length,
            employees: formattedEmployees
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Error fetching employees', error: error.message });
    }
};