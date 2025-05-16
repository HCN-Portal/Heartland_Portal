const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const { sendEmail } = require('../utils/mailer');

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
      firstTimeLogin: user.firstTimeLogin,
    };


    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token, userInfo: payload, firstTimeLogin: user.firstTimeLogin });
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
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: resetTokenHash,
          resetPasswordExpires: Date.now() + 3600000 // 1 hour
        }
      }
    );

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const emailBody = `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <p>Hi ${user.firstName || 'there'},</p>
        <p>You requested a password reset for your account.</p>
        <p>Please click the button below to reset your password:</p>
        <p>
          <a href="${resetUrl}" 
            style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>Thanks,<br>The HCN Portal Team</p>
      </div>
    `;
    await sendEmail(user.email, 'Password Reset', emailBody);


    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Error sending reset email' });
  }
};



exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    console.log('Received reset token:', token);
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    console.log('Hashed token:', resetTokenHash);
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      console.log('Token is invalid or expired');
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          resetPasswordToken: undefined,
          resetPasswordExpires: undefined,
        },
      }
    );
    console.log(`Password reset successful for user: ${user.email}`);
    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Error in resetPassword controller:', err);
    res.status(500).json({ error: 'Could not reset password' });
  }
};

exports.resetFirstTimePassword = async (req, res) => {
  const userId = req.userId;
  const { password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.updateOne(
      { _id: userId },
      {
        $set: {
          password: hashedPassword,
          firstTimeLogin: false,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not reset password' });
  }
};


