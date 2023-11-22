// passwordReset.routes.js

const express = require('express');
const router = express.Router();
const passwordResetController = require('../controllers/passwordReset.controller'); // Adjust the path as needed

router.post('/forgot-password', passwordResetController.forgotPassword);
router.post('/reset-password', passwordResetController.resetPassword);

module.exports = router;
