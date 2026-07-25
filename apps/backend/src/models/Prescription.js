const mongoose = require('mongoose');

const EntitySchema = new mongoose.Schema({
  kind: { type: String, enum: ['MEDICINE', 'DOSAGE', 'FREQUENCY', 'DURATION', 'INSTRUCTION', 'DOCTOR', 'PATIENT'] },
  text: String,
  normalized: String,
  rxnormId: String,
  confidence: Number,
  span: { start: Number, end: Number },
}, { _id: false });

const MedicineSchema = new mongoose.Schema({
  name: String,
  normalizedName: String,
  dosage: String,
  frequency: String,
  duration: String,
  route: String,
  instructions: String,
  warnings: [String],
}, { _id: false });

const PrescriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    requestId: { type: String, required: true, unique: true },

    image: {
      cloudinaryPublicId: String,
      secureUrl: String,
      width: Number,
      height: Number,
      sizeBytes: Number,
      mime: String,
    },

    status: {
      type: String, enum: ['UPLOADED', 'PROCESSING', 'DONE', 'FAILED'],
      default: 'UPLOADED', index: true,
    },
    modelVersion: String,
    processingMs: Number,

    ocr: {
      rawText: String,
      cleanedText: String,
      confidence: Number,
    },

    entities: [EntitySchema],
    medicines: [MedicineSchema],
    explanation: { en: String, hi: String },

    requiresReview: { type: Boolean, default: false },
    errorMessage: String,
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

PrescriptionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Prescription', PrescriptionSchema);
