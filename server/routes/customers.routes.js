// customers.routes.js
const CustomersController = require('../controllers/customers.controller');
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const verifyToken = require('../verifyToken'); // Import your verifyToken middleware


// This route does not require authentication
router.route('/register').post(CustomersController.createOne);
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
