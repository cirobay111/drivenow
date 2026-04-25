const express = require('express');
const { body } = require('express-validator');
const { getCars, getCarById, createCar, updateCar, deleteCar } = require('../controllers/carController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { publicLimiter, authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

const carValidation = [
  body('brand').notEmpty().withMessage('Brand required'),
  body('model').notEmpty().withMessage('Model required'),
  body('year').isInt({ min: 1990, max: 2030 }).withMessage('Valid year required'),
  body('price_per_day').isFloat({ min: 1 }).withMessage('Valid price required'),
  body('fuel_type').notEmpty().withMessage('Fuel type required'),
  body('seats').isInt({ min: 1, max: 20 }).withMessage('Valid seats required'),
  body('transmission').notEmpty().withMessage('Transmission required'),
];

router.get('/', publicLimiter, getCars);
router.get('/:id', publicLimiter, getCarById);
router.post('/', authenticate, requireAdmin, authLimiter, carValidation, createCar);
router.put('/:id', authenticate, requireAdmin, authLimiter, updateCar);
router.delete('/:id', authenticate, requireAdmin, authLimiter, deleteCar);

module.exports = router;
