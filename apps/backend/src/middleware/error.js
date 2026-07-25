const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

exports.notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`, 'NOT_FOUND'));
};

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const payload = {
    success: false,
    requestId: res.locals.requestId,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: status >= 500 ? 'Internal server error' : err.message,
      details: err.details || undefined,
    },
  };

  if (status >= 500) logger.error({ err, path: req.originalUrl }, 'Unhandled error');
  else logger.warn({ msg: err.message, path: req.originalUrl }, 'Handled error');

  res.status(status).json(payload);
};
