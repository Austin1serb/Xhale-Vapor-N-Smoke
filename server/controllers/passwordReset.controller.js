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
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5min' });
            const resetLink = `${fontendDomain}/reset-password/${token}`;

            // Email logic
            let transporter = nodemailer.createTransport({
                // host: "smtp.office365.com",
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USERNAME,
                to: email,
                subject: 'Password Reset Link-Herba Natural',
                html: `
        <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #0F75E0; text-align: center;">Reset Your Password</h2>
            <p style="text-align: center; font-size: 16px;">You requested a password reset for your Herba Natural account.</p>
            <div style="text-align: center; margin: 25px 0;">
                <a href="${resetLink}" style="background-color: #0F75E0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 18px;">Reset Password</a>
            </div>
            <p style="font-size: 14px; color: #555; text-align: center;">If you did not request a password reset, please ignore this email.</p>
        </div>
    `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
        }

        // Generic response
        res.status(200).send({ message: "Password Link Sent" });

    } catch (error) {
        console.error('Internal Server Error:', error);
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
