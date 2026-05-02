import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import config from '../config/config';
import content from '../data/content.json';
import { FALLBACK_IMAGE, getCarById } from '../services/carStore';
import { addReservation } from '../services/reservationStore';

export default function Booking() {
  const { id } = useParams();
  const car = getCarById(id);

  const [form, setForm] = useState({
    customer_name: '', customer_email: '', customer_phone: '',
    pickup_location: '', pickup_date: '', return_date: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { currency } = config;
  const { booking: bookingContent } = content;

  const totalDays = form.pickup_date && form.return_date
    ? Math.max(0, Math.ceil((new Date(form.return_date) - new Date(form.pickup_date)) / 86400000))
    : 0;
  const totalPrice = car ? (totalDays * parseFloat(car.price_per_day)).toFixed(2) : '0.00';
  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!car?.available) { setError('This car is currently unavailable. Please choose another vehicle.'); return; }
    if (totalDays < 1) { setError('Return date must be after pickup date.'); return; }
    if (!car) { setError('Car not found.'); return; }
    setIsSubmitting(true);
    try {
      // Save reservation to localStorage — visible in the admin dashboard
      addReservation({
        ...form,
        car_id: car.id,
        car_brand: car.brand,
        car_model: car.model,
        car_image: car.image_url,
        total_days: totalDays,
        total_price: parseFloat(totalPrice),
      });
      setSuccess(true);
    } catch {
      setError('Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!car) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🚗</p>
          <p className="text-gray-400 text-lg mb-4">Car not found.</p>
          <Link to="/cars" className="btn-outline text-sm">Browse All Cars</Link>
        </div>
      </div>
    );
  }

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] p-4">
      <div className="card p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-accent/20 border border-accent/40 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✅</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
        <p className="text-gray-500 mb-6">
          We'll contact you at <strong className="text-gray-300">{form.customer_email}</strong>
        </p>
        <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl p-4 text-left text-sm space-y-2 mb-6">
          <p><span className="text-gray-600">Car:</span> <strong className="text-white">{car.brand} {car.model}</strong></p>
          <p><span className="text-gray-600">Pickup:</span> <strong className="text-white">{form.pickup_date}</strong></p>
          <p><span className="text-gray-600">Return:</span> <strong className="text-white">{form.return_date}</strong></p>
          <p><span className="text-gray-600">Total:</span> <strong className="text-accent text-lg">{currency}{totalPrice}</strong></p>
        </div>
        <Link to="/cars" className="btn-primary block">Browse More Cars</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="relative bg-[#080808] border-b border-[#2A2A2A] py-14 overflow-hidden">
        <img
          src={car.image_url || FALLBACK_IMAGE}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25 brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/92 to-[#080808]/60" />
        <div className="relative max-w-7xl mx-auto px-4">
          <nav className="text-gray-500 text-sm mb-4">
            <Link to="/cars" className="hover:text-accent">Cars</Link>
            <span className="mx-2">/</span>
            <Link to={`/cars/${id}`} className="hover:text-accent">{car.brand} {car.model}</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Booking</span>
          </nav>
          <p className="eyebrow mb-2">Reserve {car.brand}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Complete Your Booking</h1>
          <p className="text-gray-400 mt-3 max-w-2xl">Confirm your details and lock in the {car.brand} {car.model} for your selected dates.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <form onSubmit={handleSubmit} className="surface p-6 md:p-8 space-y-5">
              <h2 className="font-bold text-white text-xl">Your Information</h2>
              {!car.available && (
                <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-300 rounded-xl px-4 py-3 text-sm">
                  This car is currently unavailable. You can review the summary, but booking is disabled.
                </div>
              )}
              {error && (
                <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-xl px-4 py-3 text-sm">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Full Name"       name="customer_name"  type="text"  placeholder="John Doe"           value={form.customer_name}     onChange={handleChange} required />
                <FormField label="Email"           name="customer_email" type="email" placeholder="john@example.com"   value={form.customer_email}    onChange={handleChange} required />
                <FormField label="Phone"           name="customer_phone" type="tel"   placeholder="+1 234 567 8900"    value={form.customer_phone}    onChange={handleChange} required />
                <FormField label="Pickup Location" name="pickup_location" type="text" placeholder="City, Airport..."  value={form.pickup_location}   onChange={handleChange} required />
                <FormField label="Pickup Date" name="pickup_date" type="date" value={form.pickup_date} onChange={handleChange} required min={today} />
                <FormField label="Return Date" name="return_date" type="date" value={form.return_date} onChange={handleChange} required min={form.pickup_date || today} />
              </div>
              <div className="rounded-lg border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-gray-300">
                Your reservation is saved instantly and appears in the admin reservations dashboard.
              </div>
              <button
                type="submit" disabled={isSubmitting || !car.available}
                className="btn-primary w-full text-base py-4 disabled:opacity-60"
              >
                {isSubmitting ? 'Processing...' : `Confirm Booking – ${currency}${totalPrice}`}
              </button>
            </form>
          </div>

          {/* Booking summary sidebar */}
          <div className="order-1 lg:order-2">
            <div className="surface p-5 sticky top-20">
              <h3 className="font-bold text-white text-lg mb-4">Booking Summary</h3>
              <img
                src={car.image_url || FALLBACK_IMAGE}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-48 object-cover rounded-lg mb-4 brightness-110 contrast-105"
                onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
              />
              <p className="font-bold text-white text-xl">{car.brand} {car.model}</p>
              <p className="text-gray-600 text-sm">{car.year}</p>
              <div className="border-t border-[#2A2A2A] mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Price / day</span><span>{currency}{car.price_per_day}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Duration</span><span>{totalDays} day{totalDays !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between font-bold text-white text-base border-t border-[#2A2A2A] pt-2 mt-2">
                  <span>Total</span><span className="text-accent text-xl">{currency}{totalPrice}</span>
                </div>
              </div>
              {/* Edit guarantees in src/data/content.json → booking.guarantees */}
              <div className="mt-4 space-y-1.5 text-xs text-gray-600">
                {bookingContent.guarantees.map(g => <p key={g}>✓ {g}</p>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, name, type, placeholder, value, onChange, required, min }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <input
        type={type} name={name} placeholder={placeholder} value={value}
        onChange={onChange} required={required} min={min}
        className="input-dark"
      />
    </div>
  );
}
