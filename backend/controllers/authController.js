// authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Import the new User model

exports.login = async (req, res) => {
bcrypt.hash('admin123', 10).then(console.log);

  const { email, password } = req.body; // Get email and password from request body

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    console.log("User found:", user.email, "with role:", user.role);
    console.log("Stored password hash:", user.password);
    // 2. Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);
    if (!isMatch) {
      console.log("Password mismatch for user:", user.email);
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // 3. Create JWT token with userId and role
    const payload = {
      userId: user._id,
      role: user.role, // assuming `role` is a field in the User model
    };

    // Create JWT token, set expiration time to 1 hour
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 4. Send the token in response (can be in a cookie or as JSON)
    return res.json({ message: 'Login successful', token, userId: user._id, role: user.role });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};