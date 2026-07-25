/**
 * Wraps async route handlers so errors flow to error middleware.
 */
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
