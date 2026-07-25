const multer = require('multer');
const ApiError = require('../utils/ApiError');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/jpg'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new ApiError(415, `Unsupported file type: ${file.mimetype}`, 'BAD_MIME'));
  }
  cb(null, true);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
});
