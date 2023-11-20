const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guest.controller');

router.post('/', guestController.createGuest);
router.delete('/:id', guestController.deleteGuest);
router.get('/:id', guestController.getGuestById);
router.get('/', guestController.getAllGuests);
router.put('/:id', guestController.updateGuest);

// Add other routes as needed

module.exports = router;
