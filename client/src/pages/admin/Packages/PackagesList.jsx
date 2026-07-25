import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminPackages, deletePackage } from '../../../api/packageApi';

export default function PackagesList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPackages = async () => {
    setLoading(true);
    try {
      const res = await getAdminPackages();
      setPackages(res.data);
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
    if (!window.confirm('Delete this package?')) return;
    try {
      await deletePackage(id);
      setPackages((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert('Failed to delete package');
    }
  };

  if (loading) return <p>Loading packages...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1>Packages</h1>
        <Link to="/admin/packages/new">+ Add Package</Link>
      </div>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Status</th>
            <th>Seats</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr key={pkg._id}>
              <td>{pkg.title}</td>
              <td>{pkg.price}</td>
              <td>{pkg.status}</td>
              <td>{pkg.availableSeats}</td>
              <td>
                <Link to={`/admin/packages/${pkg._id}/edit`}>Edit</Link>{' '}
                <button onClick={() => handleDelete(pkg._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}