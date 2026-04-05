// backend/controllers/postController.js
const Post = require('../models/Post');

// @desc    Get all posts (Community Feed)
// @route   GET /api/posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }); // Newest first
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new post
// @route   POST /api/posts
const createPost = async (req, res) => {
    try {
        // 1. Make sure to extract teamName from req.body!
        const { teamName, hero, role, kda, result } = req.body;

        // Validation (Optional but good practice)
        if (!teamName || !hero || !role || !kda || !result) {
            return res.status(400).json({ message: 'Please add all text fields' });
        }

        // 2. Pass teamName into the Post creation
        const post = await Post.create({
            author: req.user.id, // Comes from your auth middleware
            teamName,            // Add this line!
            hero,
            role,
            kda,
            result
        });

        // 3. We also need to populate the author's ign before sending it back 
        // so the frontend instantly shows the IGN on the new post!
        const populatedPost = await post.populate('author', 'ign');

        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Check if the user is the author OR an Admin
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(401).json({ message: 'User not authorized to delete this post' });
        }

        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPosts, createPost, deletePost };