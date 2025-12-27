const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.createComment = async (req, res) => {
  try {
    const { postId, text, rating } = req.body;
    if (!postId || !text || !rating) return res.status(400).json({ message: 'Missing fields' });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.create({ user: req.user.id, post: postId, text, rating });

    // Recalculate post rating
    const agg = await Comment.aggregate([
      { $match: { post: post._id } },
      { $group: { _id: '$post', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    if (agg.length) {
      post.rating = Math.round(agg[0].avgRating * 10) / 10; // one decimal
      post.reviewsCount = agg[0].count;
      await post.save();
    }

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId }).populate('user', 'name');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
