const crypto = require('crypto');
const nodemailer = require('nodemailer');

function requiredConfig() {
  if (process.env.MAIL_PROVIDER === 'gmail') {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      const error = new Error('Gmail SMTP is not configured');
      error.status = 503;
      error.code = 'EMAIL_PROVIDER_UNAVAILABLE';
      throw error;
    }
    return;
  }
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    const error = new Error('Email provider is not configured');
    error.status = 503;
    error.code = 'EMAIL_PROVIDER_UNAVAILABLE';
    throw error;
  }
}

async function sendEmail({ to, subject, html }) {
  requiredConfig();
  if (process.env.MAIL_PROVIDER === 'gmail') {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });
    try {
      return await transporter.sendMail({ from: `Yogdan <${process.env.GMAIL_USER}>`, to, subject, html });
    } catch (error) {
      const deliveryError = new Error(error.message || 'Gmail delivery failed');
      deliveryError.status = 502;
      deliveryError.code = 'EMAIL_DELIVERY_FAILED';
      throw deliveryError;
    }
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, to: [to], subject, html }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.message || 'Email delivery failed');
    error.status = 502;
    error.code = 'EMAIL_DELIVERY_FAILED';
    throw error;
  }
  return body;
}

function createOtp() {
  return String(crypto.randomInt(100000, 1000000));
}

function hashOtp(code) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

async function sendOtpEmail({ email, name, code, purpose }) {
  const action = purpose === 'register' ? 'finish creating your Yogdan account' : 'sign in to Yogdan';
  return sendEmail({
    to: email,
    subject: `${code} is your Yogdan verification code`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>Welcome to Yogdan${name ? `, ${name}` : ''}</h2><p>Use this code to ${action}:</p><p style="font-size:30px;font-weight:700;letter-spacing:8px">${code}</p><p>This code expires in 10 minutes and can be used once. If you did not request it, you can ignore this email.</p></div>`,
  });
}

async function sendWelcomeEmail({ email, name }) {
  return sendEmail({
    to: email,
    subject: 'Welcome to Yogdan',
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>Welcome to Yogdan, ${name}</h2><p>Your account is ready. You can now connect with blood donors and receivers, maintain your health records, and participate in the community.</p><p>Yogdan keeps your health information private and does not replace professional medical advice.</p></div>`,
  });
}

module.exports = { createOtp, hashOtp, sendOtpEmail, sendWelcomeEmail };
