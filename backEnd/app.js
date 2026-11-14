require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { databaseStatus } = require('./config/db');
const { requireAuth } = require('./middleware/auth');
const { requireDatabase } = require('./middleware/db');
const User = require('./models/User');
const BloodRequest = require('./models/BloodRequest');
const HealthRecord = require('./models/HealthRecord');
const Post = require('./models/Post');
const Action = require('./models/Action');
const RequestResponse = require('./models/RequestResponse');
const OtpChallenge = require('./models/OtpChallenge');
const { createOtp, hashOtp, sendOtpEmail, sendWelcomeEmail } = require('./services/email');

const app = express();
const jwtSecret = () => process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'dev-secret';

app.use(cors({
  origin: (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((value) => value.trim()),
}));
app.use(express.json({ limit: '2mb' }));
app.use((req, _res, next) => {
  console.log(`[INFO] ${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

function tokenFor(user) {
  return jwt.sign({ sub: user._id.toString(), mobile: user.mobile }, jwtSecret(), { expiresIn: '7d' });
}

function cleanUser(user) {
  const value = user.toObject ? user.toObject() : user;
  delete value.__v;
  return value;
}

function requiredStrings(body, fields) {
  const missing = fields.filter((field) => typeof body[field] !== 'string' || !body[field].trim());
  if (missing.length) {
    const error = new Error(`Missing required fields: ${missing.join(', ')}`);
    error.status = 400;
    throw error;
  }
}

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

app.get('/api/health', (_req, res) => res.json({
  status: 'ok',
  database: databaseStatus(),
  environment: process.env.NODE_ENV || 'development',
}));

// Authentication still needs MongoDB for account lookup and OTP challenge storage.
// Fail immediately instead of allowing Mongoose queries to buffer until timeout.
app.use('/api/auth', requireDatabase);

app.post('/api/auth/request-otp', asyncRoute(async (req, res) => {
  requiredStrings(req.body, ['name', 'purpose']);
  if (!['register', 'login'].includes(req.body.purpose)) return res.status(400).json({ error: 'Invalid OTP purpose' });
  if (req.body.purpose === 'register') requiredStrings(req.body, ['mobile', 'email']);
  const identifier = String(req.body.identifier || req.body.email || req.body.mobile || '').trim();
  if (req.body.purpose === 'login' && !identifier) {
    return res.status(400).json({ error: 'Enter your email address or mobile number' });
  }
  const email = (req.body.email || '').trim().toLowerCase();
  const mobile = (req.body.mobile || '').trim();
  const existing = req.body.purpose === 'login'
    ? await User.findOne(identifier.includes('@') ? { email: identifier.toLowerCase() } : { mobile: identifier })
    : await User.findOne({ $or: [{ mobile }, { email }] });
  if (req.body.purpose === 'register' && existing) return res.status(409).json({ error: 'An account already exists for this mobile number or email' });
  if (req.body.purpose === 'login' && (!existing || !existing.email)) return res.status(404).json({ error: 'Account not found or no account email is configured' });
  const challengeEmail = existing?.email || email;
  const challengeMobile = existing?.mobile || mobile;
  await OtpChallenge.deleteMany({ email: challengeEmail, purpose: req.body.purpose, verifiedAt: null });
  const code = createOtp();
  await OtpChallenge.create({
    email: challengeEmail, mobile: challengeMobile, purpose: req.body.purpose,
    codeHash: hashOtp(code), expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });
  await sendOtpEmail({ email: challengeEmail, name: existing?.name || req.body.name.trim(), code, purpose: req.body.purpose });
  res.status(202).json({ message: 'Verification code sent', email: challengeEmail, mobile: challengeMobile });
}));

app.post('/api/auth/register', asyncRoute(async (req, res) => {
  requiredStrings(req.body, ['name', 'mobile', 'email', 'verificationToken']);
  const verification = jwt.verify(req.body.verificationToken, jwtSecret());
  if (verification.purpose !== 'register' || verification.email !== req.body.email.toLowerCase() || verification.mobile !== req.body.mobile) {
    return res.status(400).json({ error: 'Invalid registration verification' });
  }
  const user = await User.create({
    name: req.body.name,
    mobile: req.body.mobile,
    email: req.body.email,
    dob: req.body.dob,
    locality: req.body.locality,
    city: req.body.city,
    bloodGroup: req.body.bloodGroup,
    donorConsent: req.body.donorConsent,
    available: req.body.available,
    location: req.body.location,
    locationAccuracyMeters: req.body.locationAccuracyMeters,
    locationCapturedAt: req.body.locationCapturedAt,
  });
  await sendWelcomeEmail({ email: user.email, name: user.name });
  res.status(201).json({ user: cleanUser(user), token: tokenFor(user) });
}));

app.post('/api/auth/login', asyncRoute(async (req, res) => {
  const identifier = String(req.body.identifier || req.body.email || req.body.mobile || '').trim();
  if (!identifier) return res.status(400).json({ error: 'Enter your email address or mobile number' });
  const user = await User.findOne(identifier.includes('@')
    ? { email: identifier.toLowerCase() }
    : { mobile: identifier });
  if (!user) return res.status(404).json({ error: 'Account not found' });
  res.json({ user: cleanUser(user), otpSent: true });
}));

app.post('/api/auth/verify-otp', asyncRoute(async (req, res) => {
  requiredStrings(req.body, ['otp', 'purpose']);
  const identifier = String(req.body.identifier || '').trim();
  const challenge = await OtpChallenge.findOne({
    purpose: req.body.purpose,
    verifiedAt: null,
    ...(req.body.email && req.body.mobile
      ? { mobile: req.body.mobile, email: req.body.email.toLowerCase() }
      : (identifier.includes('@') ? { email: identifier.toLowerCase() } : { mobile: identifier })),
  }).sort({ createdAt: -1 });
  if (!challenge || challenge.expiresAt < new Date()) return res.status(400).json({ error: 'Code expired or not found' });
  if (challenge.attempts >= 5) return res.status(429).json({ error: 'Too many attempts. Request a new code.' });
  challenge.attempts += 1;
  if (hashOtp(req.body.otp) !== challenge.codeHash) { await challenge.save(); return res.status(400).json({ error: 'Invalid verification code' }); }
  challenge.verifiedAt = new Date();
  await challenge.save();
  if (req.body.purpose === 'register') {
    return res.json({ verificationToken: jwt.sign({ purpose: 'register', email: challenge.email, mobile: challenge.mobile }, jwtSecret(), { expiresIn: '15m' }) });
  }
  const user = await User.findOne({ mobile: challenge.mobile, email: challenge.email });
  if (!user) return res.status(404).json({ error: 'Account not found' });
  res.json({ user: cleanUser(user), token: tokenFor(user) });
}));

app.use('/api', requireAuth, requireDatabase);

app.get('/api/user/profile', asyncRoute(async (req, res) => {
  const user = await User.findById(req.user.sub);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: cleanUser(user) });
}));

app.put('/api/user/profile', asyncRoute(async (req, res) => {
  const allowed = ['name', 'email', 'bloodGroup', 'locality', 'city', 'donorConsent', 'available', 'healthPassport', 'notificationPrefs', 'location', 'locationAccuracyMeters', 'locationCapturedAt'];
  const patch = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const user = await User.findByIdAndUpdate(req.user.sub, { $set: patch }, { new: true, runValidators: true });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: cleanUser(user) });
}));

app.get('/api/requests', asyncRoute(async (req, res) => {
  const filter = req.query.mine === 'true' ? { requesterId: req.user.sub } : { status: 'open', requesterId: { $ne: req.user.sub } };
  const requests = await BloodRequest.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  res.json(requests);
}));

app.post('/api/requests', asyncRoute(async (req, res) => {
  requiredStrings(req.body, ['patientName', 'bloodGroup', 'urgency', 'requiredBy', 'hospital', 'locality']);
  const request = await BloodRequest.create({ ...req.body, requesterId: req.user.sub });
  await Action.create({ userId: req.user.sub, kind: 'Blood request', status: 'created', metadata: { requestId: request._id } });
  res.status(201).json(request);
}));

app.patch('/api/requests/:id/status', asyncRoute(async (req, res) => {
  const request = await BloodRequest.findOneAndUpdate(
    { _id: req.params.id, requesterId: req.user.sub },
    { $set: { status: req.body.status } },
    { new: true, runValidators: true },
  );
  if (!request) return res.status(404).json({ error: 'Request not found' });
  res.json(request);
}));

app.post('/api/requests/:id/respond', asyncRoute(async (req, res) => {
  const request = await BloodRequest.findOne({ _id: req.params.id, status: 'open' });
  if (!request) return res.status(404).json({ error: 'Open request not found' });
  const response = await RequestResponse.create({ requestId: request._id, donorId: req.user.sub });
  await Action.create({ userId: req.user.sub, kind: 'Donor response', status: 'sent', metadata: { requestId: request._id } });
  res.status(201).json(response);
}));

app.get('/api/requests/:id/responses', asyncRoute(async (req, res) => {
  const request = await BloodRequest.findOne({ _id: req.params.id, requesterId: req.user.sub });
  if (!request) return res.status(404).json({ error: 'Request not found' });
  res.json(await RequestResponse.find({ requestId: request._id }).populate('donorId', 'name bloodGroup locality'));
}));

app.patch('/api/responses/:id/status', asyncRoute(async (req, res) => {
  const response = await RequestResponse.findOneAndUpdate(
    { _id: req.params.id, donorId: req.user.sub },
    { $set: { status: req.body.status } },
    { new: true, runValidators: true },
  );
  if (!response) return res.status(404).json({ error: 'Response not found' });
  res.json(response);
}));

app.get('/api/health/records', asyncRoute(async (req, res) => {
  res.json(await HealthRecord.find({ userId: req.user.sub }).sort({ createdAt: -1 }).limit(200).lean());
}));

app.post('/api/health/assessments', asyncRoute(async (req, res) => {
  const record = await HealthRecord.create({ userId: req.user.sub, kind: 'assessment', data: req.body });
  res.status(201).json(record);
}));

app.post('/api/health/documents', asyncRoute(async (req, res) => {
  requiredStrings(req.body, ['name', 'category', 'type']);
  const record = await HealthRecord.create({
    userId: req.user.sub,
    kind: 'document',
    data: { ...req.body, processingStatus: 'queued', verificationStatus: 'unverified' },
  });
  res.status(201).json(record);
}));

app.delete('/api/health/documents/:id', asyncRoute(async (req, res) => {
  const result = await HealthRecord.deleteOne({ _id: req.params.id, userId: req.user.sub, kind: 'document' });
  if (!result.deletedCount) return res.status(404).json({ error: 'Document not found' });
  res.status(204).end();
}));

app.get('/api/actions', asyncRoute(async (req, res) => {
  res.json(await Action.find({ userId: req.user.sub }).sort({ createdAt: -1 }).limit(100).lean());
}));

app.post('/api/actions', asyncRoute(async (req, res) => {
  requiredStrings(req.body, ['kind', 'status']);
  res.status(201).json(await Action.create({ userId: req.user.sub, kind: req.body.kind, status: req.body.status, metadata: req.body.metadata }));
}));

app.get('/api/community/posts', asyncRoute(async (_req, res) => {
  res.json(await Post.find({ blocked: false }).populate('authorId', 'name bloodGroup').sort({ createdAt: -1 }).limit(100).lean());
}));

app.post('/api/community/posts', asyncRoute(async (req, res) => {
  requiredStrings(req.body, ['kind', 'text']);
  res.status(201).json(await Post.create({ authorId: req.user.sub, kind: req.body.kind, text: req.body.text }));
}));

app.post('/api/community/posts/:id/like', asyncRoute(async (req, res) => {
  const post = await Post.findOneAndUpdate({ _id: req.params.id, blocked: false }, { $inc: { likes: 1 } }, { new: true });
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
}));

app.get('/api/directory/hospitals', (_req, res) => res.json([
  { id: 'h1', name: 'Sanjeevani Multispeciality', area: 'Salt Lake Sector V', bloodBank: true },
  { id: 'h2', name: 'Lifeline Medical Centre', area: 'Park Circus', bloodBank: true },
  { id: 'h3', name: 'Arogya Hospital', area: 'New Town', bloodBank: false },
]));

app.use((err, _req, res, _next) => {
  console.error(`[ERROR] ${new Date().toISOString()} ${err.message}`);
  if (err.code === 11000) return res.status(409).json({ error: 'A record with these details already exists' });
  if (err instanceof mongoose.Error.ValidationError) return res.status(400).json({ error: err.message });
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
