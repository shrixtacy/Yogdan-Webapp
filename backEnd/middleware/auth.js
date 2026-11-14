const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing bearer token' });
  try {
    req.user = jwt.verify(header.slice(7), process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'dev-secret');
    next();
  } catch {
    res.status(401).json({ error: 'Token invalid or expired' });
  }
}

module.exports = { requireAuth };
