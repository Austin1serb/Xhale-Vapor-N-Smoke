import React, { useState, useEffect } from 'react';
import { Typography, Grid, Paper, List, ListItem, ListItemText, Divider, Button, CircularProgress, Box } from '@mui/material';

const ShippingComponent = ({ shippingDetails }) => {
    const [shippingOptions, setShippingOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const calculateShipping = async () => {
        try {
            setLoading(true);

            // This should be the URL of your backend endpoint that calls Shippo
            const backendUrl = 'http://localhost:8000/api/shippo';

            // Assuming your backend expects shipping details in this format

            // Assuming your backend expects shipping details in this format
            const shipmentDetails = {
                addressFrom: {
                    // You would replace these with your actual 'from' address details
                    "name": "Shawn Ippotle",
                    "company": "Shippo",
                    "street1": "215 Clayton St.",
                    "city": "San Francisco",
                    "state": "CA",
                    "zip": "94117",
                    "country": "US", // iso2 country code
                    "phone": "+1 555 341 9393",
                    "email": "shippotle@shippo.com",
                },
                addressTo: {
                    name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
                    street1: shippingDetails.address,
                    city: shippingDetails.city,
                    state: shippingDetails.state,
                    zip: shippingDetails.zip,
                    country: shippingDetails.country
                },

                parcel: {
                    // You would replace these with your actual package details
                    length: "5",
                    width: "5",
                    height: "5",
                    distance_unit: "in",
                    weight: "2",
                    mass_unit: "lb"
                }
            };
            console.log(shipmentDetails)
            // Make a POST request to your backend
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(shipmentDetails),
            });

            if (!response.ok) {
                const errorText = await response.text(); // Or response.json() if the response is in JSON format
                console.error(`HTTP Error: ${response.status} ${response.statusText}`, errorText);
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const result = await response.json();
            const sortedRates = result.rates.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));

            setShippingOptions(sortedRates); // Now sorted by cost
            setLoading(false);
            console.log(sortedRates);

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    useEffect(() => {
        if (shippingDetails && shippingDetails.address) { // Check that required details are present
            calculateShipping();
        }
    }, [shippingDetails]);



    return (
        <div>
            <Typography variant="h6" gutterBottom>
                Shipping Method
            </Typography>

            {/* Contact and Shipping Information */}
            <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
                <Typography variant="subtitle1">Contact</Typography>
                <Typography variant="body1">{shippingDetails.email}</Typography>
                <Divider style={{ margin: '10px 0' }} />
                <Typography variant="subtitle1">Ship to</Typography>
                <Typography variant="body1">{`${shippingDetails.address} ${shippingDetails.address2}, ${shippingDetails.city}, ${shippingDetails.state} ${shippingDetails.zip}, ${shippingDetails.country}`}</Typography>
            </Paper>
            {loading ? <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /> Getting Shipping Rates... </Box> : <Paper elevation={3} style={{ padding: '20px' }}>
                <List>
                    {/* This list would be populated with shipping options returned from your API */}
                    {/* Shipping Options */}
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <List>
                            {shippingOptions.map((option, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={option.servicelevel.name} secondary={`Estimated ${option.duration_terms}`} />
                                    <Typography variant="body2">${option.amount_local}</Typography>
                                    <Button variant="outlined">
                                        Select
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                    {/* ... other shipping options */}
                </List>
            </Paper>
            }
            {/* Shipping Options */}

            {/* Proceed to Payment Button */}
            <Grid container style={{ marginTop: '20px', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary">
                    Proceed to Payment
                </Button>
            </Grid>
        </div>
    );
};

export default ShippingComponent;
