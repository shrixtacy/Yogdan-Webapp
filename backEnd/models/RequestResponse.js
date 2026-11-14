const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodRequest', required: true, index: true },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['sent', 'contacted', 'confirmed', 'declined'], default: 'sent' },
}, { timestamps: true });

responseSchema.index({ requestId: 1, donorId: 1 }, { unique: true });

module.exports = mongoose.model('RequestResponse', responseSchema);
