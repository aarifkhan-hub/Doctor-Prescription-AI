const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

/**
 * Upload a buffer to Cloudinary under `dprai/prescriptions/`.
 */
exports.uploadBuffer = (buffer, publicId) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'dprai/prescriptions',
        public_id: publicId,
        resource_type: 'image',
        overwrite: false,
        transformation: [{ quality: 'auto:good' }],
      },
      (err, result) => {
        if (err) return reject(new ApiError(502, 'Image upload failed', 'CLOUDINARY_FAIL', err.message));
        resolve(result);
      }
    );
    stream.end(buffer);
  });

exports.destroy = (publicId) => cloudinary.uploader.destroy(publicId).catch(() => null);
