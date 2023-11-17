const square = require('square');
const { v4: uuidv4 } = require('uuid');

//const { Client, Environment, ApiError } = require("square");

//const client = new Client({
//    accessToken: process.env.SQUARE_ACCESS_TOKEN,
//    environment: Environment.Sandbox,
//    customUrl: 'http://localhost:8000'
//});

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






const processPayment = async (req, res) => {
    const { sourceId, amount } = req.body; // sourceId is the payment source, e.g., card nonce

    try {
        const response = await paymentsApi.createPayment({
            sourceId: sourceId,
            idempotencyKey: uuidv4(),
            amountMoney: {
                amount: amount, // amount in cents
                currency: 'USD'
            }
        });

        console.log(response.result);
        res.json(response.result);
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: error.errors });
    }
};






const createCheckoutSession = async (req, res) => {
    const { cart, formData, fullCost, successUrl, customerId } = req.body;

    // Convert cart items to Square line items
    const lineItems = cart.map(item => ({
        uid: uuidv4(),
        name: item.product.name,
        note: item.product.specs,
        quantity: item.quantity.toString(),
        basePriceMoney: {
            amount: Math.round(item.product.price * 100), //
            currency: 'USD'
        },

        // Include other fields like 'note', 'variationName' as per your data
    }));

    // Include shipping and tax in lineItems if applicable
    // ...

    try {
        const idempotencyKey = uuidv4(); // Generate a unique idempotency key

        const requestBody = {
            idempotencyKey: idempotencyKey,
            description: "HERBAL ZESTFULLNESS",
            order: {
                locationId: 'LKA5ZTW9TZXCM',
                customerId: customerId, // Set the customer ID
                lineItems: lineItems,
                state: 'OPEN',

            },
            prePopulatedData: {
                buyerEmail: formData.email,
                //buyerPhoneNumber: formData.phone ? formData.phone : '',
                buyerAddress: {
                    addressLine1: formData.address,
                    addressLine2: formData.address2,
                    locality: formData.city,
                    administrativeDistrictLevel1: formData.state,
                    postalCode: formData.zip,
                    country: formData.country,
                    firstName: formData.firstName,
                    lastName: formData.lastName
                }
            }
        };
        //console.log("Request body to Square:", JSON.stringify(requestBody, null, 2));

        const { result } = await client.checkoutApi.createPaymentLink(requestBody);
        res.json({ paymentLinkUrl: result.paymentLink.url });
    }
    catch (error) {
        console.error('Error creating Square payment link:', error);
        res.status(500).json({ message: 'Error processing payment', error: error.message, details: error.response ? error.response.body : null });
    }

};
module.exports = {
    processPayment,
    createCheckoutSession
};







