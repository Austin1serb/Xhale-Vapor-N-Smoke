const OrderItemController = require('../controllers/orderItems.controller')
const express = require("express");
const router = express.Router();

router.route("/test").get(OrderItemController.test);
router.route('/').get(OrderItemController.getAll);
router.route('/:id').get(OrderItemController.getOne);
router.route('/').post(OrderItemController.createOne);
router.route('/:id').put(OrderItemController.updateOne);
router.route('/:id').delete(OrderItemController.deleteOne);

module.exports = router;