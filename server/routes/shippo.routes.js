const express = require('express');
const router = express.Router();
const shippoController = require('../controllers/shippo.controller');

// Route that handles address creation
router.post('/', shippoController.createAddress);

module.exports = router;
