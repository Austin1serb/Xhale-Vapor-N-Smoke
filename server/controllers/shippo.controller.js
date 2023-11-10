const shippo = require('shippo')(process.env.SHIPPO_API_TOKEN);

// Controller to create a Shippo address
exports.createAddress = (req, res) => {
    const { addressFrom, addressTo, parcel } = req.body;

    const shipment = {
        address_from: addressFrom,
        address_to: addressTo,
        parcels: [parcel], // Note that parcels is an array
    };

    shippo.shipment.create(shipment)
        .then(shipmentResponse => {
            res.json(shipmentResponse);
        })
        .catch(err => {
            console.log('Shipment data being sent:', shipment);
            console.error('Error creating shipment with Shippo:', err);
            res.status(500).send(err.message);
        });
};


