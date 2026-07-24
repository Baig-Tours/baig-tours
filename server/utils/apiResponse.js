/**
 * apiResponse — the single shared response contract for the entire API.
 * Every controller across every module (Dev 1–7) must send responses
 * through this helper so the frontend can rely on one consistent shape:
 *
 *   Success: { success: true,  message, data }
 *   Error:   { success: false, message, errors }
 *
 * @param {import('express').Response} res  - Express response object
 * @param {boolean} success                 - true for success, false for error
 * @param {string} message                  - human-readable message
 * @param {object|array|null} [data]        - payload on success (omit or null on error)
 * @param {array|object|null} [errors]      - validation/error details on failure
 * @param {number} [statusCode]             - HTTP status code (default 200 success / 400 error)
 */
const apiResponse = (
  res,
  success,
  message = '',
  data = null,
  errors = null,
  statusCode
) => {
  const code = statusCode || (success ? 200 : 400);

  const body = { success, message };

  if (success) {
    body.data = data;
  } else {
    body.errors = errors || [];
  }

  return res.status(code).json(body);
};

module.exports = apiResponse;
