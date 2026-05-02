import seedCars from '../data/cars.json';

const STORAGE_KEY = 'drivenow_cars';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800';

const normalizeCar = (car) => ({
  ...car,
  id: Number(car.id),
  year: Number(car.year),
  price_per_day: Number(car.price_per_day),
  seats: Number(car.seats),
  available: car.available !== false,
  image_url: car.image_url || FALLBACK_IMAGE,
});

const read = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return seedCars.map(normalizeCar);
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.map(normalizeCar) : seedCars.map(normalizeCar);
  } catch {
    return seedCars.map(normalizeCar);
  }
};

const write = (cars) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cars.map(normalizeCar)));
  window.dispatchEvent(new Event('drivenow-cars-updated'));
};

export const getAllCars = () => read().sort((a, b) => a.id - b.id);

export const getCarById = (id) => getAllCars().find(car => car.id === Number(id)) || null;

export const saveCar = (data, id) => {
  const cars = read();
  const normalized = normalizeCar({
    ...data,
    id: id ? Number(id) : Math.max(0, ...cars.map(car => car.id)) + 1,
  });

  const exists = cars.some(car => car.id === normalized.id);
  const next = exists
    ? cars.map(car => (car.id === normalized.id ? normalized : car))
    : [...cars, normalized];

  write(next);
  return normalized;
};

export const deleteCar = (id) => {
  const next = read().filter(car => car.id !== Number(id));
  write(next);
};

export const resetCars = () => write(seedCars.map(normalizeCar));

export { FALLBACK_IMAGE };
