const bcrypt = require('bcryptjs');
const { connect } = require('./_utils/db');
const { sign, setTokenCookie } = require('./_utils/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try{
    const { username, password } = req.body;
    const db = await connect();
    const user = await db.collection('admins').findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = sign({ username });
    setTokenCookie(res, token);
    res.json({ ok: true });
  }catch(e){ console.error('login error', e); res.status(500).json({ error: 'Server error' }); }
};