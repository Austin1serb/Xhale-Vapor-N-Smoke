const Customers = require('../models/customers.model')
const bcrypt = require('bcrypt');
const saltRounds = 10; //
const secretKey = process.env.JWT_SECRET_KEY;
const jwt = require('jsonwebtoken');

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
        Customers.findOne({ _id: req.params.id })
            .then(data => {
                res.json(data)
            }).catch(err => res.json(err))
    },

    createOne: async (req, res) => {
        const { firstName, lastName, email, password } = req.body;

        try {
            // Check if the email already exists
            const existingCustomer = await Customers.findOne({ email });
            if (existingCustomer) {
                return res.status(400).json({ errors: { email: 'Email already in use.' } });
            }

            // Hash the password before storing it
            const hashedPassword = await bcrypt.hash(password, 10);

            const customer = await Customers.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
            });

            // Send a success response with the created customer
            res.status(201).json(customer);
        } catch (error) {
            if (error.name === 'ValidationError') {
                const errors = {};
                for (const field in error.errors) {
                    errors[field] = error.errors[field].message;
                }
                return res.status(400).json({ errors });
            }
            return res.status(500).json({ message: 'Server error', error: error });
        }
    },



    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find the user using promises
            const user = await Customers.findOne({ email }).exec();

            if (!user) {
                return res.status(404).json({ message: 'Incorrect email or password.' });
            }

            // Compare the hashed password provided in Postman with the hashed password in the database
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                // Passwords match, user is authenticated
                const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
                return res.json({ message: 'Login successful', token });
            } else {
                // Passwords don't match, authentication failed
                return res.status(401).json({ message: 'Incorrect email or password.' });
            }
        } catch (err) {
            return res.status(500).json({ message: 'Server error' + err });
        }
    },
    updateOne: (req, res) => {
        Customers.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true, runValidators: true })
            .then(data => {
                res.json(data)
            }).catch(err => res.status(400).json(err))
    },
    deleteOne: (req, res) => {
        Customers.deleteOne({ _id: req.params.id })
            .then(data => {
                res.json(data)
            }).catch(err => res.json(err))
    }
}