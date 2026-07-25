/**
 * Express application factory.
 * Wires middleware, routes, and error handlers.
 */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const morgan = require('morgan');

const env = require('./config/env');
const routes = require('./routes');
const { requestId } = require('./middleware/requestId');
const { notFound, errorHandler } = require('./middleware/error');
const { globalLimiter } = require('./middleware/rateLimit');
const logger = require('./utils/logger');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: env.CORS_ORIGIN.split(',').map((s) => s.trim()),
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(hpp());
app.use(requestId);
app.use(morgan('tiny', { stream: { write: (m) => logger.info(m.trim()) } }));
app.use(globalLimiter);

app.use(env.API_PREFIX, routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
