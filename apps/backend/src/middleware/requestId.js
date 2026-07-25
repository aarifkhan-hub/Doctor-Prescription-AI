const { v4: uuidv4 } = require('uuid');

exports.requestId = (req, res, next) => {
  const id = req.headers['x-request-id'] || uuidv4();
  res.locals.requestId = id;
  res.setHeader('X-Request-Id', id);
  next();
};
