const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data.json');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Simple JSON "DB" helpers (synchronous - small scale)
function readDB(){
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e){
    return { admins: [], posts: [] };
  }
}
function writeDB(data){
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext);
  }
});
const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'change_this_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', express.static(path.join(__dirname)));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Helper
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

function validatePostInput({id, title, link, category}){
  const allowed = ['', 'furniture','tech','uncategorized'];
  if (!id || !title) return 'ID and title are required';
  if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,50}$/.test(id)) return 'ID must be alphanumeric (letters, numbers, - or _) and up to 50 chars';
  if (typeof title !== 'string' || title.trim().length === 0) return 'Title is required';
  if (link && !/^https?:\/\//.test(link)) return 'Link must start with http:// or https://';
  if (category && !allowed.includes(category)) return 'Invalid category';
  return null;
}

// One-time setup route to create initial admin (only if no admin exists)
app.post('/api/setup', async (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  if (db.admins.length > 0) return res.status(400).json({ error: 'Admin already exists' });
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  if (typeof username !== 'string' || username.length < 3) return res.status(400).json({ error: 'username must be at least 3 chars' });
  const hash = await bcrypt.hash(password, 10);
  db.admins.push({ id: Date.now(), username, password_hash: hash });
  writeDB(db);
  return res.json({ ok: true });
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  const user = db.admins.find(a=>a.username === username);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  req.session.user = { id: user.id, username: user.username };
  return res.json({ ok: true });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

// Posts API
app.get('/api/posts', (req, res) => {
  const db = readDB();
  const rows = db.posts.sort((a,b)=>b.created_at - a.created_at);
  res.json(rows);
});

app.get('/api/posts/:id', (req, res) => {
  const db = readDB();
  const row = db.posts.find(p=>p.id === req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

app.post('/api/upload', isAuthenticated, upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    console.log('Upload received:', req.file.filename, 'from user:', req.session && req.session.user ? req.session.user.username : 'unknown');
    // Return URL path
    const url = '/uploads/' + path.basename(req.file.path);
    res.json({ url });
  } catch (e) {
    console.error('Upload error:', e);
    res.status(500).json({ error: 'Server error during upload' });
  }
});

app.post('/api/posts', isAuthenticated, (req, res) => {
  const { id, title, description, image, link, category } = req.body;
  const err = validatePostInput({ id, title, link, category });
  if (err) return res.status(400).json({ error: err });
  const db = readDB();
  if (db.posts.find(p=>p.id === id)) return res.status(400).json({ error: 'A post with this ID already exists. Use Update to modify it.' });
  db.posts.push({ id, title, description: description||'', image: image||'', link: link||'', category: category || 'uncategorized', created_at: Date.now() });
  writeDB(db);
  res.json({ ok: true });
});

app.put('/api/posts/:id', isAuthenticated, (req, res) => {
  const id = req.params.id;
  const { title, description, image, link, category } = req.body;
  const err = validatePostInput({ id, title, link, category });
  if (err) return res.status(400).json({ error: err });
  const db = readDB();
  const idx = db.posts.findIndex(p=>p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.posts[idx] = { ...db.posts[idx], title, description: description||'', image: image||'', link: link||'', category: category || db.posts[idx].category || 'uncategorized' };
  writeDB(db);
  res.json({ ok: true });
});

app.delete('/api/posts/:id', isAuthenticated, (req, res) => {
  const id = req.params.id;
  const db = readDB();
  const idx = db.posts.findIndex(p=>p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const row = db.posts[idx];
  // remove image file if local
  if (row.image && row.image.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, row.image);
    if (fs.existsSync(filePath)) try { fs.unlinkSync(filePath); } catch(e){}
  }
  db.posts.splice(idx,1);
  writeDB(db);
  res.json({ ok: true });
});

// Return current admin session (if any)
app.get('/api/me', (req, res) => {
  if (req.session && req.session.user) return res.json({ ok: true, username: req.session.user.username });
  return res.status(401).json({ error: 'Unauthorized' });
});

// Admin: fix missing categories in existing posts (sets category to 'uncategorized')
app.post('/api/migrate-categories', isAuthenticated, (req, res) => {
  const db = readDB();
  let changed = 0;
  db.posts = db.posts.map(p => {
    if (!p.category) { changed++; return { ...p, category: 'uncategorized' }; }
    return p;
  });
  if (changed > 0) writeDB(db);
  res.json({ ok: true, changed });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
