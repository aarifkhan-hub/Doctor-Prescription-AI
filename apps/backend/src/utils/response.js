/**
 * Uniform success envelope.
 */
exports.ok = (res, data = {}, meta = {}, status = 200) =>
  res.status(status).json({
    success: true,
    requestId: res.locals.requestId,
    data,
    meta,
  });
