const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth');

// POST /api/posts
router.post('/', auth, async (req, res) => {
  try {
    const { desc, img } = req.body;
    const post = await Post.create({ userId: req.user.id, desc, img: img || '' });
    const populated = await post.populate('userId', 'username profilePicture');
    return res.status(201).json(populated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/posts/timeline
router.get('/timeline', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const posts = await Post.find({
      userId: { $in: [req.user.id, ...currentUser.following] },
    })
      .sort({ createdAt: -1 })
      .populate('userId', 'username profilePicture')
      .populate('comments.userId', 'username profilePicture');
    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/posts/user/:userId
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'username profilePicture')
      .populate('comments.userId', 'username profilePicture');
    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/posts/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('userId', 'username profilePicture')
      .populate('comments.userId', 'username profilePicture');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    return res.json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// PUT /api/posts/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own posts' });
    }
    const { desc, img } = req.body;
    if (desc !== undefined) post.desc = desc;
    if (img !== undefined) post.img = img;
    await post.save();
    return res.json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// DELETE /api/posts/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }
    await post.deleteOne();
    return res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// PUT /api/posts/:id/like
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.includes(req.user.id);
    if (alreadyLiked) {
      post.likes = post.likes.filter((uid) => uid.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();
    return res.json({ likes: post.likes, liked: !alreadyLiked });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST /api/posts/:id/comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ userId: req.user.id, text });
    await post.save();
    await post.populate('comments.userId', 'username profilePicture');
    return res.status(201).json(post.comments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// DELETE /api/posts/:postId/comment/:commentId
router.delete('/:postId/comment/:commentId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const isCommentOwner = comment.userId.toString() === req.user.id;
    const isPostOwner = post.userId.toString() === req.user.id;
    if (!isCommentOwner && !isPostOwner) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.deleteOne();
    await post.save();
    return res.json({ message: 'Comment deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
