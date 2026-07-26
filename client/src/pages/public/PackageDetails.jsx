import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPackageBySlug } from '../../api/packageApi';

export default function PackageDetails() {
  const { slug } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getPackageBySlug(slug);
        setPkg(res.data);
        setError('');
      } catch (err) {
        setError('Package not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) return <p className="p-8 text-center">Loading...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;
  if (!pkg) return null;

  var whatsappMsg = "Hi, I am interested in the " + pkg.title + " package. Can you share more details?";
  var whatsappUrl = "https://wa.me/923001234567?text=" + encodeURIComponent(whatsappMsg);

  return (
    <div className="min-h-screen bg-slate-50 p-8 max-w-4xl mx-auto text-left">
      <h1 className="text-3xl font-bold text-slate-900">{pkg.title}</h1>
      <p className="text-slate-500 mt-2">{pkg.duration}</p>

      {pkg.featuredImage && pkg.featuredImage.url && (
        <img src={pkg.featuredImage.url} alt={pkg.title} className="w-full max-h-96 object-cover rounded-xl mt-6" />
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 mt-6 flex justify-between items-center">
        <p className="text-2xl font-bold">PKR {Number(pkg.price).toLocaleString()}</p>
        <div className="flex gap-3">
          <button className="bg-cyan-500 text-white px-5 py-2 rounded-md">Book Now</button>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-5 py-2 rounded-md">WhatsApp Inquiry</a>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Overview</h2>
        <p className="text-slate-600">{pkg.description}</p>
      </div>

      {pkg.included && pkg.included.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-bold mb-2">Included</h3>
          <ul className="list-disc pl-5">
            {pkg.included.map(function(item, i) { return <li key={i}>{item}</li>; })}
          </ul>
        </div>
      )}

      {pkg.excluded && pkg.excluded.length > 0 && (
        <div className="mt-4 bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-bold mb-2">Excluded</h3>
          <ul className="list-disc pl-5">
            {pkg.excluded.map(function(item, i) { return <li key={i}>{item}</li>; })}
          </ul>
        </div>
      )}

      {pkg.itinerary && pkg.itinerary.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Itinerary</h2>
          {pkg.itinerary.map(function(day) {
            return (
              <div key={day.day} className="bg-white rounded-xl shadow-sm p-4 mb-3 border-l-4 border-cyan-400">
                <p className="font-bold">Day {day.day}: {day.title}</p>
                <p className="text-slate-600">{day.details}</p>
              </div>
            );
          })}
        </div>
      )}

      {pkg.faqs && pkg.faqs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">FAQs</h2>
          {pkg.faqs.map(function(faq, i) {
            return (
              <details key={i} className="bg-white rounded-xl shadow-sm p-4 mb-2">
                <summary className="font-medium cursor-pointer">{faq.question}</summary>
                <p className="mt-2 text-slate-600">{faq.answer}</p>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}