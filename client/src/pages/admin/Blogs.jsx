import { useState, useEffect } from 'react';
import { Plus, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { fetchAdminBlogs, createBlog, updateBlog, deleteBlog } from '../../api/blogApi';

import BlogStatsCards from '../../components/admin/blogs/BlogStatsCards';
import BlogFilterBar from '../../components/admin/blogs/BlogFilterBar';
import BlogTable from '../../components/admin/blogs/BlogTable';
import BlogFormModal from '../../components/admin/blogs/BlogFormModal';
import BlogDeleteModal from '../../components/admin/blogs/BlogDeleteModal';

const CATEGORIES = ['Tour Guide', 'Travel Article', 'Visa Guide', 'Travel Tip', 'Destinations'];

const Blogs = () => {
  // Main Data States
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Pagination & Filter States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    category: 'Tour Guide',
    author: 'Baig Tours Team',
    status: 'draft',
    publishDate: new Date().toISOString().split('T')[0],
    content: '',
    metaTitle: '',
    metaDescription: '',
  });

  // Tags State
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // Featured Image State with Inline Preview Fallback
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Delete Dialog State
  const [deleteId, setDeleteId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Helper to trigger data refetch after mutation
  const refreshBlogs = () => {
    setLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  // Fetch Admin Blogs inside useEffect safely without synchronous setState in effect body
  useEffect(() => {
    let isCancelled = false;

    const executeFetch = async () => {
      try {
        setError(null);
        const response = await fetchAdminBlogs({
          page,
          limit: 10,
          search: search.trim() || undefined,
          status: statusFilter || undefined,
          category: categoryFilter || undefined,
        });

        if (!isCancelled && response.success) {
          setBlogs(response.data || []);
          if (response.pagination) {
            setTotalPages(response.pagination.totalPages || 1);
            setTotalCount(response.pagination.total || response.data.length);
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Failed to load blog posts.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    executeFetch();

    return () => {
      isCancelled = true;
    };
  }, [page, search, statusFilter, categoryFilter, reloadKey]);

  // Handle Form Modal Open
  const handleOpenModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title || '',
        category: blog.category || 'Tour Guide',
        author: blog.author || 'Baig Tours Team',
        status: blog.status || 'draft',
        publishDate: blog.publishDate ? new Date(blog.publishDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        content: blog.content || '',
        metaTitle: blog.seo?.metaTitle || '',
        metaDescription: blog.seo?.metaDescription || '',
      });
      setTags(blog.tags || []);
      setImagePreview(blog.featuredImage?.url || '');
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        category: 'Tour Guide',
        author: 'Baig Tours Team',
        status: 'draft',
        publishDate: new Date().toISOString().split('T')[0],
        content: '',
        metaTitle: '',
        metaDescription: '',
      });
      setTags(['travel', 'pakistan']);
      setImagePreview('');
    }
    setImageFile(null);
    setTagInput('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
    setImageFile(null);
    setImagePreview('');
  };

  // Image Selection with Local URL Preview Fallback
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file.', 'error');
        return;
      }
      setImageFile(file);
      const localPreviewUrl = URL.createObjectURL(file);
      setImagePreview(localPreviewUrl);
    }
  };

  // Tag Handling
  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Title is required.', 'error');
      return;
    }
    if (!formData.content.trim()) {
      showToast('Article content cannot be empty.', 'error');
      return;
    }

    try {
      setSubmitting(true);

      // Construct payload: use FormData if an image file is selected, or JSON object otherwise
      let payload;
      if (imageFile) {
        payload = new FormData();
        payload.append('title', formData.title.trim());
        payload.append('category', formData.category);
        payload.append('author', formData.author.trim() || 'Baig Tours Team');
        payload.append('status', formData.status);
        payload.append('publishDate', formData.publishDate);
        payload.append('content', formData.content);
        payload.append('tags', JSON.stringify(tags));
        payload.append('seo[metaTitle]', formData.metaTitle.trim());
        payload.append('seo[metaDescription]', formData.metaDescription.trim());
        payload.append('featuredImage', imageFile);
      } else {
        const finalImage = imagePreview
          ? { url: imagePreview, publicId: 'blog_img_' + Date.now() }
          : {
              url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
              publicId: 'blog_default',
            };

        payload = {
          title: formData.title.trim(),
          category: formData.category,
          author: formData.author.trim() || 'Baig Tours Team',
          status: formData.status,
          publishDate: formData.publishDate,
          content: formData.content,
          tags,
          featuredImage: finalImage,
          seo: {
            metaTitle: formData.metaTitle.trim(),
            metaDescription: formData.metaDescription.trim(),
          },
        };
      }

      if (editingBlog) {
        await updateBlog(editingBlog._id, payload);
        showToast('Blog post updated successfully!');
      } else {
        await createBlog(payload);
        showToast('Blog post created successfully!');
      }

      handleCloseModal();
      refreshBlogs();
    } catch (err) {
      showToast(err.message || 'Failed to save blog post.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteBlog(deleteId);
      showToast('Blog post deleted successfully.');
      setDeleteId(null);
      refreshBlogs();
    } catch (err) {
      showToast(err.message || 'Failed to delete blog post.', 'error');
    }
  };

  const publishedCount = blogs.filter((b) => b.status === 'published').length;
  const draftCount = blogs.filter((b) => b.status === 'draft').length;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
      {/* Alert Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-3 transition-all transform translate-y-0 ${
            toast.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}
        >
          {toast.type === 'error' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Blog Management</h1>
          <p className="text-slate-500 text-sm mt-1">Create, edit, publish, and moderate articles for Baig Tours</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all duration-200 hover:shadow"
        >
          <Plus className="w-5 h-5" />
          Create New Article
        </button>
      </div>

      {/* Quick Analytics Cards */}
      <BlogStatsCards totalCount={totalCount} publishedCount={publishedCount} draftCount={draftCount} />

      {/* Filters Bar */}
      <BlogFilterBar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={CATEGORIES}
        setPage={setPage}
      />

      {/* Blogs Data Table */}
      <BlogTable
        loading={loading}
        error={error}
        blogs={blogs}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        totalCount={totalCount}
        onEdit={handleOpenModal}
        onDelete={(id) => setDeleteId(id)}
        onOpenModal={() => handleOpenModal()}
      />

      {/* Create / Edit Modal */}
      <BlogFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingBlog={editingBlog}
        formData={formData}
        setFormData={setFormData}
        tags={tags}
        tagInput={tagInput}
        setTagInput={setTagInput}
        handleAddTag={handleAddTag}
        handleRemoveTag={handleRemoveTag}
        imagePreview={imagePreview}
        setImageFile={setImageFile}
        setImagePreview={setImagePreview}
        handleImageChange={handleImageChange}
        categories={CATEGORIES}
        submitting={submitting}
      />

      {/* Delete Confirmation Dialog */}
      <BlogDeleteModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Blogs;
