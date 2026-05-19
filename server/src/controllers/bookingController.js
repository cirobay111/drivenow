const { validationResult } = require('express-validator');
const db = require('../config/database');

const createBooking = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array()[0].msg });
  }

  const { car_id, customer_name, customer_email, customer_phone, pickup_location, pickup_date, return_date } = req.body;

  try {
    const car = db.findById('cars', car_id);
    if (!car || !car.available) {
      return res.status(400).json({ success: false, error: 'Car not available' });
    }

    const days = Math.ceil((new Date(return_date) - new Date(pickup_date)) / (1000 * 60 * 60 * 24));
    if (days < 1) {
      return res.status(400).json({ success: false, error: 'Invalid date range' });
    }

    if (db.checkDateConflict(car_id, pickup_date, return_date)) {
      return res.status(400).json({ success: false, error: 'Car is already booked for these dates' });
    }

    const total_price = parseFloat((car.price_per_day * days).toFixed(2));
    const booking = db.insert('bookings', { car_id: parseInt(car_id), customer_name, customer_email, customer_phone, pickup_location, pickup_date, return_date, total_price, status: 'pending' });

    res.status(201).json({ success: true, data: booking, error: null });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const getBookings = (req, res) => {
  try {
    const bookings = db.getAllBookingsWithCar();
    res.json({ success: true, data: bookings, error: null });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const updateBookingStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'cancelled', 'completed'];

  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status' });
  }

  const booking = db.update('bookings', id, { status });
  if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
  res.json({ success: true, data: booking, error: null });
};

const getStats = (req, res) => {
  try {
    const stats = db.getBookingStats();
    res.json({ success: true, data: stats, error: null });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const deleteBooking = (req, res) => {
  const removed = db.delete('bookings', req.params.id);
  if (!removed) return res.status(404).json({ success: false, error: 'Booking not found' });
  res.json({ success: true, data: { message: 'Booking deleted' }, error: null });
};

module.exports = { createBooking, getBookings, updateBookingStatus, getStats, deleteBooking };
