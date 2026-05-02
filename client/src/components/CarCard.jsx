import { Link } from 'react-router-dom';
import config from '../config/config';

export default function CarCard({ car, index = 0 }) {
  const { currency } = config;
  return (
    <article className="fleet-card group fade-up"
      style={{ animationDelay: `${index * 0.06}s`, willChange: 'transform, opacity' }}>
      <div className="relative overflow-hidden h-64">
        <img
          src={car.image_url || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 brightness-110 contrast-105"
          style={{ transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)', willChange: 'transform' }}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute top-4 left-4 bg-black/55 border border-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur">
          {car.year}
        </div>
        <div className="absolute top-4 right-4 bg-accent text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          {currency}{car.price_per_day}/day
        </div>
        <div className="absolute bottom-4 left-4 right-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]">
          <p className="text-xs text-accent font-semibold uppercase tracking-[0.2em]">{car.brand}</p>
          <h3 className="font-bold text-white text-2xl leading-tight mt-1">{car.model}</h3>
        </div>
        {!car.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold bg-red-600 px-4 py-1 rounded-full text-sm">Unavailable</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="grid grid-cols-3 gap-2">
          <Spec label="Fuel" value={car.fuel_type} />
          <Spec label="Seats" value={car.seats} />
          <Spec label="Shift" value={car.transmission} />
        </div>

        <p className="text-gray-500 text-sm leading-relaxed mt-4 line-clamp-2">
          {car.description || 'Premium comfort, reliable performance, and a polished rental experience.'}
        </p>

        <div className="flex gap-2 mt-5">
          <Link to={`/cars/${car.id}`} className="flex-1 text-center btn-outline text-sm py-2">Details</Link>
          {car.available && (
            <Link to={`/booking/${car.id}`} className="flex-1 text-center btn-primary text-sm py-2">Book Now</Link>
          )}
        </div>
      </div>
    </article>
  );
}

function Spec({ label, value }) {
  return (
    <div className="bg-black/35 border border-white/10 rounded-lg py-3 px-2 text-center transition-colors duration-150 group-hover:border-accent/30">
      <span className="block text-[10px] uppercase tracking-[0.18em] text-gray-600">{label}</span>
      <span className="block text-xs text-gray-300 font-semibold mt-1 leading-tight">{value}</span>
    </div>
  );
}
