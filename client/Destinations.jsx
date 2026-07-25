import React, { useState, useEffect } from 'react';
import {
  getAdminDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
} from './destinationApi';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [formData, setFormData] = useState({ name: '', type: 'Domestic', image: { url: '' } });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const res = await getAdminDestinations();
      setDestinations(res.data || []);
    } catch (err) {
      console.error('Error fetching destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingId) {
        await updateDestination(editingId, formData);
        setEditingId(null);
      } else {
        await createDestination(formData);
      }
      setFormData({ name: '', type: 'Domestic', image: { url: '' } });
      fetchDestinations();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleToggleActive = async (dest) => {
    try {
      await updateDestination(dest._id, { isActive: !dest.isActive });
      fetchDestinations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSoftDelete = async (id) => {
    if (window.confirm('Are you sure you want to disable this destination?')) {
      try {
        await deleteDestination(id);
        fetchDestinations();
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
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Destination Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage domestic and international tour destinations.</p>
        </div>
        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          Live System
        </span>
      </div>

      {/* Form Card */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-100 mb-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <input
            type="text"
            placeholder="Destination Name (e.g. Hunza Valley)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm transition"
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm transition"
          >
            <option value="Domestic">Domestic</option>
            <option value="International">International</option>
          </select>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Image URL (Optional)"
              value={formData.image.url}
              onChange={(e) => setFormData({ ...formData, image: { ...formData.image, url: e.target.value } })}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm transition"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium px-6 py-3 rounded-xl shadow-md transition transform active:scale-95 whitespace-nowrap"
            >
              {editingId ? 'Update' : '+ Add'}
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-medium">Loading Destinations...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                <th className="py-4 px-6">Destination</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {destinations.map((dest) => (
                <tr key={dest._id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-6 font-semibold text-gray-800">{dest.name}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                      dest.type === 'Domestic' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                    }`}>
                      {dest.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggleActive(dest)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
                        dest.isActive
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      }`}
                    >
                      {dest.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right space-x-3">
                    <button
                      onClick={() => {
                        setEditingId(dest._id);
                        setFormData({ name: dest.name, type: dest.type, image: dest.image || { url: '' } });
                      }}
                      className="text-emerald-600 hover:text-emerald-900 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleSoftDelete(dest._id)}
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

export default Destinations;