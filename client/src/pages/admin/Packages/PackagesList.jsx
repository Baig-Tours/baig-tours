import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminPackages, deletePackage, duplicatePackage } from '../../../api/packageApi';

function StatusPill({ status }) {
  const isPublished = status === 'published';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
        isPublished
          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
          : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
      }`}
    >
      {isPublished ? 'Published' : 'Draft'}
    </span>
  );
}

export default function PackagesList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPackages = async () => {
    setLoading(true);
    try {
      const res = await getAdminPackages();
      setPackages(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this package? This cannot be undone.')) return;
    try {
      await deletePackage(id);
      setPackages((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert('Failed to delete package');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await duplicatePackage(id);
      loadPackages();
    } catch (err) {
      alert('Failed to duplicate package');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-8 text-left">
      <div className="flex items-center justify-between mb-8">
        <div className="text-left">
          <h1 className="text-left m-0 text-2xl font-semibold text-slate-900">Packages</h1>
          <p className="text-left m-0 mt-1 text-sm text-slate-500">
            Manage tour packages, pricing, and availability.
          </p>
        </div>
        <Link
          to="/admin/packages/new"
          className="inline-flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-md transition shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add Package
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm">Loading packages…</div>
        ) : error ? (
          <div className="py-16 text-center text-red-500 text-sm">{error}</div>
        ) : packages.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            No packages yet — create your first one to get started.
          </div>
        ) : (
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col className="w-[32%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
              <col className="w-[10%]" />
              <col className="w-[30%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Seats
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr
                  key={pkg._id}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition"
                >
                  <td className="px-6 py-4 text-left font-medium text-slate-800 truncate">
                    {pkg.title}
                  </td>
                  <td className="px-6 py-4 text-left text-slate-600 tabular-nums whitespace-nowrap">
                    PKR {Number(pkg.price).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-left">
                    <StatusPill status={pkg.status} />
                  </td>
                  <td className="px-6 py-4 text-left text-slate-600 tabular-nums">
                    {pkg.availableSeats}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDuplicate(pkg._id)}
                        title="Duplicate package"
                        className="p-2 rounded-md text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </button>
                      <Link
                        to={`/admin/packages/${pkg._id}/edit`}
                        title="Edit package"
                        className="p-2 rounded-md text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(pkg._id)}
                        title="Delete package"
                        className="p-2 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 11v6M14 11v6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}