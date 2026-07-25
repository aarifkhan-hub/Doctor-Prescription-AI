const axios = require('axios');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const client = axios.create({
  baseURL: env.AI_SERVICE_URL,
  timeout: env.AI_SERVICE_TIMEOUT_MS,
  headers: {
    Authorization: `Bearer ${env.AI_SERVICE_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Call FastAPI /v1/predict with a Cloudinary image URL.
 */
exports.predict = async ({ imageUrl, requestId, language = 'en' }) => {
  try {
    const { data } = await client.post('/v1/predict', {
      image_url: imageUrl,
      request_id: requestId,
      language,
    }, { headers: { 'X-Request-Id': requestId } });
    return data;
  } catch (err) {
    const status = err.response?.status || 502;
    const message = err.response?.data?.detail || err.message;
    logger.error({ status, message }, 'AI service error');
    throw new ApiError(502, `AI service error: ${message}`, 'AI_SERVICE_ERROR');
  }
};

exports.health = async () => {
  const { data } = await client.get('/healthz');
  return data;
};
