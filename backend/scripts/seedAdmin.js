/*
  Script to seed single admin user.
  Usage: set ADMIN_EMAIL and ADMIN_PASSWORD in .env or provide env when running:
    ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=secret node scripts/seedAdmin.js
*/

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/User');

async function seed() {
  if (!process.env.MONGO_URI) return console.error('Set MONGO_URI in .env');
  await mongoose.connect(process.env.MONGO_URI);
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const pwd = process.env.ADMIN_PASSWORD || 'changeme123';

  let admin = await User.findOne({ email });
  if (admin) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }

  admin = new User({ name: 'Admin', email, password: pwd, role: 'admin' });
  await admin.save();
  console.log('Admin created:', email, 'with password from .env or default');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
