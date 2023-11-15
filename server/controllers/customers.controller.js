const Customers = require('../models/customers.model')
const bcrypt = require('bcrypt');
const saltRounds = 10; //
const secretKey = process.env.JWT_SECRET_KEY;
const jwt = require('jsonwebtoken');
const RevokedToken = require('../models/revokedToken.model');
const crypto = require('crypto');
const reCaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;

const verifyRecaptcha = async (token) => {
    const secretKey = reCaptchaSecretKey

    // Dynamically import node-fetch
    const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    return data.success;
};


module.exports = {
    test: (req, res) => {
        res.json({ message: "Test customer response!" });
    },
    getAll: (req, res) => {
        Customers.find()
            .then(data => { res.json(data) })
            .catch(err => res.json(err))
    },


    getOne: (req, res) => {
        const userId = req.params.id; // Retrieve the user's ID from the request parameter

        Customers.findOne({ _id: userId }) // Query the database using the user's ID
            .then(data => {
                if (data) {
                    // User data found
                    res.json(data);
                } else {
                    // User not found
                    res.status(404).json({ message: 'User not found' });
                }
            })
            .catch(err => res.status(500).json({ message: 'Error fetching user data', error: err }));
    },




    // Controller for token refresh
    refreshToken: async (req, res) => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token is missing' });
            }

            const existingRevokedToken = await RevokedToken.findOne({ token: refreshToken });

            if (existingRevokedToken) {
                return res.status(401).json({ message: 'Refresh token is revoked' });
            }

            // You should also check if the refresh token is expired and handle expiration.

            const user = await Customers.findById(req.user.userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const accessToken = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '12h' });

            return res.json({ message: 'Token refreshed successfully', accessToken });
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err });
        }
    },

    createOne: async (req, res) => {
        console.log(req.body);
        const { firstName, lastName, email, password, recaptchaValue } = req.body;

        try {
            const recaptchaVerified = await verifyRecaptcha(recaptchaValue);
            if (!recaptchaVerified) {
                return res.status(400).json({ message: 'Invalid reCAPTCHA. Please try again.' + res.error });
            }
            // Check if the email already exists
            const existingCustomer = await Customers.findOne({ email });
            if (existingCustomer) {
                return res.status(400).json({ errors: { email: 'Email already in use.' } });
            }

            // Generate a secure refresh token
            const refreshToken = crypto.randomBytes(64).toString('hex'); // Create a secure refresh token
            // Hash the password before storing it
            const hashedPassword = await bcrypt.hash(password, saltRounds);


            const customer = await Customers.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                refreshToken,
            });

            // Store the refresh token securely (e.g., in a database)
            await customer.save();

            // Generate the initial access token
            const accessToken = jwt.sign({
                customerId: customer._id,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email
            }, secretKey, { expiresIn: '12h' });
            // Send the initial access token and refresh token to the client
            res.status(201).json({ customer, accessToken, refreshToken });
        } catch (error) {
            if (error.name === 'ValidationError') {
                const errors = {};
                for (const field in error.errors) {
                    errors[field] = error.errors[field].message;
                }
                return res.status(400).json({ errors });
            }
            return res.status(500).json({ message: 'Server error' + error, error: error });
        }
    },


    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find the user by email
            const user = await Customers.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'Incorrect email or password.' });
            }

            // Compare the hashed password provided in the request with the hashed password in the database
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                // Passwords match, user is authenticated

                // Generate a new access token
                const accessToken = jwt.sign({
                    customerId: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }, secretKey, { expiresIn: '12h' });

                // Generate a new refresh token
                const newRefreshToken = crypto.randomBytes(64).toString('hex');
                // Store the hashed refresh token in the user's document
                user.refreshToken = newRefreshToken
                await user.save();

                // Send the new access token and refresh token to the client
                return res.json({ message: 'Login successful', accessToken, refreshToken: newRefreshToken });
            } else {
                // Passwords don't match, authentication failed
                return res.status(401).json({ message: 'Incorrect email or password.' });
            }
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err });
        }
    },

    revokeToken: async (refreshToken) => {
        const revokedToken = new RevokedToken({ token: refreshToken });
        await revokedToken.save();
    },
    logoutUser: async (req, res) => {


        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token is missing' });
            }

            const existingRevokedToken = await RevokedToken.findOne({ token: refreshToken });
            if (existingRevokedToken) {
                return res.status(401).json({ message: 'Refresh token is already revoked' });
            }

            // Clear the refresh token from the user's document
            await Customers.updateOne({ _id: refreshToken.userId }, { $unset: { refreshToken: "" } });

            // Revoke the refresh token
            const revokedToken = new RevokedToken({ token: refreshToken });
            await revokedToken.save();

            return res.status(200).json({ message: 'Logout successful' });
        } catch (err) {
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token', error: err.message });
            }
            return res.status(500).json({ message: 'Server error', error: err });
        }
    },

    //logoutUser: async (req, res) => {
    //    try {
    //        //const refreshToken = req.body.refreshToken;

    //        //// Check if a refreshToken is provided
    //        //if (!refreshToken) {
    //        //    return res.status(401).json({ message: 'Refresh token is missing' + res });
    //        //}

    //        //// Check if the refresh token is revoked
    //        //const existingRevokedToken = await RevokedToken.findOne({ token: refreshToken });

    //        //if (existingRevokedToken) {
    //        //    return res.status(401).json({ message: 'Refresh token is revoked' });
    //        //}

    //        // If the refresh token is valid, you can clear it and handle any other logout actions

    //        // Clear the refresh token (or perform any other required actions)
    //        // ...

    //        // Send a success response
    //        return res.status(200).json({ message: 'Logout successful' });
    //    } catch (err) {
    //        return res.status(500).json({ message: 'Server error' + err });
    //    }
    //},
    updateOne: (req, res) => {
        const updateData = req.body; // Data to update the document with
        const customerId = req.params.id; // ID of the customer to update

        Customers.findOneAndUpdate(
            { _id: customerId },
            updateData,
            { new: true, runValidators: true }) // 'new: true' to return updated document
            .then(updatedCustomer => {
                if (updatedCustomer) {
                    res.json(updatedCustomer);
                } else {
                    res.status(404).json({ message: 'Customer not found' });
                }
            })
            .catch(err => {
                // If error is due to validation
                if (err.name === 'ValidationError') {
                    res.status(400).json({ message: 'Validation error', error: err.errors });
                } else {
                    // For other types of errors
                    res.status(500).json({ message: 'An error occurred', error: err });
                }
            });
    },

    deleteOne: (req, res) => {
        Customers.deleteOne({ _id: req.params.id })
            .then(data => {
                res.json(data)
            }).catch(err => res.json(err))
    }
}