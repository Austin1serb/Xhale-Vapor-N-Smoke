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
import LoadingModal from '../components/Common/LoadingModal';
import { set } from 'date-fns';

const CheckoutPage = () => {
    const [isSquareSdkLoaded, setIsSquareSdkLoaded] = useState(false);
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [shippingDetails, setShippingDetails] = useState({});
    const steps = ['Cart', 'Information', 'Shipping', 'Payment'];
    const { cart, removeFromCart, adjustQuantity, notes, clearCart } = useCart();
    const [shippingCost, setShippingCost] = useState('Calculated at Next Step');
    const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const tax = "Calculated at checkout";
    const [fullCost, setFullCost] = useState({});
    const [shippingOptions, setShippingOptions] = useState({});
    const [shipmentOptions, setShipmentOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [orderData, setOrderData] = useState({})
    const [estimatedShipping, setEstimatedShipping] = useState('')
    const [lastAddress, setLastAddress] = useState({});
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

    const isGuestUser = () => {
        return localStorage.getItem('isGuest') === 'true';
    };



    const loadSquareSdk = () => {
        setIsSquareSdkLoaded(false)


        const script = document.createElement('script');
        script.src = "https://js.squareupsandbox.com";
        script.type = "text/javascript";
        script.async = false;
        script.onload = () => setIsSquareSdkLoaded(true);
        document.body.appendChild(script);
    };

    useEffect(() => {
        if (activeStep === 3 && !isSquareSdkLoaded) {
            loadSquareSdk();
        }

    }, [activeStep, isSquareSdkLoaded]);


    const onPaymentProcess = (paymentToken) => {
        console.log("Payment paymentToken received:", paymentToken);
        finalizeOrderAndProcessPayment(paymentToken)
    };


    const finalizeOrderAndProcessPayment = async (paymentToken) => {
        setIsLoading(true);
        try {
            console.log(fullCost);

            // Convert amount to cents 
            const paymentAmount = Math.round(fullCost.grandTotal * 100);


            // First, process the payment with Square
            if (paymentToken) {

                const paymentResponse = await fetch('http://localhost:8000/api/payment/process-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sourceId: 'cnon:card-nonce-ok', // or sourceId: paymentToken.token,
                        amount: paymentAmount,

                        cost: fullCost,
                        notes: notes,
                        estimatedShipping: estimatedShipping,
                        orderDetails: orderData,
                        last4: paymentToken.details.card.last4
                    }),
                });

                const paymentResult = await paymentResponse.json();
                console.log(paymentResult);

                // Check if payment was successful
                if (paymentResponse.ok && paymentResult.success === true) {
                    orderData.transactionId = paymentResult.response.result.payment.id;
                    if (isGuestUser()) {
                        orderData.createdBy = localStorage.getItem('customerId'); // ID of the guest user
                        orderData.createdByType = 'Guest';
                    } else {
                        orderData.createdBy = localStorage.getItem('customerId'); // ID of the registered user
                        orderData.createdByType = 'Customer';
                    }
                    // Now, create the order in the database
                    const createdOrder = await createOrderAsync(orderData);
                    if (!isGuestUser()) {
                        // Update customer data for registered users
                        const updatedCustomerData = { orders: createdOrder._id };
                        await updateCustomerDataAsync(localStorage.getItem('customerId'), updatedCustomerData);
                    } else {
                        // Update guest data for guest users
                        const guestData = { orders: createdOrder._id };
                        await updateGuestDataAsync(localStorage.getItem('customerId'), guestData);
                        localStorage.removeItem('customerId')
                        localStorage.removeItem('isGuest')
                    }
                    clearCart()
                    // Navigate to success page after all processes are complete
                    navigate('/success', { state: { paymentDetails: paymentResult } });
                } else {
                    // Handle payment processing failure
                    console.error('Payment processing failed:', paymentResult);
                }
            } else {
                console.error('Missing payment token');
            }
        } catch (error) {
            console.error('Error during finalizing order and payment:', error);
        } finally {
            setIsLoading(false); // Stop loading state after all processes are complete or an error occurs
        }
    };



    useEffect(() => {
        const token = localStorage.getItem('token');
        const customerId = localStorage.getItem('customerId');

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp < currentTime) {
                    // Token expired
                    navigate('/login?returnUrl=/checkout');
                } else {
                    // Token is valid, continue with checkout
                }
            } catch (error) {
                // If error in decoding, token might be invalid
                navigate('/registration?returnUrl=/checkout');
            }
        } else if (customerId) {
            // CustomerId is present, treat as a valid session for checkout
            // No additional action needed here, continue with checkout
        } else {
            // No token and no customerId found, redirect to registration
            navigate('/registration?returnUrl=/checkout');
        }
    }, [navigate]);




    const handleCheckout = async () => {
        console.log('checking out')
        setIsLoading(true); // Turn on loading state
        const customerId = localStorage.getItem('customerId')
        const customerEmail = localStorage.getItem('userEmail')
        setOrderData({
            customer: customerId,
            customerEmail: formData.email || customerEmail,
            products: cart.map(item => ({
                name: item.product.name,
                productId: item.product._id,
                price: item.product.price,
                quantity: item.quantity,
                img: item.product.imgSource[0].url
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
        })
        console.log(orderData)
        setIsLoading(false)
        handleNext();
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
            setIsLoading(false);
            // Optionally handle the response or errors
        } catch (error) {
            setIsLoading(false)
            console.error('Error updating customer data:', error);
            // Handle errors or log them, as per your application's needs
        }
    }
    const updateGuestDataAsync = async (customerId, data) => {
        try {
            await fetch(`http://localhost:8000/api/guest/${customerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            setIsLoading(false);
            // Optionally handle the response or errors
        } catch (error) {
            setIsLoading(false)
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
        borderBottom: { xs: '0.1px solid black', sm: 'none' },

    };



    return (
        <div className='checkoutPage-container'>
            <LoadingModal open={isLoading} message="Your payment is being processed" />
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', md: 'row' } }}>
                <div style={{ flex: 1 }}>

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
                                setEstimatedShipping={setEstimatedShipping}
                                lastAddress={lastAddress}
                                setLastAddress={setLastAddress}
                                shipmentOptions={shipmentOptions}
                                setShipmentOptions={setShipmentOptions}
                            />}
                            {activeStep === 3 && isSquareSdkLoaded &&
                                <SquarePaymentForm
                                    onPaymentProcess={onPaymentProcess}
                                    paymentForm={window.SqPaymentForm}
                                    shippingDetails={shippingDetails}
                                    back={handleBack}


                                />
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

                </div>
                {/* if cart summary doesnt equal 0 then display it */}
                {/* else dont display it */}
                {/* Cart Summary Component */}
                {activeStep !== 0 && cart.length !== 0 ?
                    <div style={{ flex: 0.9, }}>
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
