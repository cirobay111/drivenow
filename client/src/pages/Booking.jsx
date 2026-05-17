import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import config from '../config/config';
import content from '../data/content.json';
import { useCars } from '../hooks';
import { bookingService } from '../services/api';
import { CheckCircle, Check } from 'lucide-react';

export default function Booking() {
  const { id } = useParams();
  const { cars, isLoading: isLoadingCars } = useCars();
  const [car, setCar] = useState(null);

  const [form, setForm] = useState({
    customer_name: '', customer_email: '', customer_phone: '',
    pickup_location: '', pickup_date: '', return_date: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isLoadingCars && cars.length > 0) {
      const foundCar = cars.find(c => c.id === Number(id));
      setCar(foundCar || null);
    }
  }, [id, cars, isLoadingCars]);

  const { currency } = config;
  const { booking: bookingContent } = content;

  const totalDays = form.pickup_date && form.return_date
    ? Math.max(0, Math.ceil((new Date(form.return_date) - new Date(form.pickup_date)) / 86400000))
    : 0;
  const totalPrice = car ? (totalDays * parseFloat(car.price_per_day)).toFixed(2) : '0.00';

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (totalDays < 1) { setError('Return date must be after pickup date.'); return; }
    if (!car) { setError('Car not found.'); return; }
    setIsSubmitting(true);
    try {
      await bookingService.create({ ...form, car_id: car.id });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCars) return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!car) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 12h12m-12 5h12M3 7l1.293-1.293a1 1 0 011.414 0L9 7m0 0l1.293-1.293a1 1 0 011.414 0L15 7" />
          </svg>
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
          <CheckCircle className="w-10 h-10 text-accent" />
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
      <div className="bg-[#080808] border-b border-[#2A2A2A] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-gray-600 text-sm mb-3">
            <Link to="/cars" className="hover:text-accent">Cars</Link>
            <span className="mx-2">/</span>
            <Link to={`/cars/${id}`} className="hover:text-accent">{car.brand} {car.model}</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Booking</span>
          </nav>
          <h1 className="text-3xl font-bold text-white">Complete Your Booking</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card p-6 space-y-5">
              <h2 className="font-bold text-white text-xl">Your Information</h2>
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
                <FormField label="Pickup Date" name="pickup_date" type="date" value={form.pickup_date} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} />
                <FormField label="Return Date" name="return_date" type="date" value={form.return_date} onChange={handleChange} required min={form.pickup_date || new Date().toISOString().split('T')[0]} />
              </div>
              <button
                type="submit" disabled={isSubmitting}
                className="btn-primary w-full text-base py-4 disabled:opacity-60"
              >
                {isSubmitting ? 'Processing...' : `Confirm Booking – ${currency}${totalPrice}`}
              </button>
            </form>
          </div>

          {/* Booking summary sidebar */}
          <div>
            <div className="card p-6 sticky top-20">
              <h3 className="font-bold text-white text-lg mb-4">Booking Summary</h3>
              <img
                src={car.image_url}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-36 object-cover rounded-xl mb-4"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'; }}
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
                {bookingContent.guarantees.map(g => (
                  <p key={g} className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-accent flex-shrink-0" /> {g}
                  </p>
                ))}
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
