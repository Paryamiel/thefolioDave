// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();

const { registerUser, loginUser, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // make sure this is imported

router.post('/register', registerUser);
router.post('/login', loginUser);

router.put('/profile', protect, updateUserProfile);

module.exports = router;