const Guest = require('../models/guest.model');
const jwt = require('jsonwebtoken');


exports.createGuest = async (req, res) => {
    try {
        const guest = new Guest(req.body);
        await guest.save();
        res.status(201).json({ temporaryId: guest._id, ...guest.toObject() });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//update guest
exports.updateGuest = async (req, res) => {
    try {
        const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(guest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
//get all guests
exports.getAllGuests = async (req, res) => {
    try {
        const guests = await Guest.find();
        res.status(200).json(guests);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
//get guest by id
exports.getGuestById = async (req, res) => {
    try {
        const guest = await Guest.findById(req.params.id);
        res.status(200).json(guest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.deleteGuest = async (req, res) => {
    try {
        await Guest.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Guest deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Add other controller methods as needed
