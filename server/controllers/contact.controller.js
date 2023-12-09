const nodemailer = require('nodemailer');

const sendContactEmail = async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Set up Nodemailer transporter
    let transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Email content
    let mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: `Contact Form Submission: ${subject}`,
        html: `
            <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; color: #333;">
                <h1 style="color: #0F75E0; text-align: center;">Contact Form Submission</h1>
                <div style="padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}" style="text-decoration: none; color: #0F75E0;">${email}</a></p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <div style="margin-top: 20px; padding: 10px; border-top: 1px solid #eee;">
                        <h2 style="color: #333;">Message:</h2>
                        <p>${message}</p>
                    </div>
                </div>
            </div>
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
module.exports = {
    sendContactEmail
};
