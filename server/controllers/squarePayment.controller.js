const square = require('square');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

const { Client, Environment, ApiError } = require("square");

const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: Environment.Production,

});
const paymentsApi = client.paymentsApi;


//const { locationsApi } = client;

//async function getLocations() {
//    try {
//        let listLocationsResponse = await locationsApi.listLocations();

//        let locations = listLocationsResponse.result.locations;

//        locations.forEach(function (location) {
//            console.log(
//                location.id + ": " +
//                location.name + ", " +
//                location.address.addressLine1 + ", " +
//                location.address.locality
//            );
//        });
//    } catch (error) {
//        if (error instanceof ApiError) {
//            error.result.errors.forEach(function (e) {
//                console.log(e.category);
//                console.log(e.code);
//                console.log(e.detail);
//            });
//        } else {
//            console.log("Unexpected error occurred: ", error);
//        }
//    }
//};

//getLocations();

function convertBigIntToString(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'bigint') {
            obj[key] = obj[key].toString();
        } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            convertBigIntToString(obj[key]);
        }
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
            const emailReceiptUrl = responseBody.payment.receipt_url;


            await sendReceiptEmail(cost, notes, estimatedShipping, orderDetails, last4, emailRecieptUrl);


            // If email sending is successful, send a success response
            res.json({
                success: true,
                message: 'Payment processed successfully',
                paymentId: responseBody.payment.id,
                receiptUrl: emailReceiptUrl,
                response: response
            });
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




async function sendReceiptEmail(cost, notes, estimatedShipping, orderDetails, last4, emailRecieptUrl) {


    let transporter = nodemailer.createTransport({
        service: 'gmail', // or your email service provider
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD

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
                <div style="margin-bottom: 20px; margin-left:20px">
                  
                     <div style='display: flex; justify-content: center; align-items: center;'>
                       <img src="${img}" alt="${name}" style="width: 100px; height: auto; margin-left: 10px; float: left;">
                       <div>
                        <strong>${name}</strong><br>
                        Quantity: ${quantity}<br>
                        Price: $${price}
                        </div>
                    </div>
                    <div style="clear: both;"></div>
                </div>
            `;
        }).join('');
    } else {
        console.error('orderDetails.products is undefined or not an array');
        productsHtml = 'Error: orderDetails.products is undefined or not an array';
    }

    let mailOptions = {
        from: 'serbaustin@gmail.com', // Your email address
        to: `${orderDetails.customerEmail}`, // Customer's email address
        subject: 'Thank You for Your Purchase!',
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);">
                <h2 style="color: #0F75E0; text-align: center;">Thank You from Herba Naturals!</h2>
                <div style="text-align: center;">
                    <img src="https://i.imgur.com/3i30ftP.jpg" style="width: 200px;" alt="Herba Naturals Logo" onerror="this.style.display='none'"/>
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
                <p><strong>Notes:</strong> ${notes}</p>
                <p>You can view your receipt and order details <a href="${emailReceiptUrl}" style="color: #0F75E0; text-decoration: none;">here</a>.</p>
                <p><strong>Your tracking number is:</strong> ${orderDetails.shippingMethod.trackingNumber}</p>
                <p>You can track your order <a href="${orderDetails.shippingMethod.trackingUrl}" style="color: #0F75E0; text-decoration: none;">here</a>.</p>
                <p>If you have any questions or concerns about your order, please don't hesitate to contact us.</p>
                <p style="text-align: center; color: #0F75E0;">Warm regards,<br>The Herba Naturals Team</p>
            </div>
        </div>
    `
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    //await transporter.sendMail(mailOptions2);
}

module.exports = {
    processPayment
};







