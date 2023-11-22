// passwordReset.controller.js
const User = require('../models/customers.model')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fontendDomain = process.env.FRONTEND_DOMAIN
const bcrypt = require('bcrypt');



exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "User with given email doesn't exist" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '10min' });


        const resetLink = `${fontendDomain}reset-password/${token}`;

        console.log(resetLink)
        // Email logic
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Or your email service provider
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Password Reset Link-Herbal Zestfulness',
            html: `<p>Please use the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                res.status(500).send({ message: "Error sending email" });
            } else {
                console.log('Email sent: ' + info.response);
                res.send({ message: "Password reset link has been sent to your email." });
            }
        });


        res.send({ message: "Password reset link has been sent to your email." });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update user's password
        user.password = hashedPassword;
        await user.save();

        res.send({ message: "Password has been reset successfully" });
    } catch (error) {
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            res.status(400).send({ message: "Token has expired, resend the link." });
        } else {
            res.status(400).send({ message: "Invalid or expired link" });
        }
    }
};
