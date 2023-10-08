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
    type: {
        type: String,
        // Vape, Cartridge, Gummy, etc.
        required: [true, 'Please specify the type of product'],
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
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // You can create a separate Category model
    },
    inventory: {
        type: Number,
        min: [0, 'Inventory cannot be negative.'],
    },
    ingredients: {
        type: [String], // Array of ingredient names
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // You can create a User model for reviews
            },
            text: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                min: [1, 'Minimum rating is 1'],
                max: [5, 'Maximum rating is 5'],
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    discounts: [
        {
            code: {
                type: String,
                unique: true,
            },
            percentage: {
                type: Number,
                min: [0, 'Discount percentage cannot be negative.'],
                max: [100, 'Discount percentage cannot exceed 100%.'],
            },
        },
    ],
    isFeatured: {
        type: Boolean,
        default: false,
    },
    tags: {
        type: [String], // Array of product tags
    },
    variants: [
        {
            sku: {
                type: String,
                unique: true,
            },
            price: {
                type: Number,
                min: [0, 'Price cannot be negative.'],
                required: true,
            },
            size: {
                type: Number,
                min: [0, 'Size cannot be negative.'],
                required: true,
            },
        },
    ],
    images: {
        type: [String], // Array of product image URLs
    },
    relatedProducts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
    ],
    seo: {
        title: String,
        description: String,
        keywords: [String],
    },
    shipping: {
        weight: Number,
        dimensions: {
            length: Number,
            width: Number,
            height: Number,
        },
    },
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
