const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true, // Ensure the order number is unique
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            price: {  // Price at the time of order
                type: Number,
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


    // Payment Information
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        required: true,
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: false  // Not all payment methods may provide a transaction ID
    },

    // Audit Fields
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, { timestamps: true });  // This option adds `createdAt` and `updatedAt` fields

// Pre-save hook for data integrity
OrderSchema.pre('save', async function (next) {
    // Example: Ensure the totalAmount is the sum of products' price * quantity
    if (this.isModified('products')) {
        let total = 0;
        for (const item of this.products) {
            const product = await mongoose.model('Product').findById(item.product);
            total += item.quantity * product.price;
        }
        this.totalAmount = total;
    }
    next();
});

// Indexing
OrderSchema.index({ orderNumber: 1 });  // Assuming orderNumber should be unique and often queried
OrderSchema.index({ customer: 1 });     // Indexing on customer ID for quicker look-up
OrderSchema.index({ orderDate: -1 });   // Indexing on orderDate if sorting by date is common

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
