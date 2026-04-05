const express = require('express');
const router = express.Router();
const Invite = require('../models/inviteModel');

// @desc    Create a new party invite
// @route   POST /api/invites
router.post('/', async (req, res) => {
    try {
        const { ign, email, message } = req.body;

        const invite = await Invite.create({
            ign,
            email,
            message
        });

        res.status(201).json(invite); 
    } catch (error) {
        // ADD THIS LINE TO REVEAL THE TRUE ERROR:
        console.error("INVITE POST ERROR:", error);
        res.status(400).json({ message: 'Failed to send invite', error: error.message });
    }
});

module.exports = router;