const PaymentController = require('../controllers/payments.controller')
const express = require("express");
const router = express.Router();

router.route("/test").get(PaymentController.test);
router.route('/').get(PaymentController.getAll);
router.route('/:id').get(PaymentController.getOne);
router.route('/').post(PaymentController.createOne);
router.route('/:id').put(PaymentController.updateOne);
router.route('/:id').delete(PaymentController.deleteOne);

module.exports = router;