const User = require('../models/user'); // Assuming you have a User model
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For JWT token generation

// Controller function to fetch all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.status(200).json(users); // Send the users as a JSON response
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

exports.createUser = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        
        // Create a new user - the model's pre-save hook will handle password hashing
        const newUser = new User({
            email,
            password, // Pass the plain password - it will be hashed by the model
            role,
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