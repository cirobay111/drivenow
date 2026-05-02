import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import config from '../../config/config';
import { deleteCar, FALLBACK_IMAGE, getAllCars, resetCars, saveCar } from '../../services/carStore';

const EMPTY_FORM = { brand: '', model: '', year: '', price_per_day: '', fuel_type: 'Gasoline', seats: '', transmission: 'Automatic', image_url: '', description: '', available: true };

export default function ManageCars() {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { currency } = config;

  const loadCars = () => {
    setIsLoading(true);
    setCars(getAllCars());
    setIsLoading(false);
  };

  useEffect(() => {
    loadCars();
    window.addEventListener('drivenow-cars-updated', loadCars);
    window.addEventListener('storage', loadCars);
    return () => {
      window.removeEventListener('drivenow-cars-updated', loadCars);
      window.removeEventListener('storage', loadCars);
    };
  }, []);

  const openAdd = () => { setEditingCar(null); setForm(EMPTY_FORM); setError(''); setShowModal(true); };
  const openEdit = (car) => { setEditingCar(car); setForm({ ...car }); setError(''); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setError(''); };

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(p => ({ ...p, [e.target.name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      saveCar(form, editingCar?.id);
      loadCars();
      closeModal();
    } catch (err) {
      setError(err.message || 'Operation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (car) => {
    deleteCar(car.id);
    setConfirmDelete(null);
    loadCars();
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Cars</h1>
          <p className="text-gray-500 text-sm">{cars.length} cars in fleet</p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetCars} className="btn-outline text-sm py-2">Reset Fleet</button>
          <button onClick={openAdd} className="btn-primary text-sm py-2">+ Add Car</button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-48 skeleton" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cars.map(car => (
            <div key={car.id} className="card overflow-hidden">
              <div className="relative h-36">
                <img src={car.image_url || FALLBACK_IMAGE}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                />
                <span className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-medium border ${car.available ? 'bg-green-900/60 text-green-300 border-green-700' : 'bg-red-900/60 text-red-300 border-red-700'}`}>
                  {car.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="p-4">
                <p className="font-bold text-white">{car.brand} {car.model}</p>
                <p className="text-accent font-semibold">{currency}{car.price_per_day}/day</p>
                <p className="text-gray-400 text-xs mt-1">{car.fuel_type} · {car.seats} seats · {car.transmission}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => openEdit(car)} className="flex-1 btn-outline text-xs py-1.5">Edit</button>
                  <button onClick={() => setConfirmDelete(car)} className="flex-1 bg-red-950/50 text-red-300 border border-red-900 rounded-lg text-xs py-1.5 font-medium hover:bg-red-900/60 transition-all">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-card">
            <div className="p-6 border-b border-[#2A2A2A] flex justify-between items-center">
              <h2 className="font-bold text-white text-xl">{editingCar ? 'Edit Car' : 'Add New Car'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg px-4 py-2 text-sm">{error}</div>}

              <div className="grid grid-cols-2 gap-3">
                <ModalField label="Brand" name="brand" value={form.brand} onChange={handleChange} required />
                <ModalField label="Model" name="model" value={form.model} onChange={handleChange} required />
                <ModalField label="Year" name="year" type="number" value={form.year} onChange={handleChange} required />
                <ModalField label={`Price / Day (${currency})`} name="price_per_day" type="number" value={form.price_per_day} onChange={handleChange} required />
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Fuel Type</label>
                  <select name="fuel_type" value={form.fuel_type} onChange={handleChange}
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20">
                    {['Gasoline', 'Diesel', 'Electric', 'Hybrid'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <ModalField label="Seats" name="seats" type="number" value={form.seats} onChange={handleChange} required />
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Transmission</label>
                  <select name="transmission" value={form.transmission} onChange={handleChange}
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20">
                    {['Automatic', 'Manual'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2 col-span-2 pt-1">
                  <input type="checkbox" name="available" id="available" checked={form.available} onChange={handleChange} className="accent-orange-500 w-4 h-4" />
                  <label htmlFor="available" className="text-sm text-gray-400 font-medium">Available for booking</label>
                </div>
              </div>

              <ModalField label="Image URL" name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://..." />
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 btn-outline text-sm py-2.5">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary text-sm py-2.5 disabled:opacity-60">
                  {isSubmitting ? 'Saving...' : editingCar ? 'Update Car' : 'Add Car'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="card p-6 max-w-sm w-full text-center">
            <p className="text-3xl mb-3">Delete</p>
            <h3 className="text-lg font-bold text-white mb-2">
              Delete {confirmDelete.brand} {confirmDelete.model}?
            </h3>
            <p className="text-gray-500 text-sm mb-6">This removes the car from the public fleet and admin dashboard.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 btn-outline text-sm py-2">
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm py-2 font-semibold transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function ModalField({ label, name, type = 'text', value, onChange, required, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder}
        className="w-full bg-[#0D0D0D] border border-[#2A2A2A] text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
      />
    </div>
  );
}
