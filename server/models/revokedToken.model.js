const mongoose = require('mongoose');

const revokedTokenSchema = new mongoose.Schema({
    token: String,  // Store the refresh token
    userId: String, // Optional: associate the revoked token with a user
    createdAt: { type: Date, expires: '7d', default: Date.now }, // Automatically expire tokens after 7 days
});

module.exports = mongoose.model('RevokedToken', revokedTokenSchema);
