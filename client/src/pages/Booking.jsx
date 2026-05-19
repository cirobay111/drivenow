import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import config from '../config/config';
import { useLanguage } from '../context/LanguageContext';
import content from '../data/content.json';
import { useCars } from '../hooks';
import { bookingService } from '../services/api';
import { CheckCircle, Check } from 'lucide-react';

export default function Booking() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { cars, isLoading: isLoadingCars } = useCars();
  const { t } = useLanguage();
  const [car, setCar] = useState(null);

  const [form, setForm] = useState({
    customer_name: '', customer_email: '', customer_phone: '',
    pickup_location: '',
    pickup_date: searchParams.get('pickup') || '',
    return_date: searchParams.get('return') || '',
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

  // WhatsApp alert to owner — sent by customer after submitting request
  const waNotifyUrl = config.contact.whatsapp
    ? `https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(
        `Nouvelle demande de réservation :\n` +
        `🚗 ${car?.brand} ${car?.model}\n` +
        `📅 Du ${form.pickup_date} au ${form.return_date}\n` +
        `📍 ${form.pickup_location}\n` +
        `👤 ${form.customer_name}\n` +
        `📞 ${form.customer_phone}\n` +
        `✉️ ${form.customer_email}\n` +
        `💰 Total estimé: ${currency}${totalPrice}`
      )}`
    : null;

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] p-4">
      <div className="card p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-accent/20 border border-accent/40 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{t('booking.requestSent')}</h2>
        <p className="text-gray-400 mb-2">{t('booking.requestDesc')}</p>
        <p className="text-gray-500 text-sm mb-6">
          {t('booking.contactSoon')} <strong className="text-gray-300">{form.customer_email}</strong>
        </p>
        <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl p-4 text-left text-sm space-y-2 mb-6">
          <p><span className="text-gray-600">Car:</span> <strong className="text-white">{car.brand} {car.model}</strong></p>
          <p><span className="text-gray-600">{t('booking.pickupDate')}:</span> <strong className="text-white">{form.pickup_date}</strong></p>
          <p><span className="text-gray-600">{t('booking.returnDate')}:</span> <strong className="text-white">{form.return_date}</strong></p>
          <p><span className="text-gray-600">{t('booking.total')}:</span> <strong className="text-accent text-lg">{currency}{totalPrice}</strong></p>
        </div>

        <div className="space-y-3">
          {waNotifyUrl && (
            <a href={waNotifyUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-3 rounded-xl transition-colors text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t('booking.notifyOwner')}
            </a>
          )}
          <Link to="/cars" className="btn-primary block py-3">{t('booking.browseMore')}</Link>
        </div>
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
          <h1 className="text-3xl font-bold text-white">{t('booking.completeBooking')}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card p-6 space-y-5">
              <h2 className="font-bold text-white text-xl">{t('booking.yourInfo')}</h2>
              {error && (
                <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-xl px-4 py-3 text-sm">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label={t('booking.fullName')}       name="customer_name"  type="text"  placeholder="John Doe"           value={form.customer_name}     onChange={handleChange} required />
                <FormField label={t('booking.email')}           name="customer_email" type="email" placeholder="john@example.com"   value={form.customer_email}    onChange={handleChange} required />
                <FormField label={t('booking.phone')}           name="customer_phone" type="tel"   placeholder="+212 600 000 000"    value={form.customer_phone}    onChange={handleChange} required />
                <FormField label={t('booking.pickupLocation')} name="pickup_location" type="text" placeholder="City, Airport..."  value={form.pickup_location}   onChange={handleChange} required />
                <FormField label={t('booking.pickupDate')} name="pickup_date" type="date" value={form.pickup_date} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} />
                <FormField label={t('booking.returnDate')} name="return_date" type="date" value={form.return_date} onChange={handleChange} required min={form.pickup_date || new Date().toISOString().split('T')[0]} />
              </div>
              <button
                type="submit" disabled={isSubmitting}
                className="btn-primary w-full text-base py-4 disabled:opacity-60"
              >
                {isSubmitting ? t('booking.processing') : `${t('booking.confirmBooking')} – ${currency}${totalPrice}`}
              </button>
            </form>
          </div>

          {/* Booking summary sidebar */}
          <div>
            <div className="card p-6 sticky top-20">
              <h3 className="font-bold text-white text-lg mb-4">{t('booking.summary')}</h3>
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
                  <span>{t('booking.pricePerDay')}</span><span>{currency}{car.price_per_day}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>{t('booking.duration')}</span><span>{totalDays} {totalDays !== 1 ? t('car.days') : t('car.day')}</span>
                </div>
                <div className="flex justify-between font-bold text-white text-base border-t border-[#2A2A2A] pt-2 mt-2">
                  <span>{t('booking.total')}</span><span className="text-accent text-xl">{currency}{totalPrice}</span>
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
