import { Link } from 'react-router-dom';
import config from '../config/config';

export default function CarCard({ car, index = 0 }) {
  const { currency } = config;
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
          {currency}{car.price_per_day}/day
        </div>
        {!car.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold bg-red-600 px-4 py-1 rounded-full text-sm">Unavailable</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-white text-lg leading-tight">{car.brand} {car.model}</h3>
        <p className="text-gray-500 text-sm">{car.year}</p>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <Spec icon="⛽" label={car.fuel_type} />
          <Spec icon="👥" label={`${car.seats} Seats`} />
          <Spec icon="⚙️" label={car.transmission} />
        </div>

        <div className="flex gap-2 mt-5">
          <Link to={`/cars/${car.id}`} className="flex-1 text-center btn-outline text-sm py-2">Details</Link>
          {car.available && (
            <Link to={`/booking/${car.id}`} className="flex-1 text-center btn-primary text-sm py-2">Book Now</Link>
          )}
        </div>
      </div>
    </div>
  );
}

function Spec({ icon, label }) {
  return (
    <div className="flex flex-col items-center bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg py-2 px-1 transition-colors duration-150 hover:border-accent/30">
      <span className="text-base">{icon}</span>
      <span className="text-xs text-gray-500 font-medium mt-1 text-center leading-tight">{label}</span>
    </div>
  );
}
