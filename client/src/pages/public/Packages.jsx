import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPackages } from '../../api/packageApi';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPackages();
        setPackages(res.data);
      } catch (err) {
        setError('Failed to load packages');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Loading tour packages...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Tour Packages</h1>

      {packages.length === 0 && <p>No packages available right now.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {packages.map((pkg) => (
          <div key={pkg._id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            {pkg.featuredImage?.url && (
              <img
                src={pkg.featuredImage.url}
                alt={pkg.title}
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
              />
            )}
            <h3>{pkg.title}</h3>
            <p>{pkg.duration}</p>
            <p>
              {pkg.discountPrice ? (
                <>
                  <s>PKR {pkg.price}</s> <strong>PKR {pkg.discountPrice}</strong>
                </>
              ) : (
                <strong>PKR {pkg.price}</strong>
              )}
            </p>
            <Link to={`/packages/${pkg.slug}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}