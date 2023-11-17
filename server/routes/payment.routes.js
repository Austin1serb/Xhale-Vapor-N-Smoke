const express = require('express');
const router = express.Router();
const squarePaymentController = require('../controllers/squarePayment.controller');

// Route to create a Square checkout session
router.post('/create-checkout-session', squarePaymentController.createCheckoutSession);
router.post('/process-payment', squarePaymentController.processPayment);
module.exports = router;
