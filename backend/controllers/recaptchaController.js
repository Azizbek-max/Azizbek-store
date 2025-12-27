const fetch = require('node-fetch');

exports.verify = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'token missing' });

    const secret = process.env.RECAPTCHA_SECRET;
    if (!secret) return res.status(500).json({ success: false, message: 'reCAPTCHA not configured' });

    const resp = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`
    });
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'verification failure' });
  }
};