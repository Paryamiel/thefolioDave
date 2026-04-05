// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    teamName: { type: String, required: true },
    ign: { type: String, required: true, unique: true }, // Captain IGN
    email: { type: String, required: true, unique: true }, // Needed for login
    password: { type: String, required: true },
    dob: { type: String, required: true },
    level: { type: String, required: true },
    terms: { type: Boolean, required: true },
    role: { type: String, enum: ['Guest', 'Member', 'Admin'], default: 'Member' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);