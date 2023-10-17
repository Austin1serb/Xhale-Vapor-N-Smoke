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
        required: [true, 'Please provide product price.']
    },
    imgSource: {
        publicId: {
            type: String,
            required: [true, 'Please provide product image.']
        },
        url: {
            type: String,
            required: [true, 'Please provide product image.']
        },

    },
    category: {
        type: [String], // Use an array of strings to support multiple categories
        required: [true, 'Please specify the type of product'],
    },

    description: {
        type: String,
        minlength: [2, 'Description must be at least 2 characters long.'],
        maxlength: [750, 'Description cannot be longer than 750 characters.'],
    },
    strength: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, 'Please select product strength.'],
    },

    //inventory: {
    //    type: Number,
    //    min: [0, 'Inventory cannot be negative.'],
    //},
    //reorderPoint: {
    //    type: Number,
    //    min: [0, 'Reorder point cannot be negative.'],
    //},
    //reviews: [
    //    {
    //        user: {
    //            type: mongoose.Schema.Types.ObjectId,
    //            ref: 'User', // You can create a User model for reviews
    //        },
    //        text: {
    //            type: String,

    //        },
    //        rating: {
    //            type: Number,
    //            min: [1, 'Minimum rating is 1'],
    //            max: [5, 'Maximum rating is 5'],
    //        },
    //        createdAt: {
    //            type: Date,
    //            default: Date.now,
    //        },
    //    },
    //],
    isFeatured: {
        type: Boolean,
        default: false,
    },


    //relatedProducts: [
    //    {
    //        type: mongoose.Schema.Types.ObjectId,
    //        ref: 'Product',
    //    },
    //],
    seo: {
        title: String,
        description: String,
    },
    seoKeywords: {
        type: [String],
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
