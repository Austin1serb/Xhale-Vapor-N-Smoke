const square = require('square');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

const { Client, Environment, ApiError } = require("square");

const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: Environment.Sandbox,

});
const paymentsApi = client.paymentsApi;
const { locationsApi } = client;

async function getLocations() {
    try {
        let listLocationsResponse = await locationsApi.listLocations();

        let locations = listLocationsResponse.result.locations;

        locations.forEach(function (location) {
            console.log(
                location.id + ": " +
                location.name + ", " +
                location.address.addressLine1 + ", " +
                location.address.locality
            );
        });
    } catch (error) {
        if (error instanceof ApiError) {
            error.result.errors.forEach(function (e) {
                console.log(e.category);
                console.log(e.code);
                console.log(e.detail);
            });
        } else {
            console.log("Unexpected error occurred: ", error);
        }
    }
};

getLocations();

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



        if (response && responseBody.payment.status === 'COMPLETED') {
            const emailRecieptUrl = responseBody.receiptUrl;

            //console.log("orderDetails OUTSIDE sendReceiptEmail:", orderDetails);
            // Attempt to send the receipt email
            await sendReceiptEmail(cost, notes, estimatedShipping, orderDetails, last4, emailRecieptUrl);


            // If email sending is successful, send a success response
            res.json({
                success: true,
                message: 'Payment processed successfully',
                paymentId: response.id,
                receiptUrl: response.receiptUrl,
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

    //console.log("orderDetails inside sendReceiptEmail:", orderDetails);
    //if (orderDetails) {
    //    console.log("orderDetails.products inside sendReceiptEmail:", orderDetails.products);
    //}


    let transporter = nodemailer.createTransport({
        service: 'gmail', // or your email service provider
        auth: {
            user: 'serbaustin@gmail.com',
            pass: 'xmyk masr ogng ledh',
            //user: process.env.EMAIL_USERNAME, // Email username
            //pass: process.env.EMAIL_PASSWORD  // Email password
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
            <div style="font-family: Arial, sans-serif; color: #444;">
                <h2>Thank You from Herbal Zestfulness!</h2>
                <div style='display: flex; justify-content: center; align-items: center;'>
                <img src="https://i.imgur.com/HJTXrac.png" style="width: 200px; " alt="Product Image" onerror="this.style.display='none'"/>
                </div>
                <p>We appreciate your order and are excited to share our products with you. Here are the details of your purchase:</p>
                <ul>
                    ${productsHtml}
                </ul>
                <p>Subtotal: $${cost.subTotal.toFixed(2)}</p>
                <p>Shipping Cost: $${cost.shippingCost.toFixed(2)}</p>
                <p>Tax: $${cost.tax.toFixed(2)}</p>
                <p><strong>Total: $${cost.grandTotal.toFixed(2)}</strong></p>
                <p>Card Charged: **** **** **** ${last4}</p>
                <p>Shipping To: ${orderDetails.address}</p>
                <p>Estimated Shipping Date: ${estimatedShipping ? estimatedShipping : 'Unavailable'}</p>
                <p>Notes: ${notes}</p>
                <p>You can view your receipt and order details <a href="${emailRecieptUrl}">here</a>.</p>
                <p>If you have any questions or concerns about your order, please don't hesitate to contact us.</p>
                <p>Warm regards,</p>
                <p>The Herbal Zestfulness Team</p>
            </div>
        `
    };

    // Send the email
    await transporter.sendMail(mailOptions);
}

module.exports = {
    processPayment
};







