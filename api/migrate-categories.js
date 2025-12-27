const { connect } = require('./_utils/db');
const { getTokenFromReq, verify } = require('./_utils/auth');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const token = getTokenFromReq(req); if (!token || !verify(token)) return res.status(401).json({ error: 'Unauthorized' });
  const db = await connect();
  const result = await db.collection('posts').updateMany({ category: { $exists: false } }, { $set: { category: 'uncategorized' } });
  res.json({ ok: true, changed: result.modifiedCount });
};