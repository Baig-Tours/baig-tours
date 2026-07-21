const jwt = require('jsonwebtoken');
const apiResponse = require('../utils/apiResponse');
const User = require('../models/User');

/**
 * verifyToken — reads the JWT from the httpOnly cookie, verifies it,
 * and attaches the authenticated user (minus password) to req.user.
 * Rejects with 401 if the cookie is missing, invalid, or expired.
 */
const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.[process.env.COOKIE_NAME || 'token'];

    if (!token) {
      return apiResponse(res, false, 'Not authenticated. Please log in.', null, [], 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      return apiResponse(res, false, 'Session is no longer valid.', null, [], 401);
    }

    req.user = user;
    next();
  } catch (err) {
    return apiResponse(res, false, 'Invalid or expired session.', null, [], 401);
  }
};

/**
 * requireAdmin — role gate, applied AFTER verifyToken.
 * Usage:
 *   router.get('/admin/settings', verifyToken, requireAdmin(['superadmin']), handler)
 *   router.get('/admin/bookings', verifyToken, requireAdmin(), handler) // any admin role
 *
 * @param {string[]} [allowedRoles] - roles permitted; defaults to ['admin', 'superadmin']
 */
const requireAdmin = (allowedRoles = ['admin', 'superadmin']) => {
  return (req, res, next) => {
    if (!req.user) {
      return apiResponse(res, false, 'Not authenticated.', null, [], 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return apiResponse(res, false, 'You do not have permission to perform this action.', null, [], 403);
    }

    next();
  };
};

module.exports = { verifyToken, requireAdmin };
