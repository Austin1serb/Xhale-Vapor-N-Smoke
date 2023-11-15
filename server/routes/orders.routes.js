const OrdersController = require('../controllers/orders.controller')
const express = require("express");
const router = express.Router();

router.route("/test").get(OrdersController.test);
router.route('/').get(OrdersController.getAll);
router.route('/pageinate/').get(OrdersController.getAllPaginate);
router.route('/aggregate/').get(OrdersController.getAllAggregate);
router.route('/:id').get(OrdersController.getOne);
router.route('/create').post(OrdersController.createOne);
router.route('/:id').put(OrdersController.updateOne);
router.route('/:id').delete(OrdersController.deleteOne);

module.exports = router;