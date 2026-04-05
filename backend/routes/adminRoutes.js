// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Post = require('../models/Post');
const Invite = require('../models/inviteModel');

// @route   GET /api/admin/users
// @desc    Get all users (Admin only)
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password'); // Hide passwords!
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

// @route   GET /api/admin/invites
// @desc    Get all contact form submissions (Admin only)
router.get('/invites', protect, admin, async (req, res) => {
    try {
        const invites = await Invite.find({}).sort({ createdAt: -1 });
        res.json(invites);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch invites' });
    }
});

// @route   DELETE /api/admin/posts/:id
// @desc    Delete ANY post (Admin only)
router.delete('/posts/:id', protect, admin, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        
        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete post' });
    }
});

// @route   DELETE /api/admin/comments/:postId/:commentId
// @desc    Delete ANY comment on a post (Admin only)
router.delete('/comments/:postId/:commentId', protect, admin, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Filter out the comment we want to delete
        post.comments = post.comments.filter(
            (c) => c._id.toString() !== req.params.commentId
        );
        
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete comment' });
    }
});

module.exports = router;