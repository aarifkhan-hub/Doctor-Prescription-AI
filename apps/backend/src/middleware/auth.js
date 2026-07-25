const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

exports.requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new ApiError(401, 'Missing access token', 'AUTH_MISSING');

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.sub).select('-passwordHash -refreshTokenHash');
    if (!user) throw new ApiError(401, 'User no longer exists', 'AUTH_INVALID');

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return next(new ApiError(401, 'Token expired', 'TOKEN_EXPIRED'));
    if (err.name === 'JsonWebTokenError') return next(new ApiError(401, 'Invalid token', 'TOKEN_INVALID'));
    next(err);
  }
};

exports.requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, 'Forbidden', 'FORBIDDEN'));
  }
  next();
};
