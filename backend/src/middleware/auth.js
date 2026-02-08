const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        message: 'No authentication token, access denied',
        errors: [],
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        message: 'User not found, access denied',
        errors: [],
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Token is not valid',
      errors: [error.message],
    });
  }
};

// Admin authorization middleware
const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      message: 'Access denied. Admin privileges required.',
      errors: [],
    });
  }
};

module.exports = { auth, adminAuth };
