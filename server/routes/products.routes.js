const ProductsController = require('../controllers/products.controller')
const express = require("express");
const router = express.Router();


router.route('/featured').get(ProductsController.getFeatured);



router.route("/test").get(ProductsController.test);
router.route('/paginate/').get(ProductsController.getAllPaginate);
router.route('/').get(ProductsController.getAll);
router.route('/:id').get(ProductsController.getOne);
router.route('/').post(ProductsController.createOne);
router.route('/:id').put(ProductsController.updateOne);
router.route('/:id').delete(ProductsController.deleteOne);

module.exports = router;