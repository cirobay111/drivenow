const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const db = require('../config/database');

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array()[0].msg });
  }

  const { email, password } = req.body;

  try {
    const user = db.findOne('users', { email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
      error: null,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const getMe = (req, res) => {
  const user = db.findById('users', req.user.id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  const { password: _, ...safe } = user;
  res.json({ success: true, data: safe, error: null });
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, error: 'Current and new password are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, error: 'New password must be at least 6 characters' });
  }

  try {
    const user = db.findById('users', req.user.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }

    const hashed = bcrypt.hashSync(newPassword, 10);
    db.update('users', user.id, { password: hashed });

    res.json({ success: true, data: { message: 'Password updated' }, error: null });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { login, getMe, changePassword };
