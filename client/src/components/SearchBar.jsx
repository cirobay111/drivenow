import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar } from 'lucide-react';

export default function SearchBar() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ location: '', pickup: '', return: '' });

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.location) params.set('location', form.location);
    if (form.pickup) params.set('pickup', form.pickup);
    if (form.return) params.set('return', form.return);
    navigate(`/cars${params.toString() ? `?${params}` : ''}`);
  };

  return (
    <form onSubmit={handleSubmit}
      className="bg-[#141414] border border-[#C9A441]/30 rounded-2xl shadow-gold p-4 md:p-6 flex flex-col md:flex-row gap-3 md:gap-4 w-full max-w-4xl mx-auto">
      <Field icon={MapPin} label="Pickup Location" name="location" type="text" placeholder="City, Airport..." value={form.location} onChange={handleChange} />
      <Field icon={Calendar} label="Pickup Date" name="pickup" type="date" value={form.pickup} onChange={handleChange} min={today} />
      <Field icon={Calendar} label="Return Date" name="return" type="date" value={form.return} onChange={handleChange} min={form.pickup || today} />
      <button type="submit" className="btn-primary md:self-end whitespace-nowrap px-8 py-3 text-sm">
        Search Cars
      </button>
    </form>
  );
}

function Field({ icon: Icon, label, name, type, placeholder, value, onChange, min }) {
  return (
    <div className="flex-1 min-w-0">
      <label className="block text-xs font-semibold text-gray-500 mb-1 tracking-wide flex items-center gap-1">
        <Icon className="w-3 h-3" /> {label}
      </label>
      <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} min={min}
        className="input-dark"
      />
    </div>
  );
}
