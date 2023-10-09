const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order', // Reference to the Order model
        required: [true, 'Order is required for the order item.'],
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
        required: [true, 'Product is required for the order item.'],
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required for the order item.'],
        min: [1, 'Quantity must be at least 1.'],
    },
});

const OrderItem = mongoose.model('OrderItem', OrderItemSchema);

module.exports = OrderItem;
