import { useState, useEffect } from 'react';
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Check,
  Tag,
  Loader2,
  FileX,
  ArrowRight,
} from 'lucide-react';
import DOMPurify from 'dompurify';
import { fetchBlogBySlug } from '../../api/blogApi';

const BlogDetails = ({ slug: propSlug }) => {
  // Extract slug from URL path if not passed as prop
  const getSlugFromPath = () => {
    if (propSlug) return propSlug;
    const parts = window.location.pathname.split('/');
    return parts[parts.length - 1] || '';
  };

  const currentSlug = getSlugFromPath();

  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const loadBlogDetails = async () => {
      if (!currentSlug) return;
      try {
        setLoading(true);
        setError(null);

        const response = await fetchBlogBySlug(currentSlug);
        if (!isCancelled && response.success) {
          setBlogData(response.data || {});
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Failed to load article details.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadBlogDetails();

    return () => {
      isCancelled = true;
    };
  }, [currentSlug]);

  const blog = blogData?.blog;
  const relatedBlogs = blogData?.relatedBlogs || [];

  // Estimate reading time
  const calculateReadingTime = (content = '') => {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes < 1 ? 1 : minutes;
  };

  // Social Share Handlers
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareOnWhatsApp = () => {
    if (!blog) return;
    const text = encodeURIComponent(`Check out "${blog.title}" on Baig Tours: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareOnTwitter = () => {
    if (!blog) return;
    const text = encodeURIComponent(`Read "${blog.title}" via Baig Tours`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center max-w-md w-full">
          <FileX className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800">Article Not Found</h2>
          <p className="text-slate-500 text-xs mt-1 mb-6">
            {error || "The article you're looking for does not exist or has been removed."}
          </p>
          <a
            href="/blog"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Articles
          </a>
        </div>
      </div>
    );
  }

  // XSS Security HTML Sanitization using DOMPurify
  const sanitizedContent = DOMPurify.sanitize(blog.content || '');

  return (
    <article className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      {/* Header Container */}
      <div className="bg-white border-b border-slate-200/80 pt-10 pb-12 px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Back Navigation */}
          <a
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Travel Journal
          </a>

          {/* Category Badge */}
          <div>
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {blog.category || 'Travel Article'}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
            {blog.title}
          </h1>

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                <User className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-800">{blog.author || 'Baig Tours Team'}</span>
            </div>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              {blog.publishDate ? new Date(blog.publishDate).toLocaleDateString() : 'Recent'}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              {calculateReadingTime(blog.content)} min read
            </span>
          </div>
        </div>
      </div>

      {/* Featured Hero Image */}
      <div className="max-w-5xl mx-auto px-6 -mt-6 mb-12">
        <div className="relative h-[320px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
          <img
            src={
              blog.featuredImage?.url ||
              'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'
            }
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-3xl p-6 md:p-12 border border-slate-200/80 shadow-sm space-y-8">
          {/* Sanitized Rich Text Article Body */}
          <div
            className="prose prose-slate max-w-none leading-relaxed text-slate-700 text-sm md:text-base 
              [mousemove]
              [&_h1]:text-2xl [&_h1]:md:text-3xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:mt-8 [&_h1]:mb-4
              [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-6 [&_h2]:mb-3
              [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-5 [&_h3]:mb-2
              [&_p]:mb-4 [&_p]:leading-relaxed
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1
              [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:bg-slate-50 [&_blockquote]:p-4 [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:my-6
              [&_a]:text-emerald-600 [&_a]:underline [&_a]:font-semibold hover:[&_a]:text-emerald-700
              [&_img]:rounded-2xl [&_img]:my-6 [&_img]:shadow-md"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

          {/* Tags List */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
                <Tag className="w-3.5 h-3.5" /> Tags:
              </span>
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs font-medium border border-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Social Share Bar */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-emerald-600" /> Share this story with friends:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={shareOnWhatsApp}
                className="px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-semibold transition-colors"
              >
                WhatsApp
              </button>
              <button
                onClick={shareOnFacebook}
                className="px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold transition-colors"
              >
                Facebook
              </button>
              <button
                onClick={shareOnTwitter}
                className="px-3.5 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold transition-colors"
              >
                X (Twitter)
              </button>
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>

        {/* Related Articles Feed */}
        {relatedBlogs.length > 0 && (
          <section className="mt-16">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Related Stories You Might Like</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((rel) => (
                <a
                  key={rel._id}
                  href={`/blog/${rel.slug}`}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col"
                >
                  <div className="h-40 overflow-hidden bg-slate-100">
                    <img
                      src={
                        rel.featuredImage?.url ||
                        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
                      {rel.category || 'Travel'}
                    </span>
                    <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 text-sm line-clamp-2 leading-snug mb-3">
                      {rel.title}
                    </h4>
                    <div className="mt-auto flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span>{rel.publishDate ? new Date(rel.publishDate).toLocaleDateString() : ''}</span>
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};

export default BlogDetails;
