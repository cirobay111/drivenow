import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ onSearch }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ location: '', pickup: '', return: '' });

  const handleChange = (e) => {
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
    if (e.target.name === 'location') onSearch?.(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (form.location.trim()) query.set('q', form.location.trim());
    if (form.pickup) query.set('pickup', form.pickup);
    if (form.return) query.set('return', form.return);
    navigate(`/cars${query.toString() ? `?${query.toString()}` : ''}`);
  };

  return (
    <form onSubmit={handleSubmit}
      className="hero-reserve-dock p-4 md:p-5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <p className="eyebrow">Quick Reserve</p>
          <p className="text-white font-bold text-lg md:text-xl mt-1">Choose your car, dates, and drive</p>
        </div>
        <span className="w-fit text-xs text-accent border border-accent/25 bg-accent/10 rounded-full px-3 py-1">2 min booking</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_auto] gap-3 md:gap-4">
        <div className="col-span-2 lg:col-span-1">
          <Field label="Car or location" name="location" type="text" placeholder="BMW, Tesla, city..." value={form.location} onChange={handleChange} />
        </div>
        <Field label="Pickup" name="pickup" type="date" value={form.pickup} onChange={handleChange} />
        <Field label="Return" name="return" type="date" value={form.return} onChange={handleChange} />
        <button type="submit" className="btn-primary col-span-2 lg:col-span-1 lg:self-end whitespace-nowrap px-8 py-3 text-sm">
          Search Cars
        </button>
      </div>
    </form>
  );
}

function Field({ label, name, type, placeholder, value, onChange }) {
  return (
    <div className="flex-1 min-w-0">
      <label className="block text-[10px] font-semibold text-gray-500 mb-1 tracking-[0.18em] uppercase">{label}</label>
      <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange}
        className="input-dark"
      />
    </div>
  );
}
