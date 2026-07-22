const express = require('express');
const router = express.Router();

const {
  getPublicBlogs,
  getBlogBySlug,
  getAdminBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

const {
  createBlogValidation,
  updateBlogValidation,
} = require('../validators/blogValidator');

const validate = require('../middleware/validateMiddleware');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// Public Routes
router.get('/blogs', getPublicBlogs);
router.get('/blogs/:slug', getBlogBySlug);

// Admin Protected Routes
router.get('/admin/blogs', verifyToken, requireAdmin, getAdminBlogs);
router.post('/admin/blogs', verifyToken, requireAdmin, createBlogValidation, validate, createBlog);
router.put('/admin/blogs/:id', verifyToken, requireAdmin, updateBlogValidation, validate, updateBlog);
router.delete('/admin/blogs/:id', verifyToken, requireAdmin, deleteBlog);

module.exports = router;
