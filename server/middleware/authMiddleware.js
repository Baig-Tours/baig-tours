/**
 * Authentication Middleware (Placeholder / Stub)
 * Note: Full Authentication & JWT Security is owned by Developer 1 (feature/auth-platform-core).
 * These pass-through stubs ensure Developer 5's blog module endpoints function smoothly without hard dependencies during development.
 */

const verifyToken = (req, res, next) => {
  // Attach mock user session for development
  req.user = { id: 'admin_dev_id', role: 'admin', name: 'Admin Dev' };
  next();
};

const requireAdmin = (req, res, next) => {
  next();
};

module.exports = {
  verifyToken,
  requireAdmin,
};
