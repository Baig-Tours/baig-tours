const { errorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err);

  // Mongoose duplicate key error (e.g. unique slug collision)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return errorResponse(res, 400, `Duplicate value entered for ${field}. Must be unique.`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return errorResponse(res, 400, 'Validation Error', errors);
  }

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    return errorResponse(res, 400, `Invalid ${err.path}: ${err.value}`);
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  return errorResponse(res, statusCode, err.message || 'Internal Server Error');
};

const notFound = (req, res, next) => {
  return errorResponse(res, 404, `Not Found - ${req.originalUrl}`);
};

module.exports = {
  errorHandler,
  notFound,
};
