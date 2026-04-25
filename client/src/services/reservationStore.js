// ============================================================
// Reservation Store — localStorage persistence layer
// ============================================================
// All public booking form submissions and admin operations
// read/write through these helpers.
//
// Data shape per reservation:
// {
//   id            : number  (timestamp-based unique id)
//   status        : 'pending' | 'confirmed' | 'cancelled' | 'completed'
//   created_at    : ISO string
//   customer_name : string
//   customer_email: string
//   customer_phone: string
//   pickup_location: string
//   pickup_date   : 'YYYY-MM-DD'
//   return_date   : 'YYYY-MM-DD'
//   total_days    : number
//   total_price   : number
//   car_id        : number
//   car_brand     : string
//   car_model     : string
//   car_image     : string
// }
// ============================================================

const STORAGE_KEY = 'car_rental_reservations';

const read = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
};

const write = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

// Return all reservations, newest first
export const getAllReservations = () =>
  read().sort((a, b) => b.id - a.id);

// Add a new reservation from the public booking form
export const addReservation = (data) => {
  const all = read();
  const reservation = {
    ...data,
    id: Date.now(),
    status: 'pending',
    created_at: new Date().toISOString(),
  };
  write([reservation, ...all]);
  return reservation;
};

// Update only the status field of a reservation
export const updateReservationStatus = (id, status) => {
  write(read().map(r => r.id === id ? { ...r, status } : r));
};

// Permanently delete a reservation
export const deleteReservation = (id) => {
  write(read().filter(r => r.id !== id));
};

// Compute dashboard stats from stored reservations
export const getStats = (allCars) => {
  const all = read();
  const today = new Date().toISOString().split('T')[0];

  const revenue = all
    .filter(r => r.status === 'confirmed' || r.status === 'completed')
    .reduce((sum, r) => sum + (parseFloat(r.total_price) || 0), 0);

  const byStatus = ['pending', 'confirmed', 'completed', 'cancelled'].map(s => ({
    status: s,
    count: all.filter(r => r.status === s).length,
  }));

  return {
    totalReservations: all.length,
    totalRevenue: revenue,
    availableCars: allCars.filter(c => c.available).length,
    newToday: all.filter(r => r.created_at?.startsWith(today)).length,
    byStatus,
  };
};
