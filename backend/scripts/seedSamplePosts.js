/*
  Seed sample posts for demo
  Usage: node scripts/seedSamplePosts.js
*/
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Post = require('../models/Post');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
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
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
