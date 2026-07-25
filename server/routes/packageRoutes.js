const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createPackageRules, updatePackageRules } = require('../validators/packageValidator');
const {
  getPackages,
  getPackageBySlug,
  getFeaturedPackages,
  getAdminPackages,
  createPackage,
  updatePackage,
  deletePackage,
  duplicatePackage,
  uploadPackageMedia,
} = require('../controllers/packageController');

// ---- Public routes ----
// NOTE: /featured must come before /:slug, or Express will treat
// "featured" as a slug value and this route will never be reached.
router.get('/packages/featured', getFeaturedPackages);
router.get('/packages/:slug', getPackageBySlug);
router.get('/packages', getPackages);

// ---- Admin routes (protected) ----
router.get('/admin/packages', verifyToken, requireAdmin(), getAdminPackages);

router.post(
  '/admin/packages',
  verifyToken,
  requireAdmin(),
  upload.array('images', 10),
  createPackageRules,
  validate,
  createPackage
);

router.put(
  '/admin/packages/:id',
  verifyToken,
  requireAdmin(),
  updatePackageRules,
  validate,
  updatePackage
);

router.delete('/admin/packages/:id', verifyToken, requireAdmin(), deletePackage);
router.post('/admin/packages/:id/duplicate', verifyToken, requireAdmin(), duplicatePackage);

router.post(
  '/admin/packages/:id/media',
  verifyToken,
  requireAdmin(),
  upload.array('images', 10),
  uploadPackageMedia
);

module.exports = router;