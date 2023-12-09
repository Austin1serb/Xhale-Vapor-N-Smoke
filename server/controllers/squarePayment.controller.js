const square = require('square');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

const { Client, Environment, ApiError } = require("square");

const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: Environment.Production,

});
const { refundsApi } = client
const paymentsApi = client.paymentsApi;


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


            emailReceiptUrl = responseBody.payment.receipt_url;

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
        console.error('Error occurred:', error);
        res.status(500).json({ error: error.message });
    }
};




async function sendReceiptEmail(cost, notes, estimatedShipping, orderDetails, last4, emailReceiptUrl) {

    let trackingNumber = orderDetails.shippingMethod.trackingNumber ? orderDetails.shippingMethod.trackingNumber : 'Not avaliable yet.'
    let trackingUrls = orderDetails.shippingMethod.trackingUrl ? orderDetails.shippingMethod.trackingUrl : 'Soon'
    let transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            ciphers: 'SSLv3'
        }
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
        from: 'customerservices@herbanaturalco.com', // Your email address
        to: `${orderDetails.customerEmail}`, // Customer's email address
        subject: 'Thank You for Your Purchase!',
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);">
                <h2 style="color: #0F75E0; text-align: center;">Thank You from Herba Naturals!</h2>
                <div style="text-align: center;">
                    <img src="https://i.imgur.com/3i30ftP.jpg" style="width: 300px;" alt="Herba Naturals Logo" onerror="this.style.display='none'"/>
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
                <p style="text-align: center; color: #0fe09e;">Warm regards,The Herba Naturals Team</p>
            </div>
        </div>
    `
    };

    // Send the email
    await transporter.sendMail(mailOptions);



}

////TEST EMAIL
//sendReceiptEmail(cost = { subTotal: 0.01, grandTotal: 0.0111, tax: 0, shippingCost: 0 }, notes = 'ddeed', estimatedShipping = 'December 13th, 2023', orderDetails = {
//    orderNotes: '',
//    customer: "657349011e1c4358033745e6",
//    customerEmail: 'austin.serb@icloud.com',
//    customerPhone: '(208) 616-3408',
//    products: [
//        {
//            name: 'CBD TERPENE TINCTURE 550MG 30ML',
//            productId: "656ebd1c1908e127c9f87ca4",
//            price: 0.01,
//            quantity: 1,
//            img: 'https://res.cloudinary.com/dmbofhpcg/image/upload/v1701756187/product_images/pqrkqi6m4gnix2kcthve.png',
//            _id: "657367814c3ed23e9e31bdf5"
//        }
//    ],
//    shippingMethod: {
//        provider: 'USPS',
//        carrierAccountId: '9ad8fceeca0f47c6a4e4e66f010b020d',
//        serviceLevelToken: 'usps_ground_advantage',
//        price: '3.99',
//        amountCharged: '3.99',
//        type: 'Ground Advantage',
//        carrier: 'USPS',
//        trackingNumber: '',
//        trackingUrl: '',
//        labelUrl: '',
//        estimatedShipping: 'December 13th, 2023'
//    },
//    totalAmount: { subTotal: 0.01, grandTotal: 0.0111, tax: 0, shippingCost: 0 },
//    address: 'Austin Serb, 330 4th st, krikland, wa, 98033, US',
//    orderStatus: 'Pending',
//    paymentStatus: 'Paid',
//    transactionId: 'X9vx1fQbanq9SfRjyDZ7g3zva1OZY',
//    createdBy: "657349011e1c4358033745e6",
//    createdByType: 'Customer',
//    _id: "657367814c3ed23e9e31bdf4",
//    orderDate: '2023-12-08T18:59:13.366Z',
//    orderNumber: '657367814c3ed23e9e31bdf4',
//    createdAt: '2023-12-08T18:59:13.374Z',
//    updatedAt: '2023-12-08T18:59:13.374Z',
//    __v: 0
//}, last4 = 9999, emailReceiptUrl = 'https://squareup.com/receipt/preview/X9vx1fQbanq9SfRjyDZ7g3zva1OZY',)
module.exports = {
    processPayment
};










