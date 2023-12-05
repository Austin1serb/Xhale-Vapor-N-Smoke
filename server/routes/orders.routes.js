const OrdersController = require('../controllers/orders.controller')
const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require('../verifyToken'); // Import your verifyToken middleware

router.route("/test").get(OrdersController.test);
router.route('/create').post(OrdersController.createOne);


//router.use(isAdmin, verifyToken);
router.route("/best-sellers-six-months").get(OrdersController.getAmountSoldPerMonthLast6Months);
router.route("/best-sellers").get(OrdersController.getTopSellingProducts);
router.route('/').get(OrdersController.getAll);
router.route('/pageinate/').get(OrdersController.getAllPaginate);
router.route('/aggregate/').get(OrdersController.getAllAggregate);
router.route('/:id').get(OrdersController.getOne);
router.route('/:id').put(OrdersController.updateOne);
router.route('/:id').delete(OrdersController.deleteOne);

module.exports = router;