<<<<<<< HEAD
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
=======
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user');

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const payload = {
      userId: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token, userInfo: payload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'No user found with this email.' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset for your account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error sending reset email' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    console.log('Received reset token:', token); // Debugging log

    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    console.log('Hashed token:', resetTokenHash); // Debugging log

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log('Token is invalid or expired');
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not reset password' });
  }
};
>>>>>>> origin/karunakar/frontend
