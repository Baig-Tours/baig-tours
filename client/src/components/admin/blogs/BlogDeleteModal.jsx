import { AlertTriangle } from 'lucide-react';

const BlogDeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95 duration-150 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Delete Article?</h3>
        <p className="text-xs text-slate-500 mt-1.5">
          This action cannot be undone. The blog post will be permanently removed.
        </p>
        <div className="flex gap-3 mt-6 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDeleteModal;
