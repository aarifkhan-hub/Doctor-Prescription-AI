const { v4: uuidv4 } = require('uuid');
const Prescription = require('../models/Prescription');
const cloudinaryService = require('./cloudinaryService');
const aiService = require('./aiService');
const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

/**
 * Full pipeline:
 *   1. Upload to Cloudinary
 *   2. Persist Prescription doc
 *   3. Call AI service
 *   4. Update doc with result
 */
exports.processPrescription = async ({ user, file, language }) => {
  const requestId = uuidv4();

  // 1. Upload to Cloudinary
  const uploaded = await cloudinaryService.uploadBuffer(file.buffer, requestId);

  // 2. Persist initial doc
  let doc = await Prescription.create({
    userId: user._id,
    requestId,
    image: {
      cloudinaryPublicId: uploaded.public_id,
      secureUrl: uploaded.secure_url,
      width: uploaded.width,
      height: uploaded.height,
      sizeBytes: uploaded.bytes,
      mime: file.mimetype,
    },
    status: 'PROCESSING',
  });

  // 3. AI service
  const start = Date.now();
  try {
    const aiResp = await aiService.predict({
      imageUrl: uploaded.secure_url,
      requestId,
      language: language || user.preferredLanguage || 'en',
    });

    const result = aiResp.data || aiResp;

    doc.status = 'DONE';
    doc.modelVersion = aiResp.meta?.modelVersion || result.modelVersion;
    doc.processingMs = Date.now() - start;
    doc.ocr = result.ocr;
    doc.entities = result.entities || [];
    doc.medicines = result.medicines || [];
    doc.explanation = result.explanation || { en: '', hi: '' };
    doc.requiresReview = Boolean(result.requiresReview);
    await doc.save();
  } catch (err) {
    doc.status = 'FAILED';
    doc.errorMessage = err.message;
    doc.processingMs = Date.now() - start;
    await doc.save();
    logger.error({ err, requestId }, 'Prescription processing failed');
    throw err;
  }

  return doc;
};

exports.list = async ({ userId, page, limit, status }) => {
  const filter = { userId, deletedAt: null };
  if (status) filter.status = status;

  const [items, total] = await Promise.all([
    Prescription.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Prescription.countDocuments(filter),
  ]);

  return { items, total, page, limit, pages: Math.ceil(total / limit) };
};

exports.getOne = async ({ userId, id }) => {
  const doc = await Prescription.findOne({ _id: id, userId, deletedAt: null });
  if (!doc) throw new ApiError(404, 'Prescription not found', 'NOT_FOUND');
  return doc;
};

exports.softDelete = async ({ userId, id }) => {
  const doc = await Prescription.findOne({ _id: id, userId, deletedAt: null });
  if (!doc) throw new ApiError(404, 'Prescription not found', 'NOT_FOUND');
  doc.deletedAt = new Date();
  await doc.save();
  if (doc.image?.cloudinaryPublicId) {
    await cloudinaryService.destroy(doc.image.cloudinaryPublicId);
  }
  return { ok: true };
};
