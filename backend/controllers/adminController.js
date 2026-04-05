// backend/controllers/adminController.js
const User = require('../models/User');

// @desc    Get all member accounts
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/status
const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.isActive = !user.isActive; // Flip the status
            const updatedUser = await user.save();
            res.json({ message: `User status changed to ${updatedUser.isActive ? 'Active' : 'Inactive'}`});
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers, toggleUserStatus };