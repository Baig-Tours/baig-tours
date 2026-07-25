import React, { useState, useEffect } from 'react';
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from './categoryApi';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getAdminCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingId) {
        await updateCategory(editingId, { name });
        setEditingId(null);
      } else {
        await createCategory({ name });
      }
      setName('');
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleToggleActive = async (cat) => {
    try {
      await updateCategory(cat._id, { isActive: !cat.isActive });
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSoftDelete = async (id) => {
    if (window.confirm('Are you sure you want to disable this category?')) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Category Taxonomy</h1>
          <p className="text-sm text-gray-500 mt-1">Manage tour categories for packages and galleries.</p>
        </div>
        <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
          Admin Control
        </span>
      </div>

      {/* Form Card */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-100 mb-8">
        <form onSubmit={handleSubmit} className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Enter Category Name (e.g. Honeymoon Special)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm transition"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium px-6 py-3 rounded-xl shadow-md transition transform active:scale-95"
          >
            {editingId ? 'Update Category' : '+ Add Category'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setName(''); }}
              className="text-gray-500 hover:text-gray-700 font-medium px-3"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-medium">Loading Categories...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Slug</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-6 font-semibold text-gray-800">{cat.name}</td>
                  <td className="py-4 px-6 text-gray-500 font-mono text-xs">{cat.slug}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggleActive(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
                        cat.isActive
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      }`}
                    >
                      {cat.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right space-x-3">
                    <button
                      onClick={() => { setEditingId(cat._id); setName(cat.name); }}
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleSoftDelete(cat._id)}
                      className="text-rose-500 hover:text-rose-800 font-medium"
                    >
                      Soft Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Categories;