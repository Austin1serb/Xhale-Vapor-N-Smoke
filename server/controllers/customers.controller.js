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


const verifyRefreshToken = async (req) => {
    const refreshToken = req.cookies.refreshToken; // Assuming the refresh token is stored in cookies

    if (!refreshToken) {
        throw new Error('No refresh token provided');
    }

    const decoded = jwt.verify(refreshToken, secretKey);
    if (!decoded) {
        throw new Error('Invalid refresh token');
    }

    // Check if the token has been revoked
    const revokedToken = await RevokedToken.findOne({ token: refreshToken });
    if (revokedToken) {
        throw new Error('Refresh token has been revoked');
    }

    // Check if the user exists in the database
    const user = await Customers.findById(decoded.customerId);
    if (!user) {
        throw new Error('User not found');
    }

    // If the user is an admin, allow them to proceed without matching the customerId
    if (user.isAdmin) {
        return user;
    }

    // For non-admin users, check if the customerId matches the one in the request
    if (decoded.customerId !== req.params.id) {
        throw new Error('Unauthorized access: Customer ID mismatch');
    }

    return user;
};


const verifyAccessToken = (req) => {
    const accessToken = req.headers.authorization.split(' ')[1];

    if (!accessToken) {
        throw new Error('No access token provided');
    }

    const decoded = jwt.verify(accessToken, secretKey);
    if (!decoded || decoded.userId !== req.params.id) {
        throw new Error('Invalid access token');
    }
    return decoded;
};


module.exports = {
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
            const oldRefreshToken = req.cookies.refreshToken;

            if (!oldRefreshToken) {
                return res.status(401).json({ message: 'Refresh token is missing' });
            }

            const existingRevokedToken = await RevokedToken.findOne({ token: oldRefreshToken });
            if (existingRevokedToken) {
                return res.status(401).json({ message: 'Refresh token is revoked' });
            }

            jwt.verify(oldRefreshToken, secretKey, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: 'Invalid or expired refresh token' });
                }

                const user = await Customers.findById(decoded.customerId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                // Revoke the old refresh token by adding it to RevokedToken model
                const revokedToken = new RevokedToken({ token: oldRefreshToken });
                await revokedToken.save();

                // Generate a new refresh token
                const newRefreshToken = jwt.sign({ customerId: user._id }, secretKey, { expiresIn: '1d' });

                // Update the user's record with the new refresh token
                user.refreshToken = newRefreshToken;
                await user.save();

                // Generate a new access token
                const accessToken = jwt.sign({
                    customerId: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }, secretKey, { expiresIn: '12h' });

                // Set the new refresh token in an HTTP-Only cookie
                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: true, // Use secure in production
                    maxAge: 86600000, // Refresh token expiry in milliseconds
                    sameSite: 'None',
                });

                console.log('Tokens refreshed');
                return res.json({ message: 'Tokens refreshed successfully', accessToken });
            });
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err });
        }
    },




    createOne: async (req, res) => {

        let { firstName, lastName, email, password, recaptchaValue, isVerified } = req.body;
        email = email.toLowerCase()
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

            await customer.save();
            // Generate a secure refresh token
            const refreshToken = jwt.sign({
                customerId: customer._id
            }, secretKey, { expiresIn: '1d' });

            customer.refreshToken = refreshToken;
            await customer.save();

            // Generate the initial access token
            const accessToken = jwt.sign({
                customerId: customer._id,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
            }, secretKey, { expiresIn: '1h' });

            // Set refresh token in HTTP-Only cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true, // use secure in production
                maxAge: 43300000/* refresh token expiry in milliseconds */,
                sameSite: 'None',
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
            let { email, password } = req.body;
            email = email.toLowerCase()
            // Find the user by email
            const user = await Customers.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'Incorrect email or password.' });
            }

            // Compare the hashed password provided in the request with the hashed password in the database

            const passwordMatch = await bcrypt.compare(password, user.password);
            // Passwords match, user is authenticated
            if (passwordMatch) {
                // Generate a new access token
                const accessToken = jwt.sign({
                    customerId: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isAdmin: user.isAdmin,
                }, secretKey, { expiresIn: '1h' });
                // Generate a new refresh token
                const newRefreshToken = jwt.sign({
                    customerId: user._id
                }, secretKey, { expiresIn: '1d' }); // Adjust expiration as needed
                // Store the hashed refresh token in the user's document
                user.refreshToken = newRefreshToken
                user.isVerified = true
                await user.save();
                // Set refresh token in HTTP-Only cookie
                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 43300000/* refresh token expiry in milliseconds */,
                    sameSite: 'None',
                });
                // Send the new access token and refresh token to the client
                return res.json({ message: 'Login successful', accessToken, });
            } else {
                // Passwords don't match, authentication failed
                return res.status(401).json({ message: 'Incorrect email or password.' });
            }
        } catch (err) {
            console.error(err)
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

    updateOne: async (req, res) => {
        try {
            // Verify the token of the user making the request
            const requestingUser = await verifyRefreshToken(req);
            if (!requestingUser) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Extract the ID of the user to update from the request parameters
            // and the update data from the request body
            const targetUserId = req.params.id; // Assuming the target user's ID is passed as a URL parameter
            const updateData = req.body;

            // Check if the requesting user is an admin
            if (!requestingUser.isAdmin) {
                // For non-admin users, they can only update their own information
                if (targetUserId !== requestingUser._id.toString()) {
                    return res.status(403).json({ message: 'Forbidden: You can only update your own information.' });
                }
                // Exclude sensitive fields
                delete updateData.isAdmin;
                delete updateData.refreshToken;
            }

            // Hash password if it is included in the update data
            if (updateData.password) {
                updateData.password = await bcrypt.hash(updateData.password, saltRounds);
            }

            // Proceed with the update operation
            const updatedCustomer = await Customers.findByIdAndUpdate(
                targetUserId,
                updateData,
                { new: true, runValidators: true }
            );

            if (updatedCustomer) {
                res.json(updatedCustomer);
            } else {
                res.status(404).json({ message: 'Customer not found' });
            }
        } catch (error) {
            console.error(error.message);

            if (error.name === 'ValidationError') {
                res.status(400).json({ message: 'Validation error', error: error });
            } else if (error.name === 'JsonWebTokenError') {
                res.status(401).json({ message: 'Invalid token', error: error });
            } else {
                res.status(500).json({ message: 'An error occurred', error: error });
            }
        }
    },




    deleteOne: async (req, res) => {
        try {
            const requestingUser = await verifyRefreshToken(req);
            if (!requestingUser) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Extract the ID of the user to delete from the request parameters
            const targetUserId = req.params.id; // Assuming the target user's ID is passed as a URL parameter

            if (!requestingUser.isAdmin && requestingUser._id.toString() !== targetUserId) {
                // Non-admin users can only delete their own account
                return res.status(403).json({ message: 'Forbidden: You can only delete your own account.' });
            }

            // Fetch the target user to ensure they exist before attempting to delete
            const userToDelete = await Customers.findById(targetUserId);
            if (!userToDelete) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Proceed with the deletion
            await Customers.deleteOne({ _id: targetUserId });

            res.status(200).json({ message: 'User successfully deleted' });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'An error occurred', error: error });
        }
    },




    //deleteOne: (req, res) => {
    //    Customers.deleteOne({ _id: req.params.id })
    //        .then(data => {
    //            res.json(data)
    //        }).catch(err => res.json(err))
    //}
}