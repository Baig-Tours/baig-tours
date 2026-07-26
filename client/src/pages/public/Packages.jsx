import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPackages } from '../../api/packageApi';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getPackages({
          search: search || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sort: sort || undefined,
          page,
          limit: 12,
        });
        setPackages(res.data);
        if (res.errors && typeof res.errors === 'object' && !Array.isArray(res.errors)) {
          setMeta(res.errors);
        }
        setError('');
      } catch (err) {
        setError('Failed to load packages');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search, minPrice, maxPrice, sort, page]);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500 font-medium">Loading tour packages...</div>
    );
  if (error) return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-10 text-left">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="m-0 text-4xl font-semibold text-slate-900 tracking-tight mb-2">
          Tour Packages
        </h1>
        <p className="m-0 text-sm text-slate-500">
          Discover our curated collection of unforgettable travel experiences.
        </p>
      </div>

      {/* Filter bar */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-8 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search packages..."
          value={search}
          onChange={handleFilterChange(setSearch)}
          className="flex-1 min-w-[180px] rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
        />
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={handleFilterChange(setMinPrice)}
          className="w-32 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={handleFilterChange(setMaxPrice)}
          className="w-32 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
        />
        <select
          value={sort}
          onChange={handleFilterChange(setSort)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
        >
          <option value="">Sort: Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="departure_asc">Departure: Soonest</option>
        </select>
      </div>

      {packages.length === 0 && (
        <p className="text-center text-slate-400 py-12">No packages match your filters.</p>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg._id}
            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 border border-slate-200"
          >
            <div className="w-full h-56 bg-slate-100 overflow-hidden">
              {pkg.featuredImage?.url && (
                <img
                  src={pkg.featuredImage.url}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              )}
            </div>
            <div className="p-5 text-left">
              <h3 className="m-0 font-semibold text-slate-900 text-lg mb-1">{pkg.title}</h3>
              <p className="m-0 text-sm text-cyan-600 font-medium mb-3">{pkg.duration}</p>
              <p className="m-0 mb-4">
                {pkg.discountPrice ? (
                  <>
                    <s className="text-slate-400 text-sm mr-2">
                      PKR {Number(pkg.price).toLocaleString()}
                    </s>
                    <span className="text-xl font-semibold text-slate-900">
                      PKR {Number(pkg.discountPrice).toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-semibold text-slate-900">
                    PKR {Number(pkg.price).toLocaleString()}
                  </span>
                )}
              </p>
              <Link
                to={`/packages/${pkg.slug}`}
                className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-md transition shadow-sm"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 mt-10">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-md border border-slate-300 text-sm text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition"
          >
            Prev
          </button>
          <span className="text-sm text-slate-500">
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            className="px-3 py-1.5 rounded-md border border-slate-300 text-sm text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}