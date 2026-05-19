const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_PATH = path.join(__dirname, '../../data.json');

// ── Default admin — edit credentials in .env or here ────────────────────────
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || 'admin@drivenow.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';
const ADMIN_NAME     = process.env.ADMIN_NAME     || 'Admin';

const DEFAULT_DATA = {
  _seq: { users: 1, cars: 1, bookings: 1 },
  users: [],
  cars: [],
  bookings: [],
};

// Initialize data file — creates a clean start with just an admin account
const initData = () => {
  if (!fs.existsSync(DATA_PATH)) {
    const data = { ...DEFAULT_DATA };
    data.users = [{
      id: 1,
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: bcrypt.hashSync(ADMIN_PASSWORD, 10),
      role: 'admin',
      created_at: new Date().toISOString(),
    }];
    data._seq.users = 2;
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    console.log(`Clean start: admin account created (${ADMIN_EMAIL})`);
  }
};

const load = () => JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const save = (data) => fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

initData();

// ── CRUD helpers ──────────────────────────────────────────────────────────────

const db = {
  findAll: (col, filter = {}) => {
    const data = load();
    return data[col].filter(item =>
      Object.entries(filter).every(([k, v]) => String(item[k]).toLowerCase() === String(v).toLowerCase())
    );
  },

  findOne: (col, filter) => {
    const data = load();
    const entries = Object.entries(filter);
    return data[col].find(item =>
      entries.every(([k, v]) => String(item[k]).toLowerCase() === String(v).toLowerCase())
    ) || null;
  },

  findById: (col, id) => {
    const data = load();
    return data[col].find(i => i.id === parseInt(id)) || null;
  },

  insert: (col, item) => {
    const data = load();
    const id = data._seq[col]++;
    const record = { id, ...item, created_at: new Date().toISOString() };
    data[col].push(record);
    save(data);
    return record;
  },

  update: (col, id, updates) => {
    const data = load();
    const idx = data[col].findIndex(i => i.id === parseInt(id));
    if (idx === -1) return null;
    data[col][idx] = { ...data[col][idx], ...updates };
    save(data);
    return data[col][idx];
  },

  delete: (col, id) => {
    const data = load();
    const idx = data[col].findIndex(i => i.id === parseInt(id));
    if (idx === -1) return null;
    const [removed] = data[col].splice(idx, 1);
    save(data);
    return removed;
  },

  checkDateConflict: (car_id, pickup_date, return_date) => {
    const data = load();
    return data.bookings.some(b => {
      if (b.car_id !== parseInt(car_id)) return false;
      if (['cancelled', 'completed'].includes(b.status)) return false;
      return b.pickup_date < return_date && b.return_date > pickup_date;
    });
  },

  searchCars: (filters) => {
    const data = load();
    return data.cars.filter(car => {
      if (filters.brand && !car.brand.toLowerCase().includes(filters.brand.toLowerCase())) return false;
      if (filters.fuel_type && car.fuel_type !== filters.fuel_type) return false;
      if (filters.transmission && car.transmission !== filters.transmission) return false;
      if (filters.seats && parseInt(car.seats) !== parseInt(filters.seats)) return false;
      if (filters.min_price && car.price_per_day < parseFloat(filters.min_price)) return false;
      if (filters.max_price && car.price_per_day > parseFloat(filters.max_price)) return false;
      return true;
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  getBookingStats: () => {
    const data = load();
    const today = new Date().toISOString().split('T')[0];
    const statusMap = {};
    let totalRevenue = 0;
    data.bookings.forEach(b => {
      statusMap[b.status] = (statusMap[b.status] || 0) + 1;
      if (b.status !== 'cancelled') totalRevenue += parseFloat(b.total_price || 0);
    });
    return {
      totalCars: data.cars.length,
      availableCars: data.cars.filter(c => c.available).length,
      totalBookings: data.bookings.length,
      newToday: data.bookings.filter(b => b.created_at?.startsWith(today)).length,
      totalRevenue,
      bookingsByStatus: Object.entries(statusMap).map(([status, total]) => ({ status, total: String(total) })),
    };
  },

  getAllBookingsWithCar: () => {
    const data = load();
    return data.bookings
      .map(b => {
        const car = data.cars.find(c => c.id === b.car_id);
        return { ...b, brand: car?.brand || '', model: car?.model || '', image_url: car?.image_url || '' };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
};

module.exports = db;
