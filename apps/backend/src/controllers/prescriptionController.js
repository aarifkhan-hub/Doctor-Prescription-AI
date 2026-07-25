const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/response');
const ApiError = require('../utils/ApiError');
const prescriptionService = require('../services/prescriptionService');
const AuditLog = require('../models/AuditLog');

exports.upload = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Prescription image is required', 'FILE_MISSING');
  const language = req.body.language;
  const doc = await prescriptionService.processPrescription({ user: req.user, file: req.file, language });
  await AuditLog.create({ userId: req.user._id, action: 'UPLOAD_PRESCRIPTION', meta: { id: doc._id }, ip: req.ip });
  return ok(res, { prescription: doc }, { modelVersion: doc.modelVersion, processingMs: doc.processingMs }, 201);
});

exports.list = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;
  const data = await prescriptionService.list({ userId: req.user._id, page, limit, status });
  return ok(res, data);
});

exports.getOne = asyncHandler(async (req, res) => {
  const doc = await prescriptionService.getOne({ userId: req.user._id, id: req.params.id });
  return ok(res, { prescription: doc });
});

exports.remove = asyncHandler(async (req, res) => {
  await prescriptionService.softDelete({ userId: req.user._id, id: req.params.id });
  await AuditLog.create({ userId: req.user._id, action: 'DELETE_PRESCRIPTION', meta: { id: req.params.id } });
  return ok(res, { ok: true });
});
