const ProductsController = require('../controllers/products.controller')
const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require('../verifyToken'); // Import your verifyToken middleware

router.route('/').get(ProductsController.getAll);
router.get('/search/', ProductsController.searchProducts);
router.route('/featured').get(ProductsController.getFeatured);
router.route('/bestsellers').get(ProductsController.getBestSellers);
router.route('/paginate/').get(ProductsController.getAllPaginate);

router.route('/:id').get(ProductsController.getOne);

//router.use(isAdmin, verifyToken);
router.route('/').post(ProductsController.createOne);
router.route('/:id').put(ProductsController.updateOne);
router.route('/:id').delete(ProductsController.deleteOne);

module.exports = router;