import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, Box } from '@mui/material';
import InformationPage from '../components/InformationPage';
import ShippingComponent from '../components/ShippingComponent';
import CartSummaryComponent from '../components/CartSummaryComponent';
import { useCart } from '../components/CartContext';
import BrandIcon from '../assets/brandIcon.png'
import PaymentComponent from '../components/PaymentComponent';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';



const stripePromise = loadStripe("pk_test_51OC5gnA3ZnEdtXgWBqwW0Pdm949JREok5NMnGqAbf7sJB8iFlwCtpkqUgqXHuQ86p9WBvQTZmE5VLIiWgAf2qRvc00dlTdOqZx");


const CheckoutPage = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [shippingDetails, setShippingDetails] = useState({});
    const steps = ['Cart', 'Information', 'Shipping', 'Payment'];
    const { cart, removeFromCart, adjustQuantity, notes } = useCart();
    const [shippingCost, setShippingCost] = useState('Calculated at Next Step');
    const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const tax = "Calculated at checkout";
    const [fullCost, setFullCost] = useState({});
    const [shippingOptions, setShippingOptions] = useState({});
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
    useEffect(() => {
        console.log(shippingOptions)

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

            // Step 1: Create the order in the database
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
                return;
            }


            const response = await fetch('http://localhost:8000/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cart, formData, fullCost }),
            });

            const session = await response.json();

            const stripe = await stripePromise;
            const result = await stripe.redirectToCheckout({
                sessionId: session.sessionId,
            });

            if (result.error) {
                // Handle any errors that occur during the redirect
                console.error(result.error.message);
            }
        } catch (error) {
            // Handle any errors that occur during the fetch
            console.error('Error during checkout:', error);
        }
    };

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
                                <Stepper activeStep={activeStep} alternativeLabel>
                                    {steps.map((label) => (
                                        <Step key={label}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                                {activeStep === 0 &&
                                    <Box sx={{ pt: 2.5, borderTop: '0.1px solid black', mt: 1 }}>
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
                                />}
                                {activeStep === 3 &&
                                    ''//REDIRECT TO STRIP PORTAL
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
