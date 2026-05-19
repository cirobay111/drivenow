import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import config from '../config/config';
import { useLanguage } from '../context/LanguageContext';
import { useCars } from '../hooks';
import { carService } from '../services/api';
import { Fuel, Cog, Users, Calendar, CheckCircle, XCircle, Loader } from 'lucide-react';

export default function CarDetail() {
  const { id } = useParams();
  const { cars, isLoading } = useCars();
  const { t } = useLanguage();
  const [car, setCar] = useState(null);
  const [dates, setDates] = useState({ pickup: '', return: '' });
  const [avail, setAvail] = useState(null); // null | 'checking' | true | false

  useEffect(() => {
    if (!isLoading && cars.length > 0) {
      const foundCar = cars.find(c => c.id === Number(id));
      setCar(foundCar || null);
    }
  }, [id, cars, isLoading]);

  useEffect(() => {
    if (!dates.pickup || !dates.return || dates.pickup >= dates.return || !car) {
      setAvail(null);
      return;
    }
    setAvail('checking');
    carService.checkAvailability(car.id, dates.pickup, dates.return)
      .then(res => setAvail(res.data.data.available))
      .catch(() => setAvail(null));
  }, [dates.pickup, dates.return, car]);

  if (isLoading) return (
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

  const { currency, contact: { whatsapp } } = config;
  const fallbackImage = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800';
  const today = new Date().toISOString().split('T')[0];
  const totalDays = dates.pickup && dates.return
    ? Math.max(0, Math.ceil((new Date(dates.return) - new Date(dates.pickup)) / 86400000))
    : 0;
  const waMessage = `Bonjour, je souhaite réserver la ${car.brand} ${car.model} du ${dates.pickup || '...'} au ${dates.return || '...'}.`;
  const waUrl = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(waMessage)}` : null;

  const specs = [
    { icon: Fuel, label: t('car.fuel'),         value: car.fuel_type },
    { icon: Cog, label: t('car.transmission'), value: car.transmission },
    { icon: Users, label: t('car.seats'),        value: `${car.seats}` },
    { icon: Calendar, label: t('car.year'),         value: car.year },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="bg-[#080808] border-b border-[#2A2A2A] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-gray-600 text-sm mb-3">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/cars" className="hover:text-accent transition-colors">Cars</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{car.brand} {car.model}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{car.brand} {car.model}</h1>
          <p className="text-gray-500 mt-1">{car.year} · {car.transmission} · {car.fuel_type}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card overflow-hidden">
              <img
                src={car.image_url || fallbackImage}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-72 md:h-96 object-cover"
                onError={(e) => { e.target.src = fallbackImage; }}
              />
            </div>

            <div className="card p-6">
              <h2 className="font-bold text-white text-xl mb-4">{t('car.specifications')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl p-4 text-center hover:border-accent/30 transition-colors">
                    <Icon className="w-6 h-6 mx-auto mb-1 text-accent" />
                    <p className="text-xs text-gray-600 font-medium">{label}</p>
                    <p className="text-white font-bold text-sm mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {car.description && (
              <div className="card p-6">
                <h2 className="font-bold text-white text-xl mb-3">{t('car.aboutCar')}</h2>
                <p className="text-gray-400 leading-relaxed">{car.description}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="card p-6 sticky top-20">
              {/* Price + global availability */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm">{t('car.pricePerDay')}</p>
                  <p className="text-3xl font-bold text-accent">{currency}{car.price_per_day}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  car.available
                    ? 'bg-green-900/50 text-green-400 border border-green-800'
                    : 'bg-red-900/50 text-red-400 border border-red-800'
                }`}>
                  {car.available ? t('car.available') : t('car.unavailable')}
                </span>
              </div>

              {/* Date availability checker */}
              {car.available && (
                <div className="border border-[#2A2A2A] rounded-xl p-4 mb-4 space-y-3">
                  <p className="text-sm font-semibold text-gray-300">{t('car.checkAvailability')}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">{t('car.pickup')}</label>
                      <input type="date" min={today}
                        value={dates.pickup}
                        onChange={e => setDates(d => ({ ...d, pickup: e.target.value, return: d.return && d.return <= e.target.value ? '' : d.return }))}
                        className="w-full bg-[#0D0D0D] border border-[#2A2A2A] text-white rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">{t('car.returnDate')}</label>
                      <input type="date" min={dates.pickup || today}
                        value={dates.return}
                        onChange={e => setDates(d => ({ ...d, return: e.target.value }))}
                        className="w-full bg-[#0D0D0D] border border-[#2A2A2A] text-white rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  {/* Availability result */}
                  {avail === 'checking' && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Loader className="w-3.5 h-3.5 animate-spin" /> {t('car.checking')}
                    </div>
                  )}
                  {avail === true && totalDays > 0 && (
                    <div className="flex items-center justify-between bg-green-900/20 border border-green-800 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2 text-xs text-green-400">
                        <CheckCircle className="w-3.5 h-3.5" /> {t('car.availableFor')} {totalDays} {totalDays > 1 ? t('car.days') : t('car.day')}
                      </div>
                      <span className="text-xs font-bold text-accent">{currency}{(car.price_per_day * totalDays).toFixed(2)}</span>
                    </div>
                  )}
                  {avail === false && (
                    <div className="flex items-center gap-2 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2 text-xs text-red-400">
                      <XCircle className="w-3.5 h-3.5" /> {t('car.alreadyBooked')}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2 text-sm text-gray-500 border-t border-[#2A2A2A] pt-4 mb-4">
                <div className="flex justify-between"><span>{t('car.insurance')}</span><span className="text-accent font-medium">✓ {t('car.included')}</span></div>
                <div className="flex justify-between"><span>{t('car.support')}</span><span className="text-accent font-medium">✓ 24/7</span></div>
                <div className="flex justify-between"><span>{t('car.freeCancellation')}</span><span className="text-accent font-medium">✓ {t('car.upTo24h')}</span></div>
              </div>

              {car.available && avail !== false ? (
                <Link
                  to={`/booking/${car.id}${dates.pickup && dates.return ? `?pickup=${dates.pickup}&return=${dates.return}` : ''}`}
                  className="btn-primary w-full text-center block"
                >
                  {t('car.bookVehicle')}
                </Link>
              ) : (
                <button disabled className="w-full bg-[#1A1A1A] text-gray-600 py-3 rounded-xl font-semibold cursor-not-allowed border border-[#2A2A2A]">
                  {!car.available ? t('car.unavailable') : t('car.datesUnavailable')}
                </button>
              )}

              {/* WhatsApp contact */}
              {waUrl && (
                <a href={waUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 mt-3 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t('car.contactWhatsApp')}
                </a>
              )}

              <Link to="/cars" className="btn-outline w-full text-center block mt-3 text-sm">{t('car.otherCars')}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
