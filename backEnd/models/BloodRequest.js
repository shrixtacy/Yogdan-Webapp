const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  patientName: { type: String, required: true, trim: true, maxlength: 120 },
  patientAge: { type: Number, min: 0, max: 130 },
  relation: { type: String, trim: true, maxlength: 80 },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], required: true },
  units: { type: Number, required: true, min: 1, max: 10 },
  urgency: { type: String, enum: ['critical', 'urgent', 'planned'], required: true },
  requiredBy: { type: Date, required: true },
  hospital: { type: String, required: true, trim: true, maxlength: 180 },
  hospitalArea: { type: String, trim: true, maxlength: 120 },
  locality: { type: String, required: true, trim: true, maxlength: 120 },
  contactName: { type: String, trim: true, maxlength: 120 },
  notes: { type: String, trim: true, maxlength: 1000 },
  status: { type: String, enum: ['open', 'cancelled', 'fulfilled'], default: 'open', index: true },
}, { timestamps: true });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
