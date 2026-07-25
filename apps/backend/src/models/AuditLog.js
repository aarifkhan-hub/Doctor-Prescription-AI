const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String,
  ip: String,
  ua: String,
  meta: mongoose.Schema.Types.Mixed,
  at: { type: Date, default: Date.now, expires: '365d', index: true },
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
