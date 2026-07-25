const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/response');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const UserSettings = require('../models/UserSettings');
const AuditLog = require('../models/AuditLog');
const tokenService = require('../services/tokenService');

exports.register = asyncHandler(async (req, res) => {
  const { email, password, fullName, phone } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered', 'EMAIL_TAKEN');

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ email, passwordHash, fullName, phone });
  await UserSettings.create({ userId: user._id });

  const accessToken = tokenService.signAccessToken(user);
  const refreshToken = tokenService.signRefreshToken(user);
  user.refreshTokenHash = await tokenService.hashToken(refreshToken);
  user.lastLoginAt = new Date();
  await user.save();

  await AuditLog.create({ userId: user._id, action: 'REGISTER', ip: req.ip, ua: req.headers['user-agent'] });

  return ok(res, { user, tokens: { accessToken, refreshToken } }, {}, 201);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, 'Invalid credentials', 'AUTH_INVALID');

  const ok1 = await user.verifyPassword(password);
  if (!ok1) throw new ApiError(401, 'Invalid credentials', 'AUTH_INVALID');

  const accessToken = tokenService.signAccessToken(user);
  const refreshToken = tokenService.signRefreshToken(user);
  user.refreshTokenHash = await tokenService.hashToken(refreshToken);
  user.lastLoginAt = new Date();
  await user.save();

  await AuditLog.create({ userId: user._id, action: 'LOGIN', ip: req.ip, ua: req.headers['user-agent'] });

  return ok(res, { user, tokens: { accessToken, refreshToken } });
});

exports.refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  let decoded;
  try {
    decoded = tokenService.verifyRefresh(refreshToken);
  } catch {
    throw new ApiError(401, 'Invalid refresh token', 'REFRESH_INVALID');
  }
  const user = await User.findById(decoded.sub);
  if (!user || !user.refreshTokenHash) throw new ApiError(401, 'Session expired', 'SESSION_EXPIRED');

  const match = await tokenService.compareToken(refreshToken, user.refreshTokenHash);
  if (!match) throw new ApiError(401, 'Refresh token mismatch', 'REFRESH_INVALID');

  const accessToken = tokenService.signAccessToken(user);
  const newRefresh = tokenService.signRefreshToken(user);
  user.refreshTokenHash = await tokenService.hashToken(newRefresh);
  await user.save();

  return ok(res, { tokens: { accessToken, refreshToken: newRefresh } });
});

exports.logout = asyncHandler(async (req, res) => {
  req.user.refreshTokenHash = null;
  await req.user.save();
  return ok(res, { ok: true });
});

exports.me = asyncHandler(async (req, res) => ok(res, { user: req.user }));
