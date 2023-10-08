const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: [true, 'Please add a Brand'],
    },
    name: {
        type: String,
        minlength: [2, 'Name must be at least 2 characters long.'],
        required: [true, 'Please provide product name.'],
    },
    price: {
        type: Number,
        min: [0, 'Price cannot be negative.'],
        required: [true, 'Please provide product price.'],
        // values are stored as cents in DB, but sent out as dollar values.
        get: (v) => (v / 100).toFixed(2),
        set: (v) => v * 100,
    },
    imgSource: {
        type: String,
    },
    category: {
        type: String,
        // Vape, Cartridge, Gummy, etc.
        //required: [true, 'Please specify the type of product'],
    },
    description: {
        type: String,
        minlength: [2, 'Description must be at least 2 characters long.'],
        maxlength: [750, 'Description cannot be longer than 750 characters.'],
    },
    strength: {
        type: Number,
        min: [0, 'strength cannot be negative.'],
        required: [true, 'Please provide product strength in mg'],
    },
    inventory: {
        type: Number,
        min: [0, 'Inventory cannot be negative.'],
    },

}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
