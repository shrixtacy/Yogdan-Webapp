const mongoose = require('mongoose');

function requireDatabase(_req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database is not connected', code: 'DATABASE_UNAVAILABLE' });
  }
  next();
}

module.exports = { requireDatabase };
