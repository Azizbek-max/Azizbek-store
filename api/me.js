const { getTokenFromReq, verify } = require('./_utils/auth');
module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const token = getTokenFromReq(req);
  const payload = token ? verify(token) : null;
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ ok: true, username: payload.username });
};