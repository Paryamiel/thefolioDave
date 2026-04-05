// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - requires a valid JWT token
const protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Format: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token payload and attach it to req.user (excluding password)
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// --- ADD THIS NEW ADMIN FUNCTION ---
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next(); // They are an admin, let them pass!
    } else {
        res.status(401).json({ message: 'Not authorized as an Admin' });
    }
};

module.exports = { protect, admin };