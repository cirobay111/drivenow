import { Link } from 'react-router-dom';
import config from '../config/config';
import { useLanguage } from '../context/LanguageContext';
import { Fuel, Users, Cog } from 'lucide-react';

const CATEGORY_COLORS = {
  'Économique': 'bg-blue-900/60 text-blue-300 border-blue-700',
  'Berline':    'bg-purple-900/60 text-purple-300 border-purple-700',
  'Classique':  'bg-amber-900/60 text-amber-300 border-amber-700',
  'SUV':        'bg-teal-900/60 text-teal-300 border-teal-700',
  'Sport':      'bg-orange-900/60 text-orange-300 border-orange-700',
  'Supercar':   'bg-red-900/60 text-red-300 border-red-700',
  'Prestige':   'bg-yellow-900/60 text-yellow-200 border-yellow-600',
};

export default function CarCard({ car, index = 0 }) {
  const { currency } = config;
  const { t } = useLanguage();
  const categoryStyle = CATEGORY_COLORS[car.category] || 'bg-[#1A1A1A] text-gray-400 border-[#2A2A2A]';

  return (
    <div className="card overflow-hidden group fade-up"
      style={{ animationDelay: `${index * 0.06}s`, willChange: 'transform, opacity' }}>
      <div className="relative overflow-hidden h-48">
        <img
          src={car.image_url || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105"
          style={{ transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)', willChange: 'transform' }}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'; }}
        />
        <div className="absolute top-3 right-3 bg-accent text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          {currency}{car.price_per_day}{t('car.perDay')}
        </div>
        {car.category && (
          <div className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryStyle}`}>
            {car.category}
          </div>
        )}
        {!car.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold bg-red-600 px-4 py-1 rounded-full text-sm">{t('car.unavailable')}</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-white text-lg leading-tight">{car.brand} {car.model}</h3>
          <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full border ${
            car.available
              ? 'bg-green-900/40 text-green-400 border-green-800'
              : 'bg-red-900/40 text-red-400 border-red-800'
          }`}>
            {car.available ? t('car.available') : t('car.unavailable')}
          </span>
        </div>
        <p className="text-gray-500 text-sm">{car.year}</p>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <Spec icon={Fuel} label={car.fuel_type} />
          <Spec icon={Users} label={`${car.seats} ${t('car.seats')}`} />
          <Spec icon={Cog} label={car.transmission} />
        </div>

        <div className="flex gap-2 mt-5">
          <Link to={`/cars/${car.id}`} className="flex-1 text-center btn-outline text-sm py-2">{t('car.details')}</Link>
          {car.available && (
            <Link to={`/booking/${car.id}`} className="flex-1 text-center btn-primary text-sm py-2">{t('car.book')}</Link>
          )}
        </div>
      </div>
    </div>
  );
}

function Spec({ icon: Icon, label }) {
  return (
    <div className="flex flex-col items-center bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg py-2 px-1 transition-colors duration-150 hover:border-accent/30">
      <Icon className="w-4 h-4 text-accent" />
      <span className="text-xs text-gray-500 font-medium mt-1 text-center leading-tight">{label}</span>
    </div>
  );
}
