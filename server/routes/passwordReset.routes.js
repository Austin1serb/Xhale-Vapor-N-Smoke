// passwordReset.routes.js

const express = require('express');
const router = express.Router();
const passwordResetController = require('../controllers/passwordReset.controller'); // Adjust the path as needed
const rateLimit = require('express-rate-limit');

//  Rate limiting for the registration route
const resetLimiter = rateLimit({
    windowMs: 60 * 59 * 1000, // 1 hour window
    max: 10, // start blocking after 10 requests
    message: "Too many resets have been attempted from this IP, please try again after an hour"
});


router.post('/forgot-password', resetLimiter, passwordResetController.forgotPassword);
router.post('/reset-password', passwordResetController.resetPassword);

module.exports = router;
