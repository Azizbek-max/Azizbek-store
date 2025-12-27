const bcrypt = require('bcryptjs');
const { connect } = require('./_utils/db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try{
    const db = await connect();
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const existing = await db.collection('admins').countDocuments();
    if (existing > 0) return res.status(400).json({ error: 'Admin already exists' });
    const hash = await bcrypt.hash(password, 10);
    await db.collection('admins').insertOne({ username, password_hash: hash, created_at: Date.now() });
    res.json({ ok: true });
  }catch(e){ console.error('setup error', e); res.status(500).json({ error: 'Server error' }); }
};
