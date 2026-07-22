const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/apiResponse');

const verifyToken = (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      // In development mode when auth is not explicitly configured, pass mock user or reject
      if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
        req.user = { id: 'admin_dev_id', role: 'admin', name: 'Admin Dev' };
        return next();
      }
      return errorResponse(res, 401, 'Access denied. Authorization token missing.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'baig_tours_jwt_secret_dev_key');
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Invalid or expired authorization token.');
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
    return errorResponse(res, 403, 'Forbidden. Admin privileges required.');
  }
  next();
};

module.exports = {
  verifyToken,
  requireAdmin,
};
