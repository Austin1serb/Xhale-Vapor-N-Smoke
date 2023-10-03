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
        required: [true, "Please provide product price."]
    },
    imgSource: {
        type: String,
    },
    description: {
        type: String,
        minlength: [2, "Description must be at least 2 character long."],
        maxlength: [750, "Description cannot be longer than 750 characters."]
    }
}, {timestamps:true})
const Products = mongoose.model("Product", ProductsSchema)
module.exports = Products;