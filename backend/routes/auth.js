const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register (for users) - Admin will be seeded manually
const { authLimiter } = require('../middleware/rateLimiters');
const recaptchaUtil = require('../controllers/recaptchaUtil');

router.post('/register', authLimiter,
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // reCAPTCHA check (if configured)
    const token = req.body.recaptchaToken;
    if (process.env.RECAPTCHA_SECRET) {
      const ok = await recaptchaUtil.verifyToken(token);
      if (!ok) return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: 'User already exists' });
      user = new User({ name, email, password });
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
      res.json({ token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
