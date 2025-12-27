const { connect } = require('../../_utils/db');
const { getTokenFromReq, verify } = require('../../_utils/auth');

module.exports = async (req, res) => {
  const db = await connect();
  if (req.method === 'GET'){
    const rows = await db.collection('posts').find({}).sort({ created_at: -1 }).toArray();
    return res.json(rows);
  }
  if (req.method === 'POST'){
    // auth
    const token = getTokenFromReq(req); if (!token || !verify(token)) return res.status(401).json({ error: 'Unauthorized' });
    const { id, title, description, image, link, category } = req.body;
    if (!id || !title) return res.status(400).json({ error: 'ID and title required' });
    if (!/^[a-zA-Z0-9_-]{1,50}$/.test(id)) return res.status(400).json({ error: 'Invalid id' });
    const existing = await db.collection('posts').findOne({ id });
    if (existing) return res.status(400).json({ error: 'A post with this ID already exists. Use Update.' });
    const doc = { id, title, description: description||'', image: image||'', link: link||'', category: category || 'uncategorized', created_at: Date.now() };
    await db.collection('posts').insertOne(doc);
    return res.json({ ok: true });
  }
  res.status(405).json({ error: 'Method not allowed' });
};