// Business logic for Package endpoints.
// Filled in on Day 2 once Dev 1's asyncHandler/apiResponse helpers are available.

// ---- Public endpoints ----
exports.getPackages = async (req, res) => {
  // GET /api/packages — list with search, filter, sort, pagination
};

exports.getPackageBySlug = async (req, res) => {
  // GET /api/packages/:slug — single package + related + approved reviews
};

exports.getFeaturedPackages = async (req, res) => {
  // GET /api/packages/featured
};

// ---- Admin endpoints ----
exports.getAdminPackages = async (req, res) => {
  // GET /api/admin/packages — includes drafts
};

exports.createPackage = async (req, res) => {
  // POST /api/admin/packages — multipart/form-data with images
};

exports.updatePackage = async (req, res) => {
  // PUT /api/admin/packages/:id
};

exports.deletePackage = async (req, res) => {
  // DELETE /api/admin/packages/:id
};

exports.duplicatePackage = async (req, res) => {
  // POST /api/admin/packages/:id/duplicate — clone as new draft
};

exports.addPackageMedia = async (req, res) => {
  // POST /api/admin/packages/:id/media — extra gallery images/videos
};
