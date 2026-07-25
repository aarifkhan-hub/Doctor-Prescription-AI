const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../config/env');

exports.signAccessToken = (user) =>
  jwt.sign({ sub: user._id.toString(), role: user.role }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });

exports.signRefreshToken = (user) =>
  jwt.sign({ sub: user._id.toString() }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });

exports.verifyRefresh = (token) => jwt.verify(token, env.JWT_REFRESH_SECRET);

exports.hashToken = (token) => bcrypt.hash(token, 10);
exports.compareToken = (token, hash) => bcrypt.compare(token, hash);
