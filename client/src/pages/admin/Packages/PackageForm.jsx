import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPackage, getPackageBySlug, updatePackage } from '../../../api/packageApi';

export default function PackageForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // present only in edit mode
  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    category: '',
    destination: '',
    price: '',
    duration: '',
    availableSeats: '',
    departureDate: '',
    returnDate: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isEditMode) {
        // Update — plain JSON, no image re-upload in this simple version
        await updatePackage(id, form);
      } else {
        // Create — needs multipart/form-data because of the image
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          formData.append(key, value);
        });
        if (imageFile) {
          formData.append('images', imageFile);
        }
        await createPackage(formData);
      }
      navigate('/admin/packages');
    } catch (err) {
      const message =
        err?.response?.data?.errors?.map((e) => e.message).join(', ') ||
        err?.response?.data?.message ||
        'Something went wrong';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>{isEditMode ? 'Edit Package' : 'Add Package'}</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} required />
        </div>

        <div>
          <label>Category ID</label>
          <input name="category" value={form.category} onChange={handleChange} required />
        </div>

        <div>
          <label>Destination ID</label>
          <input name="destination" value={form.destination} onChange={handleChange} required />
        </div>

        <div>
          <label>Price</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} required />
        </div>

        <div>
          <label>Duration</label>
          <input name="duration" value={form.duration} onChange={handleChange} required />
        </div>

        <div>
          <label>Available Seats</label>
          <input
            type="number"
            name="availableSeats"
            value={form.availableSeats}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Departure Date</label>
          <input
            type="date"
            name="departureDate"
            value={form.departureDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Return Date</label>
          <input
            type="date"
            name="returnDate"
            value={form.returnDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required />
        </div>

        {!isEditMode && (
          <div>
            <label>Featured Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : isEditMode ? 'Update Package' : 'Create Package'}
        </button>
      </form>
    </div>
  );
}