import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, Box } from '@mui/material';
import InformationPage from '../components/InformationPage';
import ShippingComponent from '../components/ShippingComponent';
import CartSummaryComponent from '../components/CartSummaryComponent';
import { useCart } from '../components/CartContext';
import BrandIcon from '../assets/brandIcon.png'

import { useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import SquarePaymentForm from '../components/SquarePaymentForm';

const CheckoutPage = () => {
    const [isSquareSdkLoaded, setIsSquareSdkLoaded] = useState(false);
    const ACCESS_TOKEN = 'EAAAEKEBHSRt-NvJG7owA-Y_SzYZWIXl7-Wx7BZe11r7EaTUvr99xFr-uPfSePGv'
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(3);
    const [shippingDetails, setShippingDetails] = useState({});
    const steps = ['Cart', 'Information', 'Shipping', 'Payment'];
    const { cart, removeFromCart, adjustQuantity, notes } = useCart();
    const [shippingCost, setShippingCost] = useState('Calculated at Next Step');
    const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const tax = "Calculated at checkout";
    const [fullCost, setFullCost] = useState({});
    const [shippingOptions, setShippingOptions] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: ''
    });
    const loadSquareSdk = () => {
        const script = document.createElement('script');
        script.src = "https://web.squarecdn.com/v1/square.js";
        script.async = true;
        script.onload = () => setIsSquareSdkLoaded(true);
        document.body.appendChild(script);
    };

    useEffect(() => {
        if (activeStep === 3 && !isSquareSdkLoaded) {
            loadSquareSdk();
        }
    }, [activeStep, isSquareSdkLoaded]);

    const onPaymentProcess = (token) => {
        console.log("Payment token received:", token);
        // Here, you can add logic to send this token to your backend server
        // for further processing (like creating a charge)
    };


    useEffect(() => {
        //console.log(shippingOptions)

        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp < currentTime) {
                    // Token expired
                    navigate('/registration?returnUrl=/checkout');
                }
                // Token is valid, continue with checkout
            } catch (error) {
                // If error in decoding, token might be invalid
                navigate('/registration?returnUrl=/checkout');
            }
        } else {
            // No token found, redirect to registration
            navigate('/registration?returnUrl=/checkout');
        }
    }, [navigate]);

    const handleCheckout = async () => {
        setIsLoading(true); // Turn on loading state
        try {
            const orderData = {
                customer: localStorage.getItem('customerId'), // Assuming you have customer ID in formData
                customerEmail: formData.email || localStorage.getItem('userEmail'), // Assuming you have email in formData
                products: cart.map(item => ({
                    productId: item.product._id,
                    price: item.product.price,
                    quantity: item.quantity
                })),
                shippingMethod: {
                    provider: shippingOptions.provider,
                    price: shippingOptions.amount,
                    type: shippingOptions.servicelevel.name
                },
                totalAmount: fullCost,
                orderNotes: notes,
                address: `${shippingDetails.firstName} ${shippingDetails.lastName}, ${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state}, ${shippingDetails.zip}, ${shippingDetails.country}`,
                createdBy: localStorage.getItem('customerId'),
            }
            console.log(orderData)

            // Step 1: Create the order in the database and wait for it to complete
            const createdOrder = await createOrderAsync(orderData);

            if (createdOrder) {
                const updatedCustomerData = {
                    orders: createdOrder._id // Use the ID from the created order
                };

                // Make the PUT request asynchronously
                updateCustomerDataAsync(localStorage.getItem('customerId'), updatedCustomerData);
            }

            // Step 2: Call your backend to create a Square checkout session
            const baseUrl = window.location.origin; // This gets your app's base URL (e.g., http://localhost:3000 or your production URL)
            const successUrl = `${baseUrl}/success`;
            const customerId = orderData.customer
            console.log({ cart, formData, fullCost, baseUrl, successUrl, customerId })
            const response = await fetch('http://localhost:8000/api/payment/create-checkout-session', {
                method: 'POST',
                headers: {
                    //'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({ cart, formData, fullCost, successUrl, customerId }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }


            const checkoutData = await response.json();
            if (checkoutData && checkoutData.payment) {
                // Redirect the user to the Square Checkout URL
                window.location.href = checkoutData.paymentLinkUrl;


            } else {
                // Handle error: checkout session creation failed
                console.error('Error creating checkout session', response.error);
            }
        }
        catch (error) {
            console.error('Error during checkout:', error);

            // Check if the error object has a 'response' property
            if (error.response) {
                try {
                    const errorDetails = await error.response.json();
                    console.error('Error details:', errorDetails);
                } catch (jsonError) {
                    console.error('Error reading error response:', jsonError);
                }
            } else {
                // If there's no response attached, log the entire error object
                console.error('Error object:', error);
            }
        }
        finally {
            setIsLoading(false); // Turn off loading state
        }
    }

    const createOrderAsync = async (orderData) => {
        try {
            const orderResponse = await fetch('http://localhost:8000/api/order/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const createdOrder = await orderResponse.json();
            if (!createdOrder || orderResponse.status !== 200) {
                console.error('Error creating order:', createdOrder.message);
                setIsLoading(false)
                return null; // Return null if order creation fails
            }

            return createdOrder; // Return the created order

        } catch (error) {
            console.error('Error creating order asynchronously:', error);
            setIsLoading(false)
            return null; // Return null in case of error
        }
    };


    const updateCustomerDataAsync = async (customerId, data) => {
        try {
            await fetch(`http://localhost:8000/api/customer/${customerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            // Optionally handle the response or errors
        } catch (error) {
            console.error('Error updating customer data:', error);
            // Handle errors or log them, as per your application's needs
        }
    }

    const handleFormChange = (name, value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));

    }



    const handleShippingCostChange = (cost) => {
        setShippingCost(cost);
    };

    const handleShippingDetailsSubmit = (details) => {
        setFormData(details);
        setShippingDetails(details);
        console.log(formData)
    };

    const handleShippingOptions = (options) => {
        setShippingOptions(options);

    };


    const handleNext = () => {

        setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, steps.length - 1));
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
    };

    const handleReset = () => {
        setActiveStep(0);
    };
    const stepperStyles = {
        position: { xs: 'fixed', sm: 'relative' }, // 'fixed' on xs screens, 'relative' otherwise
        top: { xs: 0, sm: 'auto' }, // Stick to the top on xs screens
        zIndex: { xs: 10000, sm: 'auto' }, // Ensure it's above other content
        pt: { xs: 5, sm: 0 },
        pb: { xs: 1, sm: 0 },
        width: { xs: '100%' }, // Full width on xs screens
        bgcolor: { xs: 'background.paper' }, // Add background color for visibility
        borderBottom: '0.1px solid black',

    };



    return (
        <div className='checkoutPage-container'>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', md: 'row' } }}>
                <div style={{ flex: 1 }}>
                    {activeStep === steps.length ? (
                        <div>
                            <Typography sx={{ mt: 1, mb: 1 }}>
                                All steps completed - you&apos;re finished
                            </Typography>
                            <Button onClick={handleReset}>Reset</Button>
                        </div>
                    ) : (
                        <div>
                            <div>
                                {/*<div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                    <img src={BrandIcon} alt="Brand Logo" style={{ width: '100px' }} loading='lazy' />
                                </div>*/}
                                {/* Stepper */}
                                <Stepper activeStep={activeStep} alternativeLabel sx={stepperStyles}>
                                    {steps.map((label) => (
                                        <Step key={label}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                                {activeStep === 0 &&
                                    <Box sx={{ pt: { xs: 0, sm: 2.5 }, borderTop: '0.1px solid black', mt: { xs: 0, sm: 1 } }}>
                                        <CartSummaryComponent
                                            cartItems={cart.map(item => ({
                                                _id: item.product._id,
                                                img: item.product.imgSource[0].url,
                                                name: item.product.name,
                                                quantity: item.quantity,
                                                price: item.product.price,
                                                specs: item.product.specs,
                                            }))}
                                            shippingCost={shippingCost}
                                            tax={tax}
                                            total={total}
                                            removeFromCart={removeFromCart}
                                            adjustQuantity={adjustQuantity}
                                            next={handleNext}
                                            step={activeStep}
                                            setFullCost={setFullCost}

                                        />
                                    </Box>
                                }
                                {activeStep === 1 && <InformationPage
                                    back={handleBack}
                                    next={handleNext}
                                    onShippingDetailsSubmit={handleShippingDetailsSubmit}
                                    formData={formData}
                                    onFormChange={handleFormChange}
                                />}
                                {activeStep === 2 && <ShippingComponent
                                    setActiveStep={setActiveStep}
                                    cartItems={cart.map(item => ({
                                        _id: item.product._id,
                                        weight: item.product.shipping.weight,
                                        length: item.product.shipping.dimensions.length,
                                        width: item.product.shipping.dimensions.width,
                                        height: item.product.shipping.dimensions.height,
                                    }))}
                                    shippingDetails={shippingDetails}
                                    onShippingCostChange={handleShippingCostChange}
                                    formData={formData}
                                    back={handleBack}
                                    next={handleNext}
                                    onShippingOptionsChange={handleShippingOptions}
                                    handleCheckout={handleCheckout}
                                    isLoading={isLoading}
                                />}
                                {activeStep === 3 && isSquareSdkLoaded &&
                                    <SquarePaymentForm onPaymentProcess={onPaymentProcess} />
                                }

                            </div>
                            <div>
                                <Button disabled={activeStep === 0} onClick={handleBack}>
                                    Back
                                </Button>
                                <Button onClick={handleNext}>
                                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                {/* if cart summary doesnt equal 0 then display it */}
                {/* else dont display it */}
                {/* Cart Summary Component */}
                {activeStep !== 0 && cart.length !== 0 ?
                    <div style={{ flex: 1, }}>
                        {/* Cart Summary Component */}
                        <CartSummaryComponent
                            cartItems={cart.map(item => ({
                                _id: item.product._id,
                                img: item.product.imgSource[0].url,
                                name: item.product.name,
                                quantity: item.quantity,
                                price: item.product.price,
                                specs: item.product.specs,
                            }))}
                            shippingCost={shippingCost}
                            tax={tax}
                            total={total}
                            removeFromCart={removeFromCart}
                            adjustQuantity={adjustQuantity}
                            setFullCost={setFullCost}
                            handleCheckout={handleCheckout}
                        />
                    </div>
                    : null}
            </Box>
            ;
        </div>
    );
};

export default CheckoutPage;
