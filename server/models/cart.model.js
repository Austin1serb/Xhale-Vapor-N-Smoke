const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Reference to the Customer model
        required: [true, 'User is required for the cart.'],
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Reference to the Product model
                required: [true, 'Product is required for the cart item.'],
            },
            quantity: {
                type: Number,
                default: 1, // Default quantity
            },
        },
    ],
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
