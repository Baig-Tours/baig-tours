const apiResponse = require('../utils/apiResponse');

/**
 * asyncHandler — wraps async controller functions so any thrown/rejected
 * error is forwarded to errorMiddleware via next(err) instead of crashing
 * the process. Every controller across every module must use this.
 *
 * Usage: exports.createPackage = asyncHandler(async (req, res) => { ... });
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * errorMiddleware — the single centralized error handler. Must be
 * registered LAST in app.js, after all routes. Normalizes Mongoose
 * validation errors, cast errors (bad ObjectId), and duplicate-key
 * errors into the standard apiResponse shape, then falls back to a
 * generic 500 for anything unexpected.
 */
const errorMiddleware = (err, req, res, next) => {
  console.error(`[error] ${req.method} ${req.originalUrl} ->`, err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return apiResponse(res, false, 'Validation failed.', null, errors, 400);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return apiResponse(res, false, `Invalid ${err.path}: ${err.value}`, null, [], 400);
  }

  // Mongoose duplicate key error (e.g. unique slug/email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return apiResponse(res, false, `Duplicate value for '${field}'. It must be unique.`, null, [], 409);
  }

  // JWT errors that slip through outside authMiddleware
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return apiResponse(res, false, 'Invalid or expired session.', null, [], 401);
  }

  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  const message = statusCode === 500 ? 'Internal server error.' : err.message;

  return apiResponse(res, false, message, null, [], statusCode);
};

module.exports = { errorMiddleware, asyncHandler };
