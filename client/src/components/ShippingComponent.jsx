import React, { useState, useEffect } from 'react';
import { Typography, Grid, List, ListItem, ListItemText, Button, CircularProgress, Box, ListItemAvatar } from '@mui/material';
import '../Styles/CheckoutPage.css'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { format, addDays } from 'date-fns';
const ShippingComponent = ({ cartItems, shippingDetails, onShippingCostChange, setActiveStep, back, isLoading, onShippingOptionsChange, handleCheckout }) => {
    const [shippingOptions, setShippingOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [shippingCost, setShippingCost] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const [buttonDisabled, setButtonDisabled] = useState([]);
    const [lastAddress, setLastAddress] = useState({});
    let totalWeight = 0;
    let maxLength = 0;
    let maxWidth = 0;
    let maxHeight = 0;

    const defaultDimensions = {
        length: 5,
        width: 5,
        height: 5,
        weight: 2
    };

    cartItems.forEach(item => {
        // Use item dimensions if available, otherwise use default dimensions
        const itemLength = item.length || defaultDimensions.length;
        const itemWidth = item.width || defaultDimensions.width;
        const itemHeight = item.height || defaultDimensions.height;
        const itemWeight = item.weight || defaultDimensions.weight;

        totalWeight += itemWeight;
        maxLength = Math.max(maxLength, itemLength);
        maxWidth = Math.max(maxWidth, itemWidth);
        maxHeight = Math.max(maxHeight, itemHeight);
    });


    const calculateShippingDate = (estimatedDays) => {
        // Check for invalid or missing estimatedDays
        if (estimatedDays === null || estimatedDays === undefined || estimatedDays === '' || isNaN(estimatedDays)) {
            return 'Estimated delivery date not available'; // Fallback message
        }

        const currentDate = new Date();
        const shippingDate = addDays(currentDate, estimatedDays);
        return format(shippingDate, 'MMMM do, yyyy'); // Format date as "Month day, year"
    };

    const calculateShipping = async () => {

        if (JSON.stringify(lastAddress) === JSON.stringify(shippingDetails.address)) {
            // The address hasn't changed, no need to fetch new rates
            console.log('address has not changed')
            return;
        }
        try {
            setLoading(true);


            const backendUrl = 'http://localhost:8000/api/shippo';
            const shipmentDetails = {
                addressFrom: {

                    "name": "SAMI",
                    "company": "HERBAL ZESTFULNESS",
                    "street1": "5 lake st",
                    "city": "Kirkland",
                    "state": "Wa",
                    "zip": "98033",
                    "country": "US", // iso2 country code
                    "phone": "+1 425 285 9173",
                    "email": "genius.baar@gmail.com",
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
                    length: maxLength.toString(),
                    width: maxWidth.toString(),
                    height: maxHeight.toString(),
                    distance_unit: "in",
                    weight: totalWeight.toString(),
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
            //console.log(result)
            const sortedRates = result.rates.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));

            setShippingOptions(sortedRates); // Now sorted by cost
            setLastAddress(shippingDetails.address);
            setLoading(false);


        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    useEffect(() => {
        if (shippingDetails && shippingDetails.address) { // Check that required details are present
            calculateShipping();
        }
    }, [shippingDetails]);


    useEffect(() => {



        setButtonDisabled(new Array(shippingOptions.length).fill(false));
    }, [shippingOptions]);


    const handleSelectShippingOption = (cost, index) => {
        setShippingCost(cost);
        onShippingCostChange(cost); // Pass the cost to the parent component
        onShippingOptionsChange(shippingOptions[index]);
        console.log(shippingOptions[index])
        // Create a new array with all false, except the index that needs to be disabled
        const updatedDisabledState = buttonDisabled.map((item, idx) => idx === index);
        setButtonDisabled(updatedDisabledState);
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = shippingOptions.slice(indexOfFirstItem, indexOfLastItem);

    const goToNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        setCurrentPage(currentPage - 1);
    };
    const handleChangeContant = () => {
        setActiveStep(1);

    }

    return (
        <Box className='checkout-shipping-container'>


            {/* Contact and Shipping Information */}
            <Box className='checkout-shipping' >
                <Box className='checkout-shipping-contact' >
                    <Typography variant="subtitle1">Contact:</Typography>
                    <Box className='checkout-shipping-change'>
                        <Typography variant="body2" fontWeight={100}>{shippingDetails.phone}</Typography>
                        <Typography variant="body2" fontWeight={100}>{shippingDetails.email}</Typography>
                        <Button onClick={handleChangeContant} sx={{ fontSize: 12 }}>Change</Button>
                    </Box>
                </Box >
                <Box className='checkout-shipping-address '>
                    <Typography variant="subtitle1">Ship to:</Typography>
                    <Box className="checkout-shipping-change">
                        <Typography fontWeight={100} variant="body2">{shippingDetails.firstName + ' ' + shippingDetails.lastName} </Typography>
                        <Typography fontWeight={100} variant="body2">{`${shippingDetails.address} ${shippingDetails.address2}, ${shippingDetails.city}, ${shippingDetails.state} ${shippingDetails.zip}, ${shippingDetails.country}`} </Typography>
                        <Button onClick={handleChangeContant} sx={{ fontSize: 12 }}>Change</Button>
                    </Box>

                </Box>
            </Box>
            {loading ? <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
                Getting Shipping Rates...
            </Box> :
                <List>

                    {/* Shipping Options */}
                    <Typography variant="h6" >
                        Shipping Method
                    </Typography>
                    <Box >
                        <List>
                            {currentItems.map((option, index) => (
                                <ListItem
                                    key={index}
                                    sx={{
                                        backgroundColor: buttonDisabled[index] ? 'rgba(15, 117, 224, 0.1)' : '',

                                    }}
                                    className={`checkout-shipping-item-${+index}`}
                                >

                                    <div className='checkout-shipping-item-container'>
                                        <div >
                                            <ListItemText className='checkout-shipping-name' primary={option.servicelevel.name} secondary={`Estimated Delivery: ${calculateShippingDate(option.estimated_days)}`} />
                                            <ListItemAvatar >
                                                <img src={option.provider_image_75} alt="index" />
                                            </ListItemAvatar>
                                        </div>
                                        <div className='checkout-shipping-item-price-container'>
                                            <ListItemText className='checkout-shipping-price' primary={'$' + option.amount_local} />

                                            <Button disabled={buttonDisabled[index]} className='checkout-shipping-button' sx={{ fontSize: 12, minWidth: '80px', ml: 2 }} variant="outlined" onClick={() => handleSelectShippingOption(option.amount_local, index)}>
                                                {buttonDisabled[index] ? 'Selected' : 'Select'}
                                            </Button>
                                        </div>
                                    </div>
                                </ListItem>
                            ))}

                        </List>
                    </Box>
                    {/* Shipping Options Selector */}
                    <Grid container style={{ marginTop: '20px', justifyContent: 'space-between' }}>
                        {currentPage > 1 && (
                            <Button variant="contained" onClick={goToPreviousPage}>
                                Previous
                            </Button>
                        )}
                        {indexOfLastItem < shippingOptions.length && (
                            <Button variant="contained" onClick={goToNextPage}>
                                {currentPage === 1 ? 'See More Shipping Options' : 'Next'}
                            </Button>
                        )}
                    </Grid>

                </List>

            }


            {/* Proceed to Payment Button */}
            <Grid container style={{ marginTop: '20px', justifyContent: 'space-between' }}>

                <Button onClick={back} className='cart-checkout-button' variant="outlined" sx={{ m: 1, letterSpacing: 2, color: 'white', fontSize: 12, borderRadius: 0, backgroundColor: '#283047', height: 56.5, "&:hover": { backgroundColor: '#FE6F49', border: 'none', }, textAlign: 'center' }}>
                    <ArrowBackIosNewIcon sx={{ fontSize: 18, mr: 1 }} />
                    Return to information</Button>
                <Button disabled={isLoading} onClick={handleCheckout} variant="outlined" sx={{ m: 1, letterSpacing: 2, color: '#283047', borderRadius: 0, backgroundColor: 'white', fontSize: 12, borderColor: '#283047', borderWidth: 1.5, height: 55, '&:hover': { backgroundColor: '#0F75E0', color: 'white', } }}>
                    {isLoading ? (
                        <CircularProgress
                            size={24}
                            sx={{ color: '#0F75E0' }}
                        />
                    ) : (
                        <>
                            <span className='cartSummary-checkout-text'>Proceed to </span> Payment
                        </>
                    )}
                </Button>


            </Grid>
        </Box>
    );
};

export default ShippingComponent;
