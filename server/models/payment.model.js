const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order', // Reference to the Order model
        required: [true, 'Order is required for the payment.'],
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required.'],
    },
    transactionId: {
        type: String,
        required: [true, 'Transaction ID is required.'],
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required.'],
        min: [0, 'Amount cannot be negative.'],
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
