// CRUD controller for posts with Cloudinary upload support
const Post = require('../models/Post');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

async function uploadToCloudinary(filePath) {
  const res = await cloudinary.uploader.upload(filePath, { folder: 'affiliate_posts' });
  return { url: res.secure_url, public_id: res.public_id };
}

exports.createPost = async (req, res) => {
  try {
    const { title, description, categories, affiliateLink } = req.body;
    let imageUrl = req.body.image || null;
    let imagePublicId = null;

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.path);
      imageUrl = uploaded.url;
      imagePublicId = uploaded.public_id;
      // remove temp file
      fs.unlink(req.file.path, () => {});
    }

    const post = await Post.create({
      title,
      description,
      categories: categories ? (Array.isArray(categories) ? categories : categories.split(',').map(s => s.trim())) : [],
      affiliateLink,
      image: imageUrl,
      imagePublicId,
      author: req.user.id
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const { q, category } = req.query;
    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (category) filter.categories = category;
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    // cache for 10 minutes
    res.set('Cache-Control', 'public, max-age=600');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ message: 'Not found' });
    // cache individual post for 10 minutes
    res.set('Cache-Control', 'public, max-age=600');
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });

    const { title, description, categories, affiliateLink } = req.body;
    if (title) post.title = title;
    if (description) post.description = description;
    if (categories) post.categories = Array.isArray(categories) ? categories : categories.split(',').map(s => s.trim());
    if (affiliateLink) post.affiliateLink = affiliateLink;

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.path);
      post.image = uploaded.url;
      post.imagePublicId = uploaded.public_id;
      fs.unlink(req.file.path, () => {});
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    await post.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
