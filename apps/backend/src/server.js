/**
 * Entry point — boots HTTP server after connecting to MongoDB.
 */
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const env = require('./config/env');

const start = async () => {
  try {
    await connectDB();
    const server = app.listen(env.PORT, () => {
      logger.info(`Backend listening on :${env.PORT} (${env.NODE_ENV})`);
    });

    const shutdown = (signal) => {
      logger.info(`${signal} received. Shutting down…`);
      server.close(() => process.exit(0));
      setTimeout(() => process.exit(1), 10000).unref();
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('unhandledRejection', (err) => {
      logger.error({ err }, 'Unhandled rejection');
    });
  } catch (err) {
    logger.error({ err }, 'Fatal boot error');
    process.exit(1);
  }
};

start();
