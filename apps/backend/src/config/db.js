const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

module.exports = async function connectDB() {
  mongoose.set('strictQuery', true);
  const conn = await mongoose.connect(env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 20,
  });
  logger.info(`MongoDB connected: ${conn.connection.host}`);
  mongoose.connection.on('error', (err) => logger.error({ err }, 'Mongo error'));
  mongoose.connection.on('disconnected', () => logger.warn('Mongo disconnected'));
  return conn;
};
