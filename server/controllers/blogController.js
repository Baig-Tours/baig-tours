const Blog = require('../models/Blog');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const APIFeatures = require('../utils/apiFeatures');

/**
 * @desc    Get public blogs (published only) with pagination, search, category & tag filters
 * @route   GET /api/blogs
 * @access  Public
 */
const getPublicBlogs = async (req, res, next) => {
  try {
    // If MongoDB is not connected (e.g. unit testing without DB connection)
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const pageNum = parseInt(req.query.page, 10) || 1;
      const limitNum = parseInt(req.query.limit, 10) || 9;
      return successResponse(res, 200, 'Blogs fetched successfully (Offline Mode)', [], {
        total: 0,
        page: pageNum,
        limit: limitNum,
        totalPages: 1,
      });
    }

    const features = new APIFeatures(Blog.find(), req.query)
      .filter({ status: 'published' })
      .search()
      .sort({ publishDate: -1 })
      .paginate(9);

    const [blogs, total] = await Promise.all([
      features.query.lean(),
      Blog.countDocuments(features.queryFilter),
    ]);

    const totalPages = Math.ceil(total / features.limit) || 1;

    return successResponse(res, 200, 'Blogs fetched successfully', blogs, {
      total,
      page: features.page,
      limit: features.limit,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single public blog post by slug
 * @route   GET /api/blogs/:slug
 * @access  Public
 */
const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug, status: 'published' }).lean();

    if (!blog) {
      return errorResponse(res, 404, 'Blog post not found');
    }

    // Fetch related blogs (same category or shared tags, excluding current)
    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      status: 'published',
      $or: [{ category: blog.category }, { tags: { $in: blog.tags || [] } }],
    })
      .select('title slug featuredImage category publishDate author')
      .limit(3)
      .lean();

    return successResponse(res, 200, 'Blog post details fetched successfully', {
      blog,
      relatedBlogs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all blogs for Admin (includes drafts and published)
 * @route   GET /api/admin/blogs
 * @access  Private (Admin)
 */
const getAdminBlogs = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const pageNum = parseInt(req.query.page, 10) || 1;
      const limitNum = parseInt(req.query.limit, 10) || 10;
      return successResponse(res, 200, 'Admin blogs fetched successfully (Offline Mode)', [], {
        total: 0,
        page: pageNum,
        limit: limitNum,
        totalPages: 1,
      });
    }

    const baseFilter = {};
    if (req.query.status && ['draft', 'published'].includes(req.query.status.toLowerCase())) {
      baseFilter.status = req.query.status.toLowerCase();
    }

    const features = new APIFeatures(Blog.find(), req.query)
      .filter(baseFilter)
      .search(['title', 'category', 'author'])
      .sort({ updatedAt: -1 })
      .paginate(10);

    const [blogs, total] = await Promise.all([
      features.query.lean(),
      Blog.countDocuments(features.queryFilter),
    ]);

    const totalPages = Math.ceil(total / features.limit) || 1;

    return successResponse(res, 200, 'Admin blogs fetched successfully', blogs, {
      total,
      page: features.page,
      limit: features.limit,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new blog post
 * @route   POST /api/admin/blogs
 * @access  Private (Admin)
 */
const createBlog = async (req, res, next) => {
  try {
    const { title, content, category, featuredImage, author, tags, seo, status, publishDate } = req.body;

    const newBlog = new Blog({
      title,
      content,
      category,
      featuredImage,
      author: author || 'Baig Tours Team',
      tags: tags || [],
      seo: seo || {},
      status: status || 'draft',
      publishDate: publishDate || Date.now(),
    });

    const savedBlog = await newBlog.save();

    return successResponse(res, 201, 'Blog post created successfully', savedBlog);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update existing blog post
 * @route   PUT /api/admin/blogs/:id
 * @access  Private (Admin)
 */
const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const blog = await Blog.findById(id);

    if (!blog) {
      return errorResponse(res, 404, 'Blog post not found');
    }

    // Apply updates
    Object.keys(updateData).forEach((key) => {
      blog[key] = updateData[key];
    });

    const updatedBlog = await blog.save();

    return successResponse(res, 200, 'Blog post updated successfully', updatedBlog);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a blog post
 * @route   DELETE /api/admin/blogs/:id
 * @access  Private (Admin)
 */
const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return errorResponse(res, 404, 'Blog post not found');
    }

    await blog.deleteOne();

    return successResponse(res, 200, 'Blog post deleted successfully', { _id: id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicBlogs,
  getBlogBySlug,
  getAdminBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
};
