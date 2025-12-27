module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const cloud = process.env.CLOUDINARY_CLOUD_NAME || '';
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET || '';
  if (!cloud || !preset) return res.status(400).json({ error: 'Cloudinary not configured' });
  res.json({ cloud_name: cloud, upload_preset: preset });
};