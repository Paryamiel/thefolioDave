// backend/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate a JWT token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// backend/controllers/authController.js (Update just the registerUser function)

// @desc    Register a new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
    try {
        // 1. Extract ALL fields from the frontend request
        const { teamName, ign, email, password, dob, level, terms } = req.body;

        // 2. Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { ign }] });
        if (userExists) {
            return res.status(400).json({ message: 'User (Email or IGN) already exists' });
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create user with ALL fields
        const user = await User.create({
            teamName,
            ign,
            email,
            password: hashedPassword,
            dob,
            level,
            terms
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                teamName: user.teamName, // <--- ADD THIS LINE
                ign: user.ign,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user (Login)
// @route   POST /api/users/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const user = await User.findOne({ email });

        // 2. Check if user is active (from Phase 2 Admin requirements)
        if (user && !user.isActive) {
            return res.status(401).json({ message: 'Account deactivated. Contact Admin.' });
        }

        // 3. Check password
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                teamName: user.teamName, // <--- ADD THIS LINE
                ign: user.ign,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile (IGN)
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            // Update the IGN, or keep it the same if they didn't provide one
            user.ign = req.body.ign || user.ign;

            const updatedUser = await user.save();

            // Send back the fresh user info with the updated IGN
            res.json({
                _id: updatedUser.id,
                teamName: updatedUser.teamName,
                ign: updatedUser.ign,
                email: updatedUser.email,
                role: updatedUser.role,
                token: generateToken(updatedUser._id, updatedUser.role),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile };