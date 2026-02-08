const User = require('../models/User');
const bcrypt = require('bcrypt');

// Get user profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        errors: [],
      });
    }

    res.json({
      message: 'Profile fetched successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        errors: [],
      });
    }

    // Update fields
    if (username) user.username = username;
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({
          message: 'Email already in use',
          errors: ['This email is already registered to another account'],
        });
      }
      user.email = email;
    }
    if (password) {
      // Password will be hashed by pre-save middleware
      user.password = password;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
