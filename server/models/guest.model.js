const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
    email: String,
    firstName: String,
    lastName: String,
    address: String,
    address2: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    phone: String,
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        },
    ],

}, { timestamps: true });;

module.exports = mongoose.model('Guest', GuestSchema);
