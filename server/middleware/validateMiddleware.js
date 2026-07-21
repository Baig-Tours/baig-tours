const { validationResult } = require('express-validator');
const apiResponse = require('../utils/apiResponse');

/**
 * validateMiddleware — runs after an express-validator rule chain
 * (defined per-resource in server/validators/) and short-circuits
 * with a 400 + field-level error list if any rule failed.
 *
 * Usage:
 *   const { loginValidator } = require('../validators/authValidator');
 *   router.post('/auth/login', loginValidator, validateMiddleware, login);
 */
const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));

    return apiResponse(res, false, 'Validation failed.', null, formatted, 400);
  }

  next();
};

module.exports = validateMiddleware;
