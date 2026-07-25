const ApiError = require('../utils/ApiError');

/**
 * Validate req parts (body/query/params) against a Zod schema map.
 * Usage: validate({ body: schema })
 */
module.exports = (schemas) => (req, res, next) => {
  try {
    ['body', 'query', 'params'].forEach((key) => {
      if (schemas[key]) {
        req[key] = schemas[key].parse(req[key]);
      }
    });
    next();
  } catch (err) {
    next(new ApiError(400, 'Validation failed', 'VALIDATION_ERROR', err.errors || err.message));
  }
};
