const Customers = require('../models/customers.model')
const bcrypt = require('bcrypt');
const saltRounds = 10; //
const secretKey = process.env.JWT_SECRET_KEY;
const jwt = require('jsonwebtoken');
const RevokedToken = require('../models/revokedToken.model');
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
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token is missing' });
            }

            const existingRevokedToken = await RevokedToken.findOne({ token: refreshToken });

            if (existingRevokedToken) {
                return res.status(401).json({ message: 'Refresh token is revoked' });
            }

            const user = await Customers.findById(req.user.userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (refreshToken) {
                const decoded = jwt.verify(refreshToken, secretKey, (err, decoded) => {
                    if (err) {
                        // Handle expired token or other verification errors
                        return res.status(401).json({ message: 'Invalid or expired refresh token' });
                    }
                    return decoded;
                });
            }
            const accessToken = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '12h' });

            return res.json({ message: 'Token refreshed successfully', accessToken });
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err });
        }
    },

    createOne: async (req, res) => {
        console.log(req.body);
        const { firstName, lastName, email, password, recaptchaValue, isVerified } = req.body;
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

            // Hash the password before storing it
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const customer = await Customers.create({
                firstName,
                lastName,
                email,
                isVerified,
                password: hashedPassword,

            });

            // Store the refresh token securely (e.g., in a database)
            await customer.save();
            // Generate a secure refresh token
            const refreshToken = jwt.sign({
                customerId: customer._id
            }, secretKey, { expiresIn: '7d' });

            customer.refreshToken = refreshToken;
            await customer.save();

            // Generate the initial access token
            const accessToken = jwt.sign({
                customerId: customer._id,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email
            }, secretKey, { expiresIn: '12h' });

            // Set refresh token in HTTP-Only cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false, // use secure in production
                maxAge: 43300000/* refresh token expiry in milliseconds */,
                sameSite: 'lax',
            });

            // Send the initial access token  to the client
            res.status(201).json({ customer, accessToken });
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
            const passwordMatch = bcrypt.compare(password, user.password);

            if (passwordMatch) {
                // Passwords match, user is authenticated

                // Generate a new access token
                const accessToken = jwt.sign({
                    customerId: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isAdmin: user.isAdmin,
                }, secretKey, { expiresIn: '12h' });

                // Generate a new refresh token
                const newRefreshToken = jwt.sign({
                    customerId: user._id
                }, secretKey, { expiresIn: '7d' }); // Adjust expiration as needed
                // Store the hashed refresh token in the user's document
                user.refreshToken = newRefreshToken
                user.isVerified = true
                await user.save();
                // Set refresh token in HTTP-Only cookie
                res.cookie('refreshToken', newRefreshToken, {

                    httpOnly: true,
                    secure: false,
                    maxAge: 43300000/* refresh token expiry in milliseconds */,
                    sameSite: 'lax',
                });


                // Send the new access token and refresh token to the client
                return res.json({ message: 'Login successful', accessToken, });
            } else {
                // Passwords don't match, authentication failed
                return res.status(401).json({ message: 'Incorrect email or password.' });
            }
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err });
        }
    },


    revokeToken: async (refreshToken) => {
        try {
            const revokedToken = new RevokedToken({ token: refreshToken });
            await revokedToken.save();
            // Optionally, you could return some confirmation or status
        } catch (error) {
            // Handle or log the error as per your application's error management strategy
            console.error("Error in revoking token: ", error);
            // Depending on how you manage errors, you might also throw an error or return a status
        }
    },



    logoutUser: async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken; // Get the refresh token from the cookie

            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token is missing' });
            }

            // Decode the refresh token to get the user's ID
            const decoded = jwt.verify(refreshToken, secretKey); // Adjust this as per your JWT settings

            // Check if the token has already been revoked
            const existingRevokedToken = await RevokedToken.findOne({ token: refreshToken });
            if (existingRevokedToken) {
                return res.status(401).json({ message: 'Refresh token is already revoked' });
            }

            // Clear the refresh token from the user's document
            await Customers.updateOne({ _id: decoded.customerId }, { $unset: { refreshToken: "" } });

            // Revoke the refresh token
            const revokedToken = new RevokedToken({ token: refreshToken });
            await revokedToken.save();

            // Now clear the cookie after all operations are completed
            res.clearCookie('refreshToken');

            return res.status(200).json({ message: 'Logout successful' });
        } catch (err) {
            console.error("Error in logoutUser:", err);
            return res.status(500).json({
                message: 'Server error',
                error: err.message || 'Unknown error'
            });
        }
    },

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