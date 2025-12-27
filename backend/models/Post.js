const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String },
  categories: [{ type: String }],
  image: { type: String }, // stored as Cloudinary URL
  imagePublicId: { type: String }, // cloudinary public id for transformations
  affiliateLink: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

postSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

postSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
