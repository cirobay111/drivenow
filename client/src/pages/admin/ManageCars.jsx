import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { carService } from '../../services/api';

const EMPTY_FORM = { brand: '', model: '', year: '', price_per_day: '', fuel_type: 'Gasoline', seats: '', transmission: 'Automatic', image_url: '', description: '', available: true };

export default function ManageCars() {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadCars = async () => {
    setIsLoading(true);
    try {
      const res = await carService.getAll();
      setCars(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadCars(); }, []);

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
      if (editingCar) {
        await carService.update(editingCar.id, form);
      } else {
        await carService.create(form);
      }
      await loadCars();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (car) => {
    if (!confirm(`Delete ${car.brand} ${car.model}?`)) return;
    try {
      await carService.delete(car.id);
      setCars(prev => prev.filter(c => c.id !== car.id));
    } catch (err) {
      alert('Delete failed.');
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Cars</h1>
          <p className="text-gray-500 text-sm">{cars.length} cars in fleet</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm">+ Add Car</button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cars.map(car => (
            <div key={car.id} className="card overflow-hidden">
              <div className="relative h-36">
                <img src={car.image_url || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'; }}
                />
                <span className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-medium ${car.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {car.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="p-4">
                <p className="font-bold text-white">{car.brand} {car.model}</p>
                <p className="text-accent font-semibold">${car.price_per_day}/day</p>
                <p className="text-gray-400 text-xs mt-1">{car.fuel_type} · {car.seats} seats · {car.transmission}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => openEdit(car)} className="flex-1 btn-outline text-xs py-1.5">Edit</button>
                  <button onClick={() => handleDelete(car)} className="flex-1 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs py-1.5 font-medium hover:bg-red-100 transition-all">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[#141414] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#2A2A2A] flex justify-between items-center">
              <h2 className="font-bold text-white text-xl">{editingCar ? 'Edit Car' : 'Add New Car'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-2 text-sm">{error}</div>}

              <div className="grid grid-cols-2 gap-3">
                <ModalField label="Brand" name="brand" value={form.brand} onChange={handleChange} required />
                <ModalField label="Model" name="model" value={form.model} onChange={handleChange} required />
                <ModalField label="Year" name="year" type="number" value={form.year} onChange={handleChange} required />
                <ModalField label="Price / Day ($)" name="price_per_day" type="number" value={form.price_per_day} onChange={handleChange} required />
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
