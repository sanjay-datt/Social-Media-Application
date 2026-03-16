const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route  GET /api/posts/feed
router.get('/feed', protect, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const feedUsers = [...currentUser.following, req.user._id];

    const posts = await Post.find({ user: { $in: feedUsers } })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('user', 'username fullName profilePicture')
      .populate('comments.user', 'username fullName profilePicture');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route  GET /api/posts/user/:userId
router.get('/user/:userId', protect, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('user', 'username fullName profilePicture')
      .populate('comments.user', 'username fullName profilePicture');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route  GET /api/posts/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username fullName profilePicture')
      .populate('comments.user', 'username fullName profilePicture');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route  POST /api/posts
router.post(
  '/',
  protect,
  [
    body('content')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Content cannot exceed 2000 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { content, image } = req.body;

    if (!content && !image) {
      return res.status(400).json({ message: 'Post must have content or an image' });
    }

    try {
      const post = await Post.create({
        user: req.user._id,
        content,
        image: image || '',
      });

      const populatedPost = await Post.findById(post._id)
        .populate('user', 'username fullName profilePicture')
        .populate('comments.user', 'username fullName profilePicture');

      res.status(201).json(populatedPost);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route  PUT /api/posts/:id
router.put(
  '/:id',
  protect,
  [
    body('content')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Content cannot exceed 2000 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });

      if (post.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to edit this post' });
      }

      const { content, image } = req.body;
      if (content !== undefined) post.content = content;
      if (image !== undefined) post.image = image;

      await post.save();

      const updatedPost = await Post.findById(post._id)
        .populate('user', 'username fullName profilePicture')
        .populate('comments.user', 'username fullName profilePicture');

      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route  DELETE /api/posts/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route  POST /api/posts/:id/like
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ likes: post.likes, isLiked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route  POST /api/posts/:id/comment
router.post(
  '/:id/comment',
  protect,
  [body('text').trim().notEmpty().withMessage('Comment cannot be empty').isLength({ max: 500 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });

      post.comments.push({ user: req.user._id, text: req.body.text });
      await post.save();

      const updatedPost = await Post.findById(post._id)
        .populate('user', 'username fullName profilePicture')
        .populate('comments.user', 'username fullName profilePicture');

      res.status(201).json(updatedPost.comments[updatedPost.comments.length - 1]);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route  DELETE /api/posts/:id/comment/:commentId
router.delete('/:id/comment/:commentId', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (
      comment.user.toString() !== req.user._id.toString() &&
      post.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.deleteOne();
    await post.save();

    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
