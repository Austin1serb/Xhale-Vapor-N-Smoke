const nodemailer = require('nodemailer');

exports.sendContactEmail = async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Set up Nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail', // Or your preferred email service
        auth: {
            user: process.env.EMAIL_USERNAME, // Your email
            pass: process.env.EMAIL_PASSWORD, // Your email password
        },
    });

    // Email content
    let mailOptions = {
        from: email, // Sender's email
        to: 'support@herbalZestfulness.com', // Your email
        subject: `Contact Form Submission: ${subject}`,
        html: `
            <p><b>Name:</b> ${name}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Subject:</b> ${subject}</p>
            <p><b>Message:</b></p>
            <p>${message}</p>
        `,
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Email sent successfully.' });
    } catch (error) {
        console.error('Failed to send email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
};
