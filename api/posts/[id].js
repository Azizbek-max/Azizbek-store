const { connect } = require('../../_utils/db');
const { getTokenFromReq, verify } = require('../../_utils/auth');

module.exports = async (req, res) => {
  const db = await connect();
  const id = req.query && req.query.id;
  if (!id) return res.status(400).json({ error: 'ID required' });
  if (req.method === 'GET'){
    const row = await db.collection('posts').findOne({ id });
    if (!row) return res.status(404).json({ error: 'Not found' });
    return res.json(row);
  }
  // protected
  const token = getTokenFromReq(req); if (!token || !verify(token)) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method === 'PUT'){
    const { title, description, image, link, category } = req.body;
    const err = !title ? 'Title is required' : null;
    if (err) return res.status(400).json({ error: err });
    const info = await db.collection('posts').findOneAndUpdate({ id }, { $set: { title, description: description||'', image: image||'', link: link||'', category: category || 'uncategorized' } }, { returnDocument: 'after' });
    if (!info.value) return res.status(404).json({ error: 'Not found' });
    return res.json({ ok: true });
  }
  if (req.method === 'DELETE'){
    const info = await db.collection('posts').findOneAndDelete({ id });
    if (!info.value) return res.status(404).json({ error: 'Not found' });
    // Note: images are in Cloudinary — optional: remove via Cloudinary API
    return res.json({ ok: true });
  }
  res.status(405).json({ error: 'Method not allowed' });
};