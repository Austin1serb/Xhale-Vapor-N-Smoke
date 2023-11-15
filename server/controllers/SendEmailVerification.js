const nodemailer = require('nodemailer');

const sendEmailConfirmation = async (email, orderId) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'serbaustin@gmail.com',
            pass: 'aA519531181',
        },
    });

    let info = await transporter.sendMail({
        from: '"Your Store" <your-email@gmail.com>',
        to: email,
        subject: 'Order Confirmation',
        text: `Thank you for your purchase! Your order ID is ${orderId}.`,
        html: `<b>Thank you for your purchase!</b><p>Your order ID is ${orderId}.</p>`,
    });

    console.log('Message sent:', info.messageId);
};
