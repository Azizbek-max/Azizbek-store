const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const { commentLimiter } = require('../middleware/rateLimiters');
const commentController = require('../controllers/commentController');

// Get comments for a post
router.get('/post/:postId', commentController.getCommentsByPost);
// Add comment (authenticated users only)
router.post('/', commentLimiter, protect,
  body('postId').notEmpty().withMessage('postId required'),
  body('text').isLength({ min: 3 }).withMessage('Comment too short'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating 1-5'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    return commentController.createComment(req, res);
  }
);

module.exports = router;
