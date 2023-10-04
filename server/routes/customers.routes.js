const CustomersController = require('../controllers/customers.controller')
const express = require("express");
const router = express.Router();

router.route("/test").get(CustomersController.test);
router.route('/').get(CustomersController.getAll);
router.route('/:id').get(CustomersController.getOne);
router.route('/').post(CustomersController.createOne);
router.route('/:id').put(CustomersController.updateOne);
router.route('/:id').delete(CustomersController.deleteOne);

module.exports = router;