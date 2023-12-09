const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../controllers/contact.controller');
const rateLimit = require('express-rate-limit');

//  Rate limiting for the registration route
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // start blocking after 5 requests
    message: "Too many messages created from this IP, please try again after an hour"
});




router.post('/', contactLimiter, sendContactEmail);

module.exports = router;
