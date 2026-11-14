const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  kind: { type: String, enum: ['story', 'awareness', 'event', 'announcement'], required: true },
  text: { type: String, required: true, trim: true, maxlength: 2000 },
  likes: { type: Number, default: 0, min: 0 },
  blocked: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
