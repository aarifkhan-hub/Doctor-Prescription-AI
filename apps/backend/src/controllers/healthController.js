const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/response');
const aiService = require('../services/aiService');

exports.live = (req, res) => ok(res, { status: 'ok' });

exports.ready = asyncHandler(async (req, res) => {
  const db = mongoose.connection.readyState === 1;
  let ai = false;
  try { await aiService.health(); ai = true; } catch (_) { /* ignore */ }
  return ok(res, { db, ai });
});
