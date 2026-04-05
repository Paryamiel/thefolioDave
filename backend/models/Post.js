// backend/models/Post.js
const mongoose = require('mongoose');

// 1. Create a mini-schema just for comments
const commentSchema = mongoose.Schema({
    ign: { type: String, required: true }, // Who commented
    text: { type: String, required: true } // What they said
}, { timestamps: true });

const postSchema = new mongoose.Schema({
    // 1. The Reference back to the User (This makes .populate('author', 'ign') work!)
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    // 2. The new Auto-filled Team Name
    teamName: {
        type: String,
        required: true
    },
    // 3. The Match Details
    hero: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    kda: {
        type: String,
        required: true
    },
    result: {
        type: String,
        required: true,
        enum: ['Victory', 'Defeat'] // Forces the database to only accept these two exact words
    },

    comments: [commentSchema],
}, { 
    timestamps: true // Automatically adds `createdAt` and `updatedAt` dates!
});

module.exports = mongoose.model('Post', postSchema);