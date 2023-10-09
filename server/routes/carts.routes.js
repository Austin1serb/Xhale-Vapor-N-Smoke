const CartController = require('../controllers/carts.controller')
const express = require("express");
const router = express.Router();

router.route("/test").get(CartController.test);
router.route('/').get(CartController.getAll);
router.route('/:id').get(CartController.getOne);
router.route('/').post(CartController.createOne);
router.route('/:id').put(CartController.updateOne);
router.route('/:id').delete(CartController.deleteOne);

module.exports = router;