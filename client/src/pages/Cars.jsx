import { useState, useEffect, useMemo } from 'react';
import CarCard from '../components/CarCard';
import config from '../config/config';
import { carService } from '../services/api';

export default function Cars() {
  const [allCars, setAllCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    brand: '', fuel_type: '', transmission: '', seats: '', min_price: '', max_price: '',
  });

  useEffect(() => {
    carService.getAll()
      .then(res => setAllCars(res.data.data || []))
      .catch(() => setAllCars([]))
      .finally(() => setIsLoading(false));
  }, []);

  const brands        = useMemo(() => [...new Set(allCars.map(c => c.brand))].sort(), [allCars]);
  const fuelTypes     = useMemo(() => [...new Set(allCars.map(c => c.fuel_type))].sort(), [allCars]);
  const transmissions = useMemo(() => [...new Set(allCars.map(c => c.transmission))].sort(), [allCars]);
  const seatOptions   = useMemo(() => [...new Set(allCars.map(c => c.seats))].sort((a, b) => a - b), [allCars]);

  const cars = useMemo(() => {
    return allCars.filter(car => {
      if (filters.brand        && car.brand        !== filters.brand)                     return false;
      if (filters.fuel_type    && car.fuel_type    !== filters.fuel_type)                 return false;
      if (filters.transmission && car.transmission !== filters.transmission)              return false;
      if (filters.seats        && car.seats        !== Number(filters.seats))             return false;
      if (filters.min_price    && car.price_per_day < Number(filters.min_price))          return false;
      if (filters.max_price    && car.price_per_day > Number(filters.max_price))          return false;
      return true;
    });
  }, [filters]);

  const handleFilter = (key, value) =>
    setFilters(p => ({ ...p, [key]: p[key] === value ? '' : value }));

  const handleReset = () =>
    setFilters({ brand: '', fuel_type: '', transmission: '', seats: '', min_price: '', max_price: '' });

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="bg-[#080808] border-b border-[#2A2A2A] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-accent font-semibold text-sm tracking-[0.3em] uppercase mb-2">Our Fleet</p>
          <h1 className="text-4xl font-bold text-white">Browse Our Cars</h1>
          <p className="text-gray-500 mt-2">{isLoading ? '...' : `${allCars.length} vehicles available`}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Filters sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="card p-5 sticky top-20">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-white text-lg">
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-2 bg-accent text-black text-xs font-bold px-2 py-0.5 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </h3>
                {activeFilterCount > 0 && (
                  <button onClick={handleReset} className="text-accent text-sm hover:underline">Reset</button>
                )}
              </div>

              {/* Brand — auto-generated from cars.json */}
              <FilterGroup title="Brand">
                {brands.map(b => (
                  <FilterChip key={b} label={b} active={filters.brand === b} onClick={() => handleFilter('brand', b)} />
                ))}
              </FilterGroup>

              {/* Fuel Type — auto-generated from cars.json */}
              <FilterGroup title="Fuel Type">
                {fuelTypes.map(f => (
                  <FilterChip key={f} label={f} active={filters.fuel_type === f} onClick={() => handleFilter('fuel_type', f)} />
                ))}
              </FilterGroup>

              {/* Transmission — auto-generated from cars.json */}
              <FilterGroup title="Transmission">
                {transmissions.map(t => (
                  <FilterChip key={t} label={t} active={filters.transmission === t} onClick={() => handleFilter('transmission', t)} />
                ))}
              </FilterGroup>

              {/* Seats — auto-generated from cars.json */}
              <FilterGroup title="Seats">
                {seatOptions.map(s => (
                  <FilterChip key={s} label={`${s} Seats`} active={filters.seats === String(s)} onClick={() => handleFilter('seats', String(s))} />
                ))}
              </FilterGroup>

              {/* Price range — edit currency in src/config/config.js */}
              <FilterGroup title={`Price / Day (${config.currency})`}>
                <div className="flex gap-2 w-full">
                  <input
                    type="number" placeholder="Min" value={filters.min_price}
                    onChange={e => setFilters(p => ({ ...p, min_price: e.target.value }))}
                    className="w-1/2 bg-[#0D0D0D] border border-[#2A2A2A] text-white rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-accent"
                  />
                  <input
                    type="number" placeholder="Max" value={filters.max_price}
                    onChange={e => setFilters(p => ({ ...p, max_price: e.target.value }))}
                    className="w-1/2 bg-[#0D0D0D] border border-[#2A2A2A] text-white rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </FilterGroup>
            </div>
          </aside>

          {/* Cars grid */}
          <div className="flex-1">
            <p className="text-gray-600 text-sm mb-4">
              {cars.length} car{cars.length !== 1 ? 's' : ''} found
            </p>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-[#1A1A1A] rounded-2xl animate-pulse" />)}
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-20 text-gray-600">
                <p className="text-5xl mb-4">🚗</p>
                <p className="text-lg font-medium text-gray-400">No cars match your filters</p>
                <button onClick={handleReset} className="btn-outline mt-4 text-sm">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cars.map((car, i) => <CarCard key={car.id} car={car} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div className="mb-5">
      <p className="font-semibold text-gray-300 text-sm mb-2 tracking-wide">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-150
      ${active
        ? 'bg-accent text-black border-accent'
        : 'border-[#2A2A2A] text-gray-500 hover:border-accent hover:text-accent'
      }`}>
      {label}
    </button>
  );
}
