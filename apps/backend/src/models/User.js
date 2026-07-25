const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String, required: true, unique: true, lowercase: true, trim: true, index: true,
    },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, index: true, sparse: true },
    role: { type: String, enum: ['user', 'admin', 'clinician'], default: 'user' },
    emailVerified: { type: Boolean, default: false },
    preferredLanguage: { type: String, enum: ['en', 'hi'], default: 'en' },
    refreshTokenHash: { type: String, default: null },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

UserSchema.methods.verifyPassword = function verifyPassword(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

UserSchema.statics.hashPassword = function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
};

UserSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshTokenHash;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
