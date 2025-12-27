const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const postController = require('../controllers/postController');

// Public: list with search & category filter
router.get('/', postController.getPosts);
// Public: get by slug
router.get('/:slug', postController.getPostBySlug);

// Admin: create (supports image upload)
router.post('/', protect, adminOnly,
  upload.single('image'),
  body('title').notEmpty(),
  body('affiliateLink').isURL().withMessage('Affiliate link must be a URL'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  postController.createPost
);

// Admin: update
router.put('/:id', protect, adminOnly, upload.single('image'), postController.updatePost);
// Admin: delete
router.delete('/:id', protect, adminOnly, postController.deletePost);

module.exports = router;
