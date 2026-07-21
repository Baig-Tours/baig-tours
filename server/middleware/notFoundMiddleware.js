const apiResponse = require('../utils/apiResponse');

/**
 * notFoundMiddleware — catches any request that didn't match a mounted
 * route and returns a clean 404 in the standard response shape.
 * Registered after all app.use('/api/...') route mounts, before errorMiddleware.
 */
const notFoundMiddleware = (req, res) => {
  return apiResponse(
    res,
    false,
    `Route not found: ${req.method} ${req.originalUrl}`,
    null,
    [],
    404
  );
};

module.exports = notFoundMiddleware;
