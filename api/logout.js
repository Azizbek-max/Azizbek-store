const { clearTokenCookie } = require('./_utils/auth');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  clearTokenCookie(res);
  res.json({ ok: true });
};