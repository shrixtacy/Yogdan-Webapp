// Redis client stub — not connected in dev mode
const logger = require('../utils/logger');

const client = {
  get: async () => null,
  set: async () => null,
  del: async () => null,
};

logger.info('Redis running in stub mode');

module.exports = client;
