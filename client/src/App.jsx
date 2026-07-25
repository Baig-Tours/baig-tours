import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Blog from './pages/public/Blog';
import BlogDetails from './pages/public/BlogDetails';
import Blogs from './pages/admin/Blogs';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
        {/* Navigation Bar */}
        <nav className="bg-slate-900 text-white border-b border-slate-800 px-6 py-4 sticky top-0 z-40 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/blog" className="flex items-center gap-2 font-bold text-lg tracking-tight text-white">
              <span className="bg-emerald-500 text-slate-900 w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm">
                BT
              </span>
              Baig Tours <span className="text-emerald-400 font-normal text-xs uppercase tracking-wider hidden sm:inline">Journal</span>
            </Link>

            <div className="flex items-center gap-6 text-xs font-semibold">
              <Link to="/blog" className="hover:text-emerald-400 transition-colors">
                Public Blog
              </Link>
              <Link
                to="/admin/blogs"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl transition-all shadow-sm"
              >
                Admin Dashboard
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Route Body */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/blog" replace />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetails />} />
            <Route path="/admin/blogs" element={<Blogs />} />
            <Route path="*" element={<Navigate to="/blog" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
