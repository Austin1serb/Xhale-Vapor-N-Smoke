const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guest.controller');
const { verifyToken, isAdmin } = require('../verifyToken'); // Import your verifyToken middleware


router.post('/', guestController.createGuest);

router.get('/:id', guestController.getGuestById);

router.put('/:id', guestController.updateGuest);

router.use(isAdmin);
router.get('/', guestController.getAllGuests);
router.delete('/:id', guestController.deleteGuest);

module.exports = router;
