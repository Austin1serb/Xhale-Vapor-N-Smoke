const mongoose = require('mongoose');
function arrayLimit(val) {
    return val.length > 0;
}
const ProductSchema = new mongoose.Schema({
    brand: {
        type: String,
        minlength: [2, 'Brand must be at least 2 characters long.'],
        maxlength: [60, 'Brand cannot be longer than 30 characters'],
        required: [true, 'Please add a Brand'],
    },
    totalSold: {
        type: Number,
        default: 0,
    },
    name: {
        type: String,
        minlength: [2, 'Name must be at least 2 characters long.'],
        maxlength: [60, 'Name cannot be longer than 60 characters'],
        required: [true, 'Please provide product name.'],
    },
    price: {
        type: Number,
        min: [0, 'Price cannot be negative.'],
        required: [true, 'Please provide product price.']
    },
    specs: {
        type: String,
        required: [true, 'Please provide product specs.']
    },
    imgSource: {
        type: [{
            publicId: {
                type: String,
                required: [true, 'Please provide product image id.']
            },
            url: {
                type: String,
                required: [true, 'Please provide product image url.']
            },
        }],
        validate: [arrayLimit, 'Product must have at least one image.']
    },
    category: {
        type: [String],
        required: true,
        validate: {
            validator: function (value) {
                return value.length > 0; // Custom validation function to check if the array is not empty
            },
            message: 'Please specify at least one category for the product',
        },
    },
    flavor: {
        type: String,
    },


    description: {
        type: String,
        minlength: [2, 'Description must be at least 2 characters long.'],
        maxlength: [560, 'Description cannot be longer than 560 characters.'],
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
        required: [true, 'Please provide product seo keywords.']

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
