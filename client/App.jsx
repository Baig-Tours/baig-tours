import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Categories from './pages/admin/Categories';
import Destinations from './pages/admin/Destinations';
import Gallery from './pages/Gallery';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        {/* Simple Navigation Bar */}
        <nav className="bg-slate-900 text-white p-4 flex gap-6 justify-center font-medium shadow-md">
          <Link to="/admin/categories" className="hover:text-indigo-400 transition">
            Categories Admin
          </Link>
          <Link to="/admin/destinations" className="hover:text-indigo-400 transition">
            Destinations Admin
          </Link>
          <Link to="/gallery" className="hover:text-indigo-400 transition">
            Public Gallery
          </Link>
        </nav>

        {/* Page Content */}
        <main className="py-6">
          <Routes>
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/destinations" element={<Destinations />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/" element={<Gallery />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;