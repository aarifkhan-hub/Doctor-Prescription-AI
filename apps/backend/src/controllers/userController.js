const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/response');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

exports.updateProfile = asyncHandler(async (req, res) => {
  const { fullName, phone, preferredLanguage } = req.body;
  const user = await User.findById(req.user._id);
  if (fullName) user.fullName = fullName;
  if (phone) user.phone = phone;
  if (preferredLanguage) user.preferredLanguage = preferredLanguage;
  await user.save();
  return ok(res, { user });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  const okPw = await user.verifyPassword(currentPassword);
  if (!okPw) throw new ApiError(400, 'Current password incorrect', 'BAD_CURRENT_PW');
  user.passwordHash = await User.hashPassword(newPassword);
  user.refreshTokenHash = null;
  await user.save();
  return ok(res, { ok: true });
});
