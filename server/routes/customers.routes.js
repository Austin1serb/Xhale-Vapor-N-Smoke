// customers.routes.js
const CustomersController = require('../controllers/customers.controller');
const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require('../verifyToken'); // Import your verifyToken middleware
const rateLimit = require('express-rate-limit');

//  Rate limiting for the registration route
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 10, // start blocking after 10 requests
    message: "Too many accounts created from this IP, please try again after an hour"
});

const tokenRefreshLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 15, // Allow 15 refresh requests per hour per IP
    message: "Too many refresh token requests from this IP, please try again after an hour"
});



// Admin route
router.route('/admin', verifyToken, isAdmin, (req, res) => {
    // Handle the request
    res.json({ message: 'Welcome to the Admin Dashboard' });
});


// These route does not require authentication
// Apply the rate limiter to the registration route
//router.post('/register', registerLimiter, CustomersController.createOne);
router.route('/test').get(CustomersController.test);
router.post('/register', tokenRefreshLimiter, CustomersController.createOne);

router.route('/login').post(CustomersController.loginUser);
router.route('/logout').post(CustomersController.logoutUser);
router.route('/refresh').post(CustomersController.refreshToken);

// Routes below require authentication
router.use(verifyToken); // Apply verifyToken middleware to routes below
router.route('/:id').get(CustomersController.getOne);
router.route('/:id').put(CustomersController.updateOne);
router.route('/:id').delete(CustomersController.deleteOne);
router.use(isAdmin);
router.route('/').get(CustomersController.getAll);




module.exports = router;
