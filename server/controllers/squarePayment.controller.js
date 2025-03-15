const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

const { Client, Environment, ApiError } = require("square");

const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: "sandbox"

});
const { refundsApi } = client
const paymentsApi = client.paymentsApi;


const emailUsername = process.env.EMAIL_USERNAME;
const emailPassword = process.env.EMAIL_PASSWORD;


function convertBigIntToString(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'bigint') {
            obj[key] = obj[key].toString();
        } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            convertBigIntToString(obj[key]);
        }
    }
}




async function issueRefund(paymentId, amount) {
    try {
        const refund = {
            idempotencyKey: uuidv4(), // Unique identifier for each refund request
            paymentId: paymentId,
            amountMoney: {
                amount: amount, // Amount in cents
                currency: 'USD'
            }
        };

        const { result } = await refundsApi.refundPayment(refund);
        return result;
    } catch (error) {
        console.error('Error occurred while issuing a refund:', error);
        throw error; // Rethrow the error for further handling
    }
}


const processPayment = async (req, res) => {


    const { sourceId, amount, cost, notes, estimatedShipping, orderDetails, last4, } = req.body; // sourceId is the payment source, e.g., card nonce


    try {
        // console.log("Request body received:", req.body);

        const response = await paymentsApi.createPayment({
            sourceId: sourceId,
            idempotencyKey: uuidv4(),
            customerId: orderDetails.customer,
            buyerEmailAddress: orderDetails.customerEmail,
            amountMoney: {
                amount: amount, // amount in cents
                currency: 'USD'

            }

        });


        convertBigIntToString(response); // Convert BigInt values to strings


        let responseBody;
        if (typeof response.body === 'string') {
            responseBody = JSON.parse(response.body);
        } else {
            responseBody = response.body;
        }


        if (response && responseBody.payment && responseBody.payment.status === 'COMPLETED') {


            let emailReceiptUrl = responseBody.payment.receipt_url;

            try {
                await sendReceiptEmail(cost, notes, estimatedShipping, orderDetails, last4, emailReceiptUrl);


                // If email sending is successful, send a success response
                res.json({
                    success: true,
                    message: 'Payment processed successfully',
                    paymentId: responseBody.payment.id,
                    receiptUrl: emailReceiptUrl,
                    response: response
                });
            } catch (emailError) {
                console.error('Email sending error:', emailError);
                await issueRefund(responseBody.payment.id, responseBody.payment.amount_money.amount);
                console.log('Refund issued due to an error after payment');
                res.status(500).json({ error: "Payment successful but failed to send receipt email." });
            }
        } else {
            // Payment failed
            res.status(400).json({ message: 'Payment failed' });
        }
    } catch (error) {
        // This catch block will handle both payment processing errors
        // and email sending errors
        console.error('Error occurred:::', JSON.parse(error.body));

        res.status(500).json({ error: JSON.parse(error.body) });
    }
};


async function sendReceiptEmail(cost, notes, estimatedShipping, orderDetails, last4, emailReceiptUrl) {

    let trackingNumber = orderDetails.shippingMethod.trackingNumber ? orderDetails.shippingMethod.trackingNumber : 'Not available yet.'
    let trackingUrls = orderDetails.shippingMethod.trackingUrl ? orderDetails.shippingMethod.trackingUrl : 'Soon'
    let transporter = nodemailer.createTransport({
        // host: "smtp.office365.com",
        // port: 587,
        // secure: false,
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: emailUsername,
            pass: emailPassword
        },
        // tls: {
        //     ciphers: 'SSLv3'
        // }
    });


    // Construct the list of products with quantities and prices
    let productsHtml = '';
    if (orderDetails && Array.isArray(orderDetails.products)) {
        productsHtml = orderDetails.products.map(product => {
            const name = product.name || 'Unknown Product';
            const quantity = product.quantity || 0;
            const price = product.price || 0;
            const img = product.img || ''; // URL of the product image
            return `
            <div style="margin-bottom: 20px; display: flex; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <img src="${img}" alt="${name}" style="width: 80px; height: auto; margin-right: 10px; border-radius: 4px; ">
            <div style="flex-grow: 1;">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">${name}</div>
                <div style="font-size: 14px; color: #555;">
                    Quantity: ${quantity}<br>
                    Price: $${price.toFixed(2)}
                </div>
            </div>
        </div>
            `;
        }).join('');
    } else {
        console.error('orderDetails.products is undefined or not an array');
        productsHtml = 'Error: orderDetails.products is undefined or not an array';
    }

    let mailOptions = {
        from: emailUsername, // Your email address
        to: `${orderDetails.customerEmail}`, // Customer's email address
        subject: 'Thank You for Your Purchase!',
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);">
                <h2 style="color: #0F75E0; text-align: center;">Thank You from Herba Natural!</h2>
                <div style="text-align: center;">
                    <img src="https://i.imgur.com/4cTMTOA.png" style="width: 300px;" alt="Herba Natural Logo" onerror="this.style.display='none'"/>
                </div>
                <p style="text-align: center;">We appreciate your order and are excited to share our products with you. Here are the details of your purchase:</p>
                <ul>
                    ${productsHtml}
                </ul>
                <p><strong>Subtotal:</strong> $${cost.subTotal.toFixed(2)}</p>
                <p><strong>Shipping Cost:</strong> $${cost.shippingCost.toFixed(2)}</p>
                <p><strong>Tax:</strong> $${cost.tax.toFixed(2)}</p>
                <p><strong>Total: $${cost.grandTotal.toFixed(2)}</strong></p>
                <div style="border: 1px solid #ddd; padding: 10px; text-align: center;">
                    <p><strong>Card Charged:</strong> **** **** **** ${last4}</p>
                </div>
                <p><strong>Shipping To:</strong> ${orderDetails.address}</p>
                <p><strong>Estimated Shipping Date:</strong> ${estimatedShipping ? estimatedShipping : 'Unavailable'}</p>
                <p><strong>Notes:</strong> ${notes ? notes : 'No Order Notes'}</p>
                <p>View your receipt and order details: <a href="${emailReceiptUrl}" style="color: #0F75E0; text-decoration: none;">${emailReceiptUrl}</a>.</p>
                <p><strong>Your tracking number is:</strong> ${trackingNumber}</p>
                <p>You can track your order: ${trackingUrls}</p>
                <p>If you have any questions or concerns, please don't hesitate to contact us at customerservices@herbanaturalco.com</p>
                <p style="text-align: center; color: #0fe09e;">Warm regards,The Herba Natural Team</p>
            </div>
        </div>
    `
    };

    // Send the email
    await transporter.sendMail(mailOptions);



}

module.exports = {
    processPayment
};










