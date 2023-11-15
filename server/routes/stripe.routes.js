const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripe.controller');


router.post('/create-checkout-session', stripeController.createCheckoutSession);
router.get('/verify-payment', stripeController.checkoutVerify)
module.exports = router;
