const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    if (process.env.NODE_ENV === 'production') throw new Error('MONGODB_URI is required in production');
    return { connected: false, state: 'not_configured' };
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
    return { connected: true, state: 'connected' };
  } catch (error) {
    if (process.env.NODE_ENV === 'production') throw error;
    console.error(`[ERROR] MongoDB connection failed: ${error.message}`);
    return { connected: false, state: 'disconnected' };
  }
}

function databaseStatus() {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] || 'unknown';
}

module.exports = { connectDB, databaseStatus };
