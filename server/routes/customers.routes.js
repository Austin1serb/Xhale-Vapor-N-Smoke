// customers.routes.js
const CustomersController = require('../controllers/customers.controller');
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const verifyToken = require('../verifyToken'); // Import your verifyToken middleware
const rateLimit = require('express-rate-limit');

// Configure rate limiting for the registration route
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 10, // start blocking after 5 requests
    message: "Too many accounts created from this IP, please try again after an hour"
});



// This route does not require authentication
// Apply the rate limiter to the registration route
//router.post('/register', registerLimiter, CustomersController.createOne);

router.post('/register', CustomersController.createOne);

router.route('/login').post(CustomersController.loginUser);
router.route('/logout').post(CustomersController.logoutUser);
router.route('/refresh').post(CustomersController.refreshToken);

// Routes below require authentication
//router.use(verifyToken); // Apply verifyToken middleware to routes below

router.route('/').get(CustomersController.getAll);
router.route('/:id').get(CustomersController.getOne);
router.route('/test').get(CustomersController.test);
router.route('/:id').put(CustomersController.updateOne);
router.route('/:id').delete(CustomersController.deleteOne);

module.exports = router;
