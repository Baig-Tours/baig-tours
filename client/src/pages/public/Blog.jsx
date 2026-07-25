import { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  User,
  Clock,
  ArrowRight,
  Tag,
  Loader2,
  FileX,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { fetchPublishedBlogs } from '../../api/blogApi';

const CATEGORIES = ['All', 'Tour Guide', 'Travel Article', 'Visa Guide', 'Travel Tip', 'Destinations'];
const POPULAR_TAGS = ['hunza', 'skardu', 'swat', 'kashmir', 'trekking', 'culture', 'tips'];

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('');

  // Fetch Published Blogs
  useEffect(() => {
    let isCancelled = false;

    const loadBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = {
          page,
          limit: 9,
          search: search.trim() || undefined,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          tag: selectedTag || undefined,
        };

        const response = await fetchPublishedBlogs(params);
        if (!isCancelled && response.success) {
          setBlogs(response.data || []);
          if (response.pagination) {
            setTotalPages(response.pagination.totalPages || 1);
            setTotalCount(response.pagination.total || response.data.length);
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Failed to fetch travel stories.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadBlogs();

    return () => {
      isCancelled = true;
    };
  }, [page, search, selectedCategory, selectedTag]);

  // Strip HTML helper for snippet preview
  const getExcerpt = (htmlContent, maxLength = 120) => {
    if (!htmlContent) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Estimate reading time in minutes
  const calculateReadingTime = (content = '') => {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes < 1 ? 1 : minutes;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16">
      {/* Hero Banner */}
      <section className="relative bg-slate-900 text-white py-20 px-6 overflow-hidden">
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay scale-105 transition-transform duration-1000"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <BookOpen className="w-3.5 h-3.5" /> Baig Tours Travel Journal
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Explore Stories, Guides & Expert Travel Tips
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto font-light">
            Discover breathtaking destinations, local culture insights, and travel guides curated by our expert team.
          </p>

          {/* Hero Search Input */}
          <div className="pt-6 max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles, guides, locations..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/20 transition-all shadow-xl"
              />
              <Search className="w-5 h-5 text-slate-300 absolute left-4 top-4" />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-white bg-white/10 px-2 py-1 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Popular Tag Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Tags:
            </span>
            {POPULAR_TAGS.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setSelectedTag(selectedTag === t ? '' : t);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  selectedTag === t
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold'
                    : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                #{t}
              </button>
            ))}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag('')}
                className="text-[11px] text-rose-600 hover:underline font-semibold ml-1"
              >
                Clear Tag
              </button>
            )}
          </div>
        </div>

        {/* Blog Cards Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">Discovering travel stories...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center bg-rose-50 border border-rose-200 rounded-2xl max-w-md mx-auto">
            <p className="text-rose-700 font-semibold text-sm">Failed to load articles</p>
            <p className="text-rose-500 text-xs mt-1">{error}</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200/80 shadow-sm max-w-md mx-auto p-8">
            <FileX className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No articles found</h3>
            <p className="text-slate-500 text-xs mt-1">
              We couldn't find any published stories matching your current search or category filter.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setSelectedTag('');
                setPage(1);
              }}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Featured Image Banner */}
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={
                      blog.featuredImage?.url ||
                      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-800 border border-white/50 shadow-sm">
                    {blog.category || 'Travel Article'}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Date & Reading Time */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-medium mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {blog.publishDate ? new Date(blog.publishDate).toLocaleDateString() : 'Recent'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {calculateReadingTime(blog.content)} min read
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-2 leading-snug">
                    <a href={`/blog/${blog.slug}`}>{blog.title}</a>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-4 flex-1">
                    {getExcerpt(blog.content)}
                  </p>

                  {/* Author & Read More Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-medium text-slate-700">{blog.author || 'Baig Tours'}</span>
                    </div>

                    <a
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors group-hover:translate-x-0.5"
                    >
                      Read Story <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-6">
            <p className="text-xs text-slate-500 font-medium">
              Showing page {page} of {totalPages} ({totalCount} total stories)
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all inline-flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all inline-flex items-center gap-1.5"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
