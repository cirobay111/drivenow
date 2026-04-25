const express = require('express');
const { body } = require('express-validator');
const { createBooking, getBookings, updateBookingStatus, getStats } = require('../controllers/bookingController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { publicLimiter, authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

const bookingValidation = [
  body('car_id').isInt().withMessage('Valid car ID required'),
  body('customer_name').notEmpty().withMessage('Name required'),
  body('customer_email').isEmail().withMessage('Valid email required'),
  body('customer_phone').notEmpty().withMessage('Phone required'),
  body('pickup_location').notEmpty().withMessage('Pickup location required'),
  body('pickup_date').isDate().withMessage('Valid pickup date required'),
  body('return_date').isDate().withMessage('Valid return date required'),
];

router.post('/', publicLimiter, bookingValidation, createBooking);
router.get('/', authenticate, requireAdmin, authLimiter, getBookings);
router.get('/stats', authenticate, requireAdmin, authLimiter, getStats);
router.put('/:id/status', authenticate, requireAdmin, authLimiter, updateBookingStatus);

module.exports = router;
