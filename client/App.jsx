import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Categories from '../Categories';
import Destinations from '../Destinations';
import Gallery from '../Gallery';
import Packages from './pages/public/Packages';
import PackageDetails from './pages/public/PackageDetails';
import PackagesList from './pages/admin/Packages/PackagesList';
import PackageForm from './pages/admin/Packages/PackageForm';
import Login from './pages/admin/Login';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
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
          <Link to="/packages" className="hover:text-indigo-400 transition">
            Public Packages
          </Link>
          <Link to="/admin/packages" className="hover:text-indigo-400 transition">
            Packages Admin
          </Link>
        </nav>

        <main className="py-6">
          <Routes>
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/destinations" element={<Destinations />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/:slug" element={<PackageDetails />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/packages" element={<PackagesList />} />
            <Route path="/admin/packages/new" element={<PackageForm />} />
            <Route path="/admin/packages/:id/edit" element={<PackageForm />} />
            <Route path="/" element={<Gallery />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;