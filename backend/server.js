/*
  Basic Express server with MongoDB connection.
  This is a starter server — more routes and middleware will be added.
*/

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

dotenv.config();

const compression = require('compression');
const app = express();
app.use(helmet());
app.use(compression());

// CORS whitelist (supports comma-separated CLIENT_URLS env var)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000').split(',');
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS policy: origin not allowed'));
  }
}));

// Body parsing + sanitization
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());

// Basic rate limiter for APIs
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', apiLimiter);

// Simple root route
app.get('/', (req, res) => {
  res.json({ message: 'Amazon Affiliate Backend API' });
});

// Mount routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const newsletterRoutes = require('./routes/newsletter');
const recaptchaController = require('./controllers/recaptchaController');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/newsletter', newsletterRoutes);

// reCAPTCHA verification endpoint
app.post('/api/recaptcha/verify', async (req, res) => {
  return recaptchaController.verify(req, res);
});

// robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send("User-agent: *\nDisallow:");
});

// sitemap — generate simple sitemap of posts
app.get('/sitemap.xml', async (req, res) => {
  try {
    const Post = require('./models/Post');
    const posts = await Post.find().select('slug updatedAt createdAt');
    const base = process.env.CLIENT_URL || 'http://localhost:3000';
    const urls = posts.map(p => `  <url>\n    <loc>${base}/product/${p.slug}</loc>\n    <lastmod>${(p.updatedAt || p.createdAt).toISOString()}</lastmod>\n  </url>`).join('\n');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
    res.type('application/xml');
    res.send(xml);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to generate sitemap');
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

// Connect to MongoDB then start server
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    // Support test mode with in-memory MongoDB when MONGO_URI is not provided
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      // Use mongodb-memory-server for local test mode
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log('Using in-memory MongoDB for test mode');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');

    // When running in-memory, seed an admin user and sample posts for convenience
    if (!process.env.MONGO_URI) {
      try {
        const User = require('./models/User');
        const Post = require('./models/Post');
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        const adminPwd = process.env.ADMIN_PASSWORD || 'changeme123';

        let admin = await User.findOne({ email: adminEmail });
        if (!admin) {
          admin = new User({ name: 'Admin', email: adminEmail, password: adminPwd, role: 'admin' });
          await admin.save();
          console.log('Seed admin created:', adminEmail, adminPwd);
        } else {
          console.log('Admin exists:', adminEmail);
        }

        const samples = [
          {
            title: 'Sample Wireless Earbuds - Great Sound',
            description: 'Compact and powerful wireless earbuds with noise cancellation.',
            categories: ['audio', 'gadgets'],
            affiliateLink: 'https://amzn.to/EXAMPLE1'
          },
          {
            title: 'Portable Power Bank 20000mAh',
            description: 'High capacity power bank with fast charging.',
            categories: ['accessories'],
            affiliateLink: 'https://amzn.to/EXAMPLE2'
          }
        ];

        for (const s of samples) {
          const exists = await Post.findOne({ title: s.title });
          if (!exists) await Post.create(s);
        }
        console.log('Sample posts seeded');
      } catch (seedErr) {
        console.error('Seeding failed:', seedErr.message);
      }
    }

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
