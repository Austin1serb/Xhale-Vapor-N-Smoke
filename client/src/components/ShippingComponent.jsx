import React, { useState, useEffect } from 'react';
import { Typography, Grid, List, ListItem, ListItemText, Button, CircularProgress, Box, ListItemAvatar } from '@mui/material';
import '../Styles/CheckoutPage.scss'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { format, addDays } from 'date-fns';
import ShippingDetailsComponent from './ShippingDetailsComponent';
const ShippingComponent = ({ cartItems, shippingDetails, onShippingCostChange, back, isLoading, onShippingOptionsChange, handleCheckout, setEstimatedShipping, lastAddress, setLastAddress, shipmentOptions, setShipmentOptions, fullCost, setShippingDetails }) => {


    const [shippingOptions, setShippingOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    //const [shippingCost, setShippingCost] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const [buttonDisabled, setButtonDisabled] = useState([]);
    const [isShippingOptionSelected, setIsShippingOptionSelected] = useState(false);
    const [checkoutError, setCheckoutError] = useState('');

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
        const itemWeight = item.weight * item.quantity;

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


        if (JSON.stringify(lastAddress) === JSON.stringify(shippingDetails)) {
            // The address hasn't changed, no need to fetch new rates
            setShippingOptions(shipmentOptions);
            return;
        }
        try {
            setLoading(true);


            const backendUrl = 'http://localhost:8000/api/shippo';
            const shipmentDetails = {

                addressTo: {
                    name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
                    street1: shippingDetails.address,
                    street2: shippingDetails.address2,
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
                    mass_unit: "oz"
                }
            };

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
            else {
                const result = await response.json();

                let sortedRates = result.rates.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
                if (fullCost.subTotal > 50 || fullCost.subTotal <= 0.03) {
                    sortedRates = sortedRates.map(rate => ({
                        ...rate,
                        amount_local: parseFloat(rate.amount_local) < 10 ? 0.00 : rate.amount_local,
                        isFree: parseFloat(rate.amount_local) < 10
                    }));
                }
                setShippingOptions(sortedRates); // sorted by cost
                setLastAddress(shippingDetails);
                setShipmentOptions(sortedRates);

            }

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (shippingDetails && shippingDetails.address) { // Check that required details are present
            calculateShipping();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };
    // Scroll to the top when the component mounts
    useEffect(() => {
        scrollToTop();
    }, []);

    useEffect(() => {
        setButtonDisabled(new Array(shippingOptions.length).fill(false));
    }, [shippingOptions]);

    const handleSelectShippingOption = (cost, index) => {
        const formattedShipping = currentItems.map((option,) => (calculateShippingDate(option.estimated_days)))
        // Check if the selected option is free
        if (shippingOptions[index].isFree) {
            cost = 0.00;
        }

        //setShippingCost(cost);
        onShippingCostChange(cost); // Pass the cost to the parent component
        //Pass the selected shipping option to the parent component
        onShippingOptionsChange(shippingOptions[index]);

        setEstimatedShipping(formattedShipping[index]);

        // Create a new array with all false, except the index that needs to be disabled
        const updatedDisabledState = buttonDisabled.map((item, idx) => idx === index);
        setButtonDisabled(updatedDisabledState);
        setIsShippingOptionSelected(true);
        shippingOptions[index].parcel = {
            length: maxLength.toString(),
            width: maxWidth.toString(),
            height: maxHeight.toString(),
            distance_unit: "in",
            weight: totalWeight.toString(),
            mass_unit: "oz"
        }

        setShippingDetails({ ...shippingOptions[index], ...shippingDetails });

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




    const handleLocalCheckout = () => {
        if (!isShippingOptionSelected) {
            setCheckoutError('Please select a shipping option to proceed.');
            return;
        }
        handleCheckout();
    };

    return (
        <Box className='checkout-shipping-container'>


            <ShippingDetailsComponent
                shippingDetails={shippingDetails}
                back={back}

            />
            {loading ? <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
                Getting Shipping Rates...
            </Box> :
                <List>

                    {/* Shipping Options */}
                    <Typography variant="h6" >
                        Shipping Method
                    </Typography>
                    {checkoutError && (
                        <Typography color="error" style={{ margin: '10px 0' }}>
                            {checkoutError}
                        </Typography>
                    )}

                    <Box >
                        <List>
                            {currentItems.map((option, index) => (
                                <ListItem
                                    key={index}
                                    style={{
                                        backgroundColor: buttonDisabled[index] ? 'rgba(15, 117, 224, 0.1)' : '',
                                        borderColor: checkoutError ? '#D23030' : ''

                                    }}
                                    className={`checkout-shipping-item-${+index}`}
                                >

                                    <div className='checkout-shipping-item-container'>
                                        <div >
                                            <ListItemText className='checkout-shipping-name' primary={option.servicelevel.name} secondary={`Est. Delivery: ${calculateShippingDate(option.estimated_days)}`} />
                                            <ListItemAvatar >
                                                <img src={option.provider_image_75} alt="index" />
                                            </ListItemAvatar>
                                        </div>
                                        <div className='checkout-shipping-item-price-container'>
                                            <ListItemText className='checkout-shipping-price' primary={option.isFree ? 'Free' : '$' + option.amount_local} style={{ marginRight: '5px' }} />


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
            <Grid container sx={{ marginTop: '20px', justifyContent: 'space-between', display: 'flex', width: '100%' }} className='information-buttons'>

                <Button onClick={back} variant="outlined" sx={{ width: '45%', m: 0, letterSpacing: 2, color: '#283047', backgroundColor: 'white', borderColor: '#283047', borderWidth: 1.5, height: 55, '&:hover': { backgroundColor: '#0F75E0', color: 'white', } }}>
                    <ArrowBackIosNewIcon sx={{ fontSize: 18, mr: 1, }} />
                    <span className='cartSummary-checkout-text2'>Return</span>
                    <span className='cartSummary-checkout-text'>Return to information</span></Button>
                <Button disabled={!!isLoading} onClick={handleLocalCheckout} variant="outlined" sx={{ width: '45%', m: 0, letterSpacing: 2, color: 'white', backgroundColor: '#283047', height: 56.5, "&:hover": { backgroundColor: '#FE6F49', border: 'none', }, textAlign: 'center' }}>
                    {isLoading ? (
                        <CircularProgress
                            size={24}
                            sx={{ color: '#0F75E0' }}
                        />
                    ) : (
                        <>

                            <span className='cartSummary-checkout-text2'>Payment</span>
                            <span className='cartSummary-checkout-text'>Proceed to Payment</span>
                        </>
                    )}
                    <ArrowForwardIosIcon sx={{ fontSize: 18, ml: 1, color: 'white', }} />
                </Button>
            </Grid>
        </Box>
    );
};

export default ShippingComponent;
