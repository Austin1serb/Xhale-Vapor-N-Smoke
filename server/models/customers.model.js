const mongoose = require('mongoose')
const CustomersSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: [2, "First name must be at least 2 characters long."],
        required: [true, "First name is required."]
    },
    lastName: {
        type: String,
        minlength: [2, "Last name must be at least 2 characters long."],
        required: [true, "Last name is required."]
    },
    email: {
        type: String,
        required: [true, 'Please provide email address.'],
        unique: [true, 'Email already tied to another account.'],
        match: [/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, "Please provide a valid email address."]
    },
    mobilePhone: {
        type: String,
        match: [/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/, "Please use this format: +1 (123) 123-4567"]
    },
    homePhone: {
        type: String,
        match: [/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/, "Please use this format: +1 (123) 123-4567"]
    },
    comment: {
        type: String,
        maxlength: [256, "Please keep your description to under 256 characters."]
    },
    consent: {
        type: Boolean,
        required: [true, "Please Acknowledge and Consent."]
    }
}, {timestamps:true})
const Customers = mongoose.model("Customer", CustomersSchema)
module.exports = Customers;