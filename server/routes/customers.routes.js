const CustomersController = require('../controllers/customers.controller');
const express = require("express");
const router = express.Router();
const verifyToken = require('../verifyToken'); // Import your verifyToken middleware
const jwt = require('jsonwebtoken');

// This route does not require authentication
router.route('/register').post(CustomersController.createOne);

// This route does not require authentication
router.route('/login').post(CustomersController.loginUser);

// Routes below require authentication
//router.use(verifyToken); // Apply verifyToken middleware to all routes below

router.route('/').get(CustomersController.getAll);
router.route('/:id').get(CustomersController.getOne);
router.route('/test').get(CustomersController.test);
router.route('/:id').put(CustomersController.updateOne);
router.route('/:id').delete(CustomersController.deleteOne);

module.exports = router;
