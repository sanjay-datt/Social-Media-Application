const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET /api/users/search/users?q=query  (must be before /:id)
router.get('/search/users', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const users = await User.find(
      { username: { $regex: q, $options: 'i' } },
      'id username profilePicture'
    ).limit(10);
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/:id
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'You can only update your own profile' });
    }

    const { username, bio, city, from, profilePicture, coverPicture, password } = req.body;
    const updates = {};
    if (username !== undefined) updates.username = username;
    if (bio !== undefined) updates.bio = bio;
    if (city !== undefined) updates.city = city;
    if (from !== undefined) updates.from = from;
    if (profilePicture !== undefined) updates.profilePicture = profilePicture;
    if (coverPicture !== undefined) updates.coverPicture = coverPicture;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const updated = await User.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true }).select('-password');
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/:id/follow
router.put('/:id/follow', auth, async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const currentUser = await User.findById(req.user.id);
    const isFollowing = targetUser.followers.includes(req.user.id);

    if (isFollowing) {
      await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user.id } });
      await User.findByIdAndUpdate(req.user.id, { $pull: { following: req.params.id } });
      return res.json({ message: 'Unfollowed successfully' });
    } else {
      await User.findByIdAndUpdate(req.params.id, { $push: { followers: req.user.id } });
      await User.findByIdAndUpdate(req.user.id, { $push: { following: req.params.id } });
      return res.json({ message: 'Followed successfully' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/users/:id/followers
router.get('/:id/followers', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', 'id username profilePicture');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user.followers);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/users/:id/following
router.get('/:id/following', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('following', 'id username profilePicture');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user.following);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
