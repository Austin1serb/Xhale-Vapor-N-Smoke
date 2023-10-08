const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const StaffersSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: [4, "Username must be at least 4 characters long."],
        required: [true, "Username is required."],
        unique: [true, "Username is already in use."],
    },
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
    password: {
        type: String,
        required: [true, 'Password is required.'],
    },
    auditTrail: [{
        action: String,
        timestamp: Date,
    }],
    profilePicture: {
        type: String,
        // Store the URL or path to the profile picture
    },
});

// Hash the password before saving it to the database
StaffersSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const Staffers = mongoose.model("Staff", StaffersSchema);

module.exports = Staffers;
