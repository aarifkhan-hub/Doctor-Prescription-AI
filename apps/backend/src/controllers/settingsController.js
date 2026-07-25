const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/response');
const UserSettings = require('../models/UserSettings');

exports.get = asyncHandler(async (req, res) => {
  let s = await UserSettings.findOne({ userId: req.user._id });
  if (!s) s = await UserSettings.create({ userId: req.user._id });
  return ok(res, { settings: s });
});

exports.update = asyncHandler(async (req, res) => {
  const s = await UserSettings.findOneAndUpdate(
    { userId: req.user._id },
    { $set: req.body },
    { upsert: true, new: true }
  );
  return ok(res, { settings: s });
});
