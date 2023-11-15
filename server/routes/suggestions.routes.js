
const autocompleteController = require('../controllers/autocomplete.controller');
const express = require("express");
const router = express.Router();

router.route('/suggestions').get(autocompleteController.getAutocompleteSuggestions);
module.exports = router;