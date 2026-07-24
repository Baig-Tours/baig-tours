const express = require('express');
const router = express.Router();

const {
  getPackages,
  getPackageBySlug,
  getFeaturedPackages,
  getAdminPackages,
  createPackage,
  updatePackage,
  deletePackage,
  duplicatePackage,
  addPackageMedia,
} = require('../controllers/packageController');

const { upload } = require('../middleware/uploadMiddleware');

// NOTE: verifyToken / requireAdmin from Dev 1's authMiddleware will be
// added here once available (expected Day 1 EOD). Admin routes below
// are placeholders until then.

// ---- Public routes ----
router.get('/packages', getPackages);
router.get('/packages/featured', getFeaturedPackages);
router.get('/packages/:slug', getPackageBySlug);

// ---- Admin routes (auth middleware to be added) ----
router.get('/admin/packages', getAdminPackages);
router.post('/admin/packages', upload.array('images', 10), createPackage);
router.put('/admin/packages/:id', updatePackage);
router.delete('/admin/packages/:id', deletePackage);
router.post('/admin/packages/:id/duplicate', duplicatePackage);
router.post(
  '/admin/packages/:id/media',
  upload.array('media', 10),
  addPackageMedia
);

module.exports = router;
