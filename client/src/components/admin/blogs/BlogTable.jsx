import { Loader2, FileX, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const BlogTable = ({
  loading,
  error,
  blogs = [],
  page,
  setPage,
  totalPages,
  totalCount,
  onEdit,
  onDelete,
  onOpenModal,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-6">
      {loading ? (
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Loading articles...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-rose-600 bg-rose-50/50">
          <p className="font-semibold text-sm">Error loading blogs</p>
          <p className="text-xs text-rose-500 mt-1">{error}</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="p-12 text-center">
          <FileX className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No articles found</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
            Get started by creating your first blog article or try adjusting your search filters.
          </p>
          <button
            onClick={() => onOpenModal()}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
          >
            Create Article
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Article</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Author</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Publish Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          blog.featuredImage?.url ||
                          'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=150&q=80'
                        }
                        alt={blog.title}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-slate-900 truncate max-w-xs">{blog.title}</h4>
                        <p className="text-xs text-slate-400 font-mono truncate max-w-xs">{blog.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                      {blog.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-700">{blog.author || 'Baig Tours Team'}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        blog.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          blog.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      {blog.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-500 text-xs">
                    {blog.publishDate ? new Date(blog.publishDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => onEdit(blog)}
                      className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Edit Article"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(blog._id)}
                      className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200/80 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Page {page} of {totalPages} ({totalCount} total)
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all inline-flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all inline-flex items-center gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogTable;
