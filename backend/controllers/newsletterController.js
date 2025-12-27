const Newsletter = require('../models/Newsletter');

const fetch = require('node-fetch');

async function subscribeToMailchimp(email) {
  if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_LIST_ID) return false;
  const key = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  const dc = key.split('-')[1];
  if (!dc) return false;
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`;
  const body = { email_address: email, status: 'subscribed' };
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `apikey ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return resp.ok;
}

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const existing = await Newsletter.findOne({ email });
    if (existing) return res.status(200).json({ message: 'Already subscribed' });
    await Newsletter.create({ email });

    // optional Mailchimp integration
    try {
      const ok = await subscribeToMailchimp(email);
      if (!ok) console.warn('Mailchimp subscribe failed or not configured');
    } catch (err) { console.warn('Mailchimp error', err.message) }

    res.status(201).json({ message: 'Subscribed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
