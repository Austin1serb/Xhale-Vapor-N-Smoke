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
        publicId:{
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    category: {
        type: String,
        // Vape, Cartridge, Gummy, etc.
        //required: [true, 'Please specify the type of product'],
        default: ["cbd"]
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
    reorderPoint: {
        type: Number,
        min: [0, 'Reorder point cannot be negative.'],
    },
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
    //isFeatured: {
    //    type: Boolean,
    //    default: false,
    //},
    //tags: {
    //    type: [String], // Array of product tags
    //},
    //images: {
    //    type: [String], // Array of product image URLs
    //},
    //relatedProducts: [
    //    {
    //        type: mongoose.Schema.Types.ObjectId,
    //        ref: 'Product',
    //    },
    //],
    //seo: {
    //    title: String,
    //    description: String,
    //    keywords: [String],
    //},
    //shipping: {
    //    weight: Number,
    //    dimensions: {
    //        length: Number,
    //        width: Number,
    //        height: Number,
    //    },
    //},
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
