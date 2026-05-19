const { validationResult } = require('express-validator');
const db = require('../config/database');

const getCars = (req, res) => {
  try {
    const cars = db.searchCars(req.query);
    res.json({ success: true, data: cars, error: null });
  } catch (err) {
    console.error('Get cars error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const getCarById = (req, res) => {
  const car = db.findById('cars', req.params.id);
  if (!car) return res.status(404).json({ success: false, error: 'Car not found' });
  res.json({ success: true, data: car, error: null });
};

const createCar = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array()[0].msg });
  }

  try {
    const { brand, model, year, price_per_day, fuel_type, seats, transmission, category, image_url, description, available } = req.body;
    const car = db.insert('cars', {
      brand, model,
      year: parseInt(year),
      price_per_day: parseFloat(price_per_day),
      fuel_type,
      seats: parseInt(seats),
      transmission,
      category: category || 'Économique',
      image_url,
      description,
      available: available === false || available === 'false' ? false : true,
    });
    res.status(201).json({ success: true, data: car, error: null });
  } catch (err) {
    console.error('Create car error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const updateCar = (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  if (updates.year) updates.year = parseInt(updates.year);
  if (updates.price_per_day) updates.price_per_day = parseFloat(updates.price_per_day);
  if (updates.seats) updates.seats = parseInt(updates.seats);
  if (updates.available !== undefined) updates.available = updates.available === 'true' || updates.available === true;

  const car = db.update('cars', id, updates);
  if (!car) return res.status(404).json({ success: false, error: 'Car not found' });
  res.json({ success: true, data: car, error: null });
};

const deleteCar = (req, res) => {
  const removed = db.delete('cars', req.params.id);
  if (!removed) return res.status(404).json({ success: false, error: 'Car not found' });
  res.json({ success: true, data: { message: 'Car deleted' }, error: null });
};

const checkAvailability = (req, res) => {
  const { id } = req.params;
  const { pickup_date, return_date } = req.query;

  if (!pickup_date || !return_date) {
    return res.status(400).json({ success: false, error: 'pickup_date and return_date are required' });
  }
  if (pickup_date >= return_date) {
    return res.status(400).json({ success: false, error: 'return_date must be after pickup_date' });
  }

  const car = db.findById('cars', id);
  if (!car) return res.status(404).json({ success: false, error: 'Car not found' });

  const hasConflict = db.checkDateConflict(id, pickup_date, return_date);
  res.json({
    success: true,
    data: { available: car.available && !hasConflict },
    error: null,
  });
};

module.exports = { getCars, getCarById, createCar, updateCar, deleteCar, checkAvailability };
