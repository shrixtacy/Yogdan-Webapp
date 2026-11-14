const mongoose = require('mongoose');

const otpChallengeSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  mobile: { type: String, required: true, trim: true },
  purpose: { type: String, enum: ['register', 'login'], required: true },
  codeHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  verifiedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('OtpChallenge', otpChallengeSchema);
