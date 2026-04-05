// backend/controllers/contactController.js
const Contact = require('../models/Contact');

// @desc    Submit contact form
// @route   POST /api/contact
const submitContact = async (req, res) => {
    try {
        const { ign, email, message } = req.body;
        const contact = await Contact.create({ ign, email, message });
        res.status(201).json({ message: 'Invite/Message sent successfully!', contact });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { submitContact };