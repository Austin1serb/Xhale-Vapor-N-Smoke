const shippo = require('shippo')(process.env.SHIPPO_API_TOKEN);
const nodemailer = require('nodemailer');



let transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service provider
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD

    }
});


// Controller to create a Shippo address
exports.createAddress = (req, res) => {
    const { addressTo, parcel } = req.body;

    const shipment = {
        address_from: {
            "name": "SAMI",
            "company": "Herba Natural",
            "street1": "5 lake st",
            "city": "Kirkland",
            "state": "Wa",
            "zip": "98033",
            "country": "US", // iso2 country code
            "phone": "+1 206 717 4141",
            "email": "genius.baar@gmail.com",
        },

        address_to: addressTo,
        parcels: [parcel],
    };

    shippo.shipment.create(shipment)
        .then(shipmentResponse => {
            res.json(shipmentResponse);
        })
        .catch(err => {

            console.error('Error creating shipment with Shippo:', err);
            res.status(500).send(err.message);
        });
};



exports.createShippoLabel = async (req, res) => {

    const addressFrom = {

        "name": "SAMI",
        "company": "Herba Natural",
        "street1": "5 lake st",
        "city": "Kirkland",
        "state": "Wa",
        "zip": "98033",
        "country": "US", // iso2 country code
        "phone": "+1 206 717 4141",
        "email": "genius.baar@gmail.com",
    }

    try {
        // Assuming orderDetails contains necessary shipment information
        const { shippingDetails } = req.body;

        const shipment = {
            address_from: addressFrom,
            address_to: {
                name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
                street1: shippingDetails.address,
                street2: shippingDetails.address2,
                city: shippingDetails.city,
                state: shippingDetails.state,
                zip: shippingDetails.zip,
                country: shippingDetails.country,
            },
            carrier_account: shippingDetails.carrier_account,
            parcels: shippingDetails.parcel,
        };

        const label = await shippo.transaction.create({
            shipment: shipment,
            carrier_account: shippingDetails.carrier_account,
            servicelevel_token: shippingDetails.servicelevel.token,
            label_file_type: 'PDF',
        });

        res.json(label); // Send the label data back to the client
    } catch (error) {
        console.error('Error creating shipping label:', error);
        res.status(500).send({ error: 'Error creating shipping label' }); // Send an error response
    }
};