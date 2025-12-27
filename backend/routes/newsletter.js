const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { newsletterLimiter } = require('../middleware/rateLimiters');
const recaptchaUtil = require('../controllers/recaptchaUtil');
const newsletterController = require('../controllers/newsletterController');

router.post('/subscribe', newsletterLimiter,
  body('email').isEmail().withMessage('Valid email required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // optional reCAPTCHA check
    const token = req.body.recaptchaToken;
    if (process.env.RECAPTCHA_SECRET) {
      const ok = await recaptchaUtil.verifyToken(token);
      if (!ok) return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }

    return newsletterController.subscribe(req, res);
  }
);

module.exports = router;
