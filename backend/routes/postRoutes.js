// backend/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const { getPosts, createPost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// Make sure this perfectly matches the name of the file in your models folder!
// If your file is named Post.js, change this back to '../models/Post'
const Post = require('../models/Post'); 

// Anyone can GET posts, but you must be logged in (protect) to POST or DELETE
router.route('/').get(getPosts).post(protect, createPost);
router.route('/:id').delete(protect, deletePost);

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
router.post('/:id/comments', protect, async (req, res) => {
    try {
        const { text, ign } = req.body;
        
        // Find the specific post by the ID in the URL
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Create the new comment object
        const newComment = {
            ign: ign, // The IGN of the logged-in user
            text: text
        };

        // Push it into the post's comments array and save
        post.comments.push(newComment);
        await post.save();

        // Send back the updated post
        res.status(201).json(post);
    } catch (error) {
        console.error("COMMENT ERROR:", error);
        res.status(500).json({ message: 'Failed to add comment', error: error.message });
    }
});

module.exports = router;