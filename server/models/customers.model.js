const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const CustomerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: [2, 'First name must be at least 2 characters long.'],
        required: [true, 'First name is required.'],
    },
    lastName: {
        type: String,
        minlength: [2, 'Last name must be at least 2 characters long.'],
        required: [true, 'Last name is required.'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email address.'],
        unique: [true, 'Email already in use.'],
        match: [
            /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
            ,
            'Please provide a valid email address.',
        ],
    },
    refreshToken: {
        type: String,
        required: false, // Make this field optional
    },

    mobilePhone: {
        type: String,
        match: [
            /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
            'Please use this format: +1 (123) 123-4567',
        ],
    },
    homePhone: {
        type: String,
        match: [
            /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
            'Please use this format: +1 (123) 123-4567',
        ],
    },
    comment: {
        type: String,
        maxlength: [256, 'Please keep your description under 256 characters.'],
    },
    //consent: {
    //    type: Boolean,
    //    required: [true, 'Please acknowledge and consent.'],
    //},
    // Additional Fields
    address: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        minlength: [8, 'Password Must be at least 8 characters.']
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        },
    ],
    // You can add other fields here as needed.
},
    { timestamps: true });

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
