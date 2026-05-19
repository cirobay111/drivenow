const express = require('express');
const { body } = require('express-validator');
const { login, getMe, changePassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  login
);

router.get('/me', authenticate, getMe);
router.put('/change-password', authenticate, changePassword);

module.exports = router;
