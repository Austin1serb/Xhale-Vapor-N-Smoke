const mongoose = require('mongoose')
const ProductsSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [2, "Name must be at least 2 characters long."],
        required: [true, "Please provide product name."]
    },
    price: {
        type: Number,
        min: [0, "Price cannot be negative."],
        required: [true, "Please provide product price."],
        // values are stored as cents in DB, but sent out as dollar values.
        get: v => (v/100).toFixed(2),
        set: v => v*100
    },
    imgSource: {
        type: String,
    },
    type: {
        type: String,
        // Vape, Catridge, Gummy, etc.
        required: [true, "Please specify the type of product"]
    },
    description: {
        type: String,
        minlength: [2, "Description must be at least 2 character long."],
        maxlength: [750, "Description cannot be longer than 750 characters."]
    },
    size: {
        type: Number,
        min: [0, "Size cannot be negative."],
        required: [true, "Please provide product size in mg"]
    }
}, {timestamps:true})
const Products = mongoose.model("Product", ProductsSchema)
module.exports = Products;