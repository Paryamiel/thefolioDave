const mongoose = require('mongoose');

const inviteSchema = mongoose.Schema({
    ign: {
        type: String,
        required: [true, 'Please add an IGN'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
    },
    message: {
        type: String,
        required: [true, 'Please add a message'],
    },
}, {
    timestamps: true, // This automatically logs exactly when they s ent the invite!
});

module.exports = mongoose.model('Invite', inviteSchema);