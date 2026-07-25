import { FileText, Globe, Clock } from 'lucide-react';

const BlogStatsCards = ({ totalCount = 0, publishedCount = 0, draftCount = 0 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Articles</p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5">{totalCount}</p>
        </div>
      </div>
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Globe className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Published</p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5">{publishedCount}</p>
        </div>
      </div>
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Drafts</p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5">{draftCount}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogStatsCards;
