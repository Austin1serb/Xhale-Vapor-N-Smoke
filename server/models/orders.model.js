const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Reference to the customer who placed the order
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Reference to the product in the order
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    orderDate: {
        type: Date,
        default: Date.now,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    shippingAddress: {
        street: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        zipCode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    noteFromCustomer: {
        type: String,
        required: false,
    }

    // Add other fields as needed
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
