import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPackage, getAdminPackages, updatePackage } from '../../../api/packageApi';

function Field({ label, children }) {
  return (
    <div className="text-left">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition';

function toDateInputValue(isoString) {
  if (!isoString) return '';
  return String(isoString).slice(0, 10);
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const addButtonClass =
  'inline-flex items-center gap-1 text-xs font-medium text-cyan-700 bg-cyan-50 hover:bg-cyan-100 px-2.5 py-1 rounded-md transition';

// --- Simple text-list builder (Included / Excluded) ---
function TextListBuilder({ label, items, onChange }) {
  const updateItem = (i, value) => {
    const next = [...items];
    next[i] = value;
    onChange(next);
  };
  const addItem = () => onChange([...items, '']);
  const removeItem = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="text-left">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <button type="button" onClick={addItem} className={addButtonClass}>
          <PlusIcon /> Add
        </button>
      </div>
      <div className="space-y-2">
        {items.length === 0 && (
          <p className="m-0 text-xs text-slate-400">No items yet — click Add to create one.</p>
        )}
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              className={inputClass}
              placeholder="e.g. Hotel stay"
            />
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="p-2 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition shrink-0"
            >
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Itinerary builder ---
function ItineraryBuilder({ items, onChange }) {
  const updateItem = (i, field, value) => {
    const next = [...items];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  };
  const addItem = () => onChange([...items, { day: items.length + 1, title: '', details: '' }]);
  const removeItem = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="text-left">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-slate-700">Itinerary</label>
        <button type="button" onClick={addItem} className={addButtonClass}>
          <PlusIcon /> Add Day
        </button>
      </div>
      <div className="space-y-3">
        {items.length === 0 && (
          <p className="m-0 text-xs text-slate-400">No itinerary days yet — click Add Day to create one.</p>
        )}
        {items.map((item, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={item.day}
                onChange={(e) => updateItem(i, 'day', Number(e.target.value))}
                className={`${inputClass} w-20`}
                placeholder="Day #"
              />
              <input
                value={item.title}
                onChange={(e) => updateItem(i, 'title', e.target.value)}
                className={inputClass}
                placeholder="Day title, e.g. Arrival"
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="p-2 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition shrink-0"
              >
                <TrashIcon />
              </button>
            </div>
            <textarea
              value={item.details}
              onChange={(e) => updateItem(i, 'details', e.target.value)}
              rows={2}
              className={`${inputClass} resize-y`}
              placeholder="Details for this day"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// --- FAQ builder ---
function FaqBuilder({ items, onChange }) {
  const updateItem = (i, field, value) => {
    const next = [...items];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  };
  const addItem = () => onChange([...items, { question: '', answer: '' }]);
  const removeItem = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="text-left">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-slate-700">FAQs</label>
        <button type="button" onClick={addItem} className={addButtonClass}>
          <PlusIcon /> Add FAQ
        </button>
      </div>
      <div className="space-y-3">
        {items.length === 0 && (
          <p className="m-0 text-xs text-slate-400">No FAQs yet — click Add FAQ to create one.</p>
        )}
        {items.map((item, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <input
                value={item.question}
                onChange={(e) => updateItem(i, 'question', e.target.value)}
                className={inputClass}
                placeholder="Question"
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="p-2 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition shrink-0"
              >
                <TrashIcon />
              </button>
            </div>
            <textarea
              value={item.answer}
              onChange={(e) => updateItem(i, 'answer', e.target.value)}
              rows={2}
              className={`${inputClass} resize-y`}
              placeholder="Answer"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PackageForm() {
  const navigate = useNavigate();
  const { id } = useParams();
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
  const [included, setIncluded] = useState([]);
  const [excluded, setExcluded] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode) return;

    const loadExisting = async () => {
      setLoadingExisting(true);
      try {
        const res = await getAdminPackages();
        const existing = res.data.find((p) => p._id === id);
        if (!existing) {
          setError('Package not found');
          return;
        }
        setForm({
          title: existing.title || '',
          category: existing.category || '',
          destination: existing.destination || '',
          price: existing.price ?? '',
          duration: existing.duration || '',
          availableSeats: existing.availableSeats ?? '',
          departureDate: toDateInputValue(existing.departureDate),
          returnDate: toDateInputValue(existing.returnDate),
          description: existing.description || '',
        });
        setIncluded(existing.included || []);
        setExcluded(existing.excluded || []);
        setItinerary(existing.itinerary || []);
        setFaqs(existing.faqs || []);
        setCurrentImageUrl(existing.featuredImage?.url || '');
      } catch (err) {
        setError('Failed to load package details');
      } finally {
        setLoadingExisting(false);
      }
    };

    loadExisting();
  }, [id, isEditMode]);

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
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      formData.append('included', JSON.stringify(included.filter((s) => s.trim() !== '')));
      formData.append('excluded', JSON.stringify(excluded.filter((s) => s.trim() !== '')));
      formData.append(
        'itinerary',
        JSON.stringify(itinerary.filter((d) => d.title.trim() !== ''))
      );
      formData.append('faqs', JSON.stringify(faqs.filter((f) => f.question.trim() !== '')));

      if (imageFile) {
        formData.append('images', imageFile);
      }

      if (isEditMode) {
        await updatePackage(id, formData);
      } else {
        if (!imageFile) {
          setError('Featured image is required');
          setSubmitting(false);
          return;
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

  if (loadingExisting) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-400">Loading package…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-8 text-left">
      <div className="max-w-3xl">
        <h1 className="text-left m-0 text-2xl font-semibold text-slate-900">
          {isEditMode ? 'Edit Package' : 'Add Package'}
        </h1>
        <p className="text-left m-0 mt-0.5 mb-8 text-sm text-slate-500">
          {isEditMode
            ? 'Update the details of this tour package.'
            : 'Fill in the details to create a new tour package.'}
        </p>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6"
        >
          <Field label="Title">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-5">
            <Field label="Category ID">
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </Field>
            <Field label="Destination ID">
              <input
                name="destination"
                value={form.destination}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <Field label="Price (PKR)">
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </Field>
            <Field label="Duration">
              <input
                name="duration"
                placeholder="e.g. 5 Days / 4 Nights"
                value={form.duration}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </Field>
            <Field label="Available Seats">
              <input
                type="number"
                name="availableSeats"
                value={form.availableSeats}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Field label="Departure Date">
              <input
                type="date"
                name="departureDate"
                value={form.departureDate}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </Field>
            <Field label="Return Date">
              <input
                type="date"
                name="returnDate"
                value={form.returnDate}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              required
              className={`${inputClass} resize-y`}
            />
          </Field>

          <div className="border-t border-slate-100 pt-6 grid grid-cols-2 gap-5">
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
              <TextListBuilder label="Included" items={included} onChange={setIncluded} />
            </div>
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
              <TextListBuilder label="Excluded" items={excluded} onChange={setExcluded} />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 bg-slate-50 rounded-lg border border-slate-200 p-4">
            <ItineraryBuilder items={itinerary} onChange={setItinerary} />
          </div>

          <div className="border-t border-slate-100 pt-6 bg-slate-50 rounded-lg border border-slate-200 p-4">
            <FaqBuilder items={faqs} onChange={setFaqs} />
          </div>

          <Field label={isEditMode ? 'Replace Featured Image (optional)' : 'Featured Image'}>
            {isEditMode && currentImageUrl && (
              <div className="mb-3">
                <img
                  src={currentImageUrl}
                  alt="Current featured"
                  className="w-32 h-24 object-cover rounded-md border border-slate-200"
                />
                <p className="m-0 mt-1 text-xs text-slate-500">Current image</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 transition"
            />
          </Field>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/admin/packages')}
              className="text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 px-5 py-2.5 rounded-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium px-5 py-2.5 rounded-md transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : isEditMode ? 'Update Package' : 'Create Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}