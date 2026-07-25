const { z } = require('zod');

exports.registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  fullName: z.string().min(2).max(80),
  phone: z.string().min(6).max(20).optional(),
});

exports.loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

exports.refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

exports.updateProfileSchema = z.object({
  fullName: z.string().min(2).max(80).optional(),
  phone: z.string().min(6).max(20).optional(),
  preferredLanguage: z.enum(['en', 'hi']).optional(),
});

exports.changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});
