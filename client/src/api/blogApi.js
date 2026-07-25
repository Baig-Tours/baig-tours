import axiosClient from './axiosClient';

/**
 * Fetch published blogs for public view
 * @param {Object} params - { page, limit, search, category, tag }
 */
export const fetchPublishedBlogs = (params = {}) => {
  return axiosClient.get('/blogs', { params });
};

/**
 * Fetch single published blog details by slug
 * @param {string} slug
 */
export const fetchBlogBySlug = (slug) => {
  return axiosClient.get(`/blogs/${slug}`);
};

/**
 * Fetch all blogs (drafts + published) for Admin table
 * @param {Object} params - { page, limit, search, status }
 */
export const fetchAdminBlogs = (params = {}) => {
  return axiosClient.get('/admin/blogs', { params });
};

/**
 * Create a new blog post
 * @param {FormData|Object} blogData
 */
export const createBlog = (blogData) => {
  const isFormData = typeof FormData !== 'undefined' && blogData instanceof FormData;
  return axiosClient.post('/admin/blogs', blogData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
};

/**
 * Update an existing blog post
 * @param {string} id
 * @param {FormData|Object} blogData
 */
export const updateBlog = (id, blogData) => {
  const isFormData = typeof FormData !== 'undefined' && blogData instanceof FormData;
  return axiosClient.put(`/admin/blogs/${id}`, blogData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
};

/**
 * Delete a blog post by ID
 * @param {string} id
 */
export const deleteBlog = (id) => {
  return axiosClient.delete(`/admin/blogs/${id}`);
};

export default {
  fetchPublishedBlogs,
  fetchBlogBySlug,
  fetchAdminBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
};
