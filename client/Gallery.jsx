import React, { useState, useEffect } from 'react';
import { getGalleryItems, createGalleryItem, deleteGalleryItem } from '../api/galleryApi';
import { getCategories } from '../api/categoryApi';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  // New Media Form State
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    mediaUrl: '',
    mediaType: 'image',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [galleryRes, catRes] = await Promise.all([
        getGalleryItems(selectedCategory),
        getCategories(),
      ]);
      setItems(galleryRes.data || []);
      setCategories(catRes.data || []);
      if (!formData.category && catRes.data?.length > 0) {
        setFormData((prev) => ({ ...prev, category: catRes.data[0].name }));
      }
    } catch (err) {
      console.error('Error loading gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.mediaUrl.trim() || !formData.category) return;

    try {
      await createGalleryItem({
        title: formData.title,
        category: formData.category,
        media: {
          url: formData.mediaUrl,
          publicId: `pub_${Date.now()}`,
          type: formData.mediaType,
        },
      });
      setFormData({ title: '', category: categories[0]?.name || '', mediaUrl: '', mediaType: 'image' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this media?')) {
      try {
        await deleteGalleryItem(id);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Tour Gallery</h1>
        <p className="text-gray-500 text-sm">Explore captures and highlights from our exotic travel destinations.</p>
      </div>

      {/* Admin Upload Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-2xl mb-12">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span>📸</span> Upload Media (Admin Control)
        </h2>
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Title / Description"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            {categories.map((c) => (
              <option key={c._id} value={c.name} className="bg-slate-800">{c.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Media URL"
            value={formData.mediaUrl}
            onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
            className="px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <select
            value={formData.mediaType}
            onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
            className="px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="image" className="bg-slate-800">Image</option>
            <option value="video" className="bg-slate-800">Video</option>
          </select>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg transition text-sm"
          >
            Upload Media
          </button>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center items-center gap-2 mb-10 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
            selectedCategory === 'All'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              selectedCategory === cat.name
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading Gallery Items...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 border border-gray-100">
              <div className="aspect-w-16 aspect-h-11 w-full bg-gray-100 overflow-hidden">
                {item.media?.type === 'video' ? (
                  <video src={item.media?.url} controls className="w-full h-64 object-cover" />
                ) : (
                  <img
                    src={item.media?.url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800'}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
                  />
                )}
              </div>
              <div className="p-4 flex justify-between items-center bg-white">
                <div>
                  <h3 className="font-bold text-gray-800 text-base">{item.title || 'Untitled Captures'}</h3>
                  <span className="text-xs text-indigo-600 font-medium">{item.category}</span>
                </div>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-2 rounded-lg text-xs transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;