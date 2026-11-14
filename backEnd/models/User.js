const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  mobile: { type: String, required: true, unique: true, trim: true, index: true },
  email: { type: String, trim: true, lowercase: true, maxlength: 160 },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'], default: 'Unknown' },
  bloodVerification: { type: String, enum: ['unverified', 'pending', 'verified'], default: 'unverified' },
  locality: { type: String, trim: true, maxlength: 120 },
  city: { type: String, trim: true, maxlength: 120 },
  location: {
    type: { type: String, enum: ['Point'] },
    coordinates: { type: [Number], validate: { validator: (value) => !value || value.length === 2, message: 'Location coordinates must contain longitude and latitude' } },
  },
  locationAccuracyMeters: { type: Number, min: 0 },
  locationCapturedAt: { type: Date },
  donorConsent: { type: Boolean, default: false },
  available: { type: Boolean, default: false },
  healthPassport: { type: mongoose.Schema.Types.Mixed, default: {} },
  notificationPrefs: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true, strict: true });

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
