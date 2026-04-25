import { useParams, Link } from 'react-router-dom';
import config from '../config/config';
// Edit cars here → src/data/cars.json
import allCars from '../data/cars.json';

export default function CarDetail() {
  const { id } = useParams();
  const car = allCars.find(c => c.id === Number(id));

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

  const { currency } = config;

  const specs = [
    { icon: '⛽', label: 'Fuel',         value: car.fuel_type           },
    { icon: '⚙️', label: 'Transmission', value: car.transmission        },
    { icon: '👥', label: 'Seats',        value: `${car.seats} Passengers` },
    { icon: '📅', label: 'Year',         value: car.year                },
  ];

  const fallbackImage = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800';

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
              <h2 className="font-bold text-white text-xl mb-4">Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {specs.map(({ icon, label, value }) => (
                  <div key={label} className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl p-4 text-center hover:border-accent/30 transition-colors">
                    <div className="text-2xl mb-1">{icon}</div>
                    <p className="text-xs text-gray-600 font-medium">{label}</p>
                    <p className="text-white font-bold text-sm mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {car.description && (
              <div className="card p-6">
                <h2 className="font-bold text-white text-xl mb-3">About this car</h2>
                <p className="text-gray-400 leading-relaxed">{car.description}</p>
              </div>
            )}
          </div>

          {/* Pricing sidebar — currency from src/config/config.js */}
          <div className="space-y-4">
            <div className="card p-6 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm">Price per day</p>
                  <p className="text-3xl font-bold text-accent">{currency}{car.price_per_day}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  car.available
                    ? 'bg-green-900/50 text-green-400 border border-green-800'
                    : 'bg-red-900/50 text-red-400 border border-red-800'
                }`}>
                  {car.available ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-500 border-t border-[#2A2A2A] pt-4 mb-6">
                <div className="flex justify-between"><span>Insurance</span><span className="text-accent font-medium">✓ Included</span></div>
                <div className="flex justify-between"><span>Support</span><span className="text-accent font-medium">✓ 24/7</span></div>
                <div className="flex justify-between"><span>Free cancellation</span><span className="text-accent font-medium">✓ Up to 24h</span></div>
              </div>

              {car.available ? (
                <Link to={`/booking/${car.id}`} className="btn-primary w-full text-center block">Book This Car</Link>
              ) : (
                <button disabled className="w-full bg-[#1A1A1A] text-gray-600 py-3 rounded-xl font-semibold cursor-not-allowed border border-[#2A2A2A]">
                  Not Available
                </button>
              )}
              <Link to="/cars" className="btn-outline w-full text-center block mt-3 text-sm">View Other Cars</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
