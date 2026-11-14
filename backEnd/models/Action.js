const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  kind: { type: String, required: true, trim: true, maxlength: 100 },
  status: { type: String, required: true, trim: true, maxlength: 80 },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Action', actionSchema);
