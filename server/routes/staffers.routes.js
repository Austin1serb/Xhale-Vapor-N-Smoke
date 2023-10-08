const StaffersController = require('../controllers/staffers.controller')
const express = require("express");
const router = express.Router();

router.route("/test").get(StaffersController.test);
router.route('/').get(StaffersController.getAll);
router.route('/:id').get(StaffersController.getOne);
router.route('/').post(StaffersController.createOne);
router.route('/:id').put(StaffersController.updateOne);
router.route('/:id').delete(StaffersController.deleteOne);

module.exports = router;