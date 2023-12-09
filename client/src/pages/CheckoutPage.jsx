import React, { useState, useEffect } from 'react';
import { Stepper, Step, StepLabel, Box, Snackbar, Alert, IconButton, CircularProgress, Modal, Button } from '@mui/material';
import InformationPage from '../components/InformationPage';
import ShippingComponent from '../components/ShippingComponent';
import CartSummaryComponent from '../components/CartSummaryComponent';
import { useCart } from '../components/CartContext';
import { useNavigate, useParams, Link } from 'react-router-dom';
import SquarePaymentForm from '../components/SquarePaymentForm';
import LoadingModal from '../components/Common/LoadingModal';
import { useAuth } from '../components/Utilities/useAuth';
import ShippingDetailsComponent from '../components/ShippingDetailsComponent';
import BrandIcon from '../assets/cbdtextwicon.webp'
import '../Styles/CheckoutPage.css'

const CheckoutPage = () => {
    useEffect(() => {
        document.title = "Checkout - Complete Your Herba Naturals Purchase";
        document.querySelector('meta[name="description"]').setAttribute("content", "Secure checkout process for your Herba Naturals purchases. Complete your order of premium CBD products quickly and safely.");
    }, []);


    const [isSquareSdkLoaded, setIsSquareSdkLoaded] = useState(false);
    const navigate = useNavigate();
    const { step } = useParams();
    const activeStep = parseInt(step) - 1;
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
    const { isLoggedIn } = useAuth();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [paymentError, setPaymentError] = useState('')
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);


    const handleOpenSnackbar = () => {
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return; // Do not close if the user clicks away
        }
        setSnackbarOpen(false);
    };

    const handleBrandIconClick = () => {
        setOpenConfirmDialog(true);
    };
    const handleConfirmNavigation = () => {
        navigate('/'); // navigate to home
    };

    const handleCloseDialog = () => {
        setOpenConfirmDialog(false);
    };



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
        const customerId = localStorage.getItem('customerId');
        const isGuestFlag = localStorage.getItem('isGuest') === 'true';

        return (customerId && customerId.startsWith('guest-')) || isGuestFlag;

    };





    const loadSquareSdk = () => {
        setIsSquareSdkLoaded(false);

        const script = document.createElement('script');
        script.src = "https://web.squarecdn.com/v1/square.js"; // URL for production
        script.type = "text/javascript";
        script.async = false;
        script.onload = () => setIsSquareSdkLoaded(true);
        script.onerror = () => {
            // Handle error loading the script
            console.error('Failed to load Square SDK');
            // Optionally, update the state to reflect the error
        };
        document.body.appendChild(script);
    };

    const cleanupSquareSdk = () => {
        // Remove the Square SDK script from the DOM
        const squareScript = document.querySelector('script[src="https://web.squarecdn.com/v1/square.js"]');
        if (squareScript) {
            document.body.removeChild(squareScript);
        }

        // Reset any related state variables if necessary
        setIsSquareSdkLoaded(false);

        // Additional cleanup tasks if required

    };

    useEffect(() => {
        if (activeStep === 3 && !isSquareSdkLoaded) {
            loadSquareSdk();
        } else if (activeStep !== 3) {
            cleanupSquareSdk()
        }
        if (activeStep === 0 && isGuestUser()) {
            handleOpenSnackbar();
        }
    }, [activeStep, isSquareSdkLoaded]);


    const onPaymentProcess = (paymentToken) => {
        finalizeOrderAndProcessPayment(paymentToken)
    };



    const finalizeOrderAndProcessPayment = async (paymentToken) => {
        setIsLoading(true);
        try {

            // Convert amount to cents 
            const paymentAmount = Math.round(fullCost.grandTotal * 100);


            // First, process the payment with Square
            if (paymentToken) {

                const trackingInfo = await createShippingLabelAsync(shippingDetails);
                orderData.shippingMethod = {
                    ...orderData.shippingMethod,
                    carrier: trackingInfo.rate.provider,
                    trackingNumber: trackingInfo.tracking_number,
                    trackingUrl: trackingInfo.tracking_url_provider,
                    labelUrl: trackingInfo.label_url,
                    estimatedShipping: estimatedShipping
                };

                //MAKE PAYMENT
                const paymentResult = await processPaymentAsync(paymentToken, paymentAmount, orderData)



                // Check if payment was successful
                if (paymentResult.success === true) {
                    orderData.transactionId = paymentResult.response.result.payment.id;
                    orderData.paymentStatus = 'Paid';


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
                        const isVerified = localStorage.getItem('isVerified')
                        localStorage.clear();
                        localStorage.setItem('isVerified', isVerified)
                    }

                    clearCart()
                    // Navigate to success page after all processes are complete
                    navigate('/success', { state: { paymentResult: paymentResult } });
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
        const customerId = localStorage.getItem('customerId');
        const isGuest = isGuestUser();

        if (!isLoggedIn && !isGuest) {
            // Redirect to registration if not logged in and not a guest
            navigate('/registration?returnUrl=/checkout/1');
        } else if (!customerId && !isGuest) {
            // Redirect to login if no customerId and not a guest
            navigate('/login?returnUrl=/checkout/1');
        } else {
            // Proceed with checkout logic for logged-in or guest users
        }
    }, [isLoggedIn, navigate]);






    const handleCheckout = async () => {
        setIsLoading(true); // Turn on loading state
        const customerId = localStorage.getItem('customerId')
        const customerEmail = localStorage.getItem('userEmail')
        setOrderData({
            customer: customerId,
            customerEmail: formData.email || customerEmail,
            //customer phone 
            customerPhone: shippingDetails.phone,
            products: cart.map(item => ({
                name: item.product.name,
                productId: item.product._id,
                price: item.product.price,
                quantity: item.quantity,
                img: item.product.imgSource[0].url
            })),
            shippingMethod: {
                provider: shippingOptions.provider,
                carrierAccountId: shippingOptions.carrier_account,
                serviceLevelToken: shippingOptions.servicelevel.token,
                price: shippingOptions.amount,
                amountCharged: shippingOptions.amount_local,
                type: shippingOptions.servicelevel.name

            },
            totalAmount: fullCost,
            orderNotes: notes,
            address: `${shippingDetails.firstName} ${shippingDetails.lastName}, ${shippingDetails.address}, ${shippingDetails.address2 ? shippingDetails.address2 : ''}, ${shippingDetails.city}, ${shippingDetails.state}, ${shippingDetails.zip}, ${shippingDetails.country}`,
            createdBy: localStorage.getItem('customerId'),
        })
        setIsLoading(false)
        handleNext();
    }


    const processPaymentAsync = async (paymentToken, paymentAmount, orderData) => {
        try {
            const response = await fetch('http://localhost:8000/api/payment/process-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sourceId: paymentToken.token, //'cnon:card-nonce-ok', // or sourceId: paymentToken.token,
                    amount: paymentAmount,
                    cost: fullCost, // Ensure 'fullCost' is defined in your context
                    notes: notes, // Ensure 'notes' is defined in your context
                    estimatedShipping: estimatedShipping, // Ensure 'estimatedShipping' is defined in your context
                    orderDetails: orderData,
                    last4: paymentToken.details.card.last4
                }),
            });

            if (!response.ok) {
                throw new Error(`Payment processing failed: HTTP ${response.status} - ${await response.text()}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error processing payment:', error);
            setPaymentError('There was a problem processing your payment')
            return null; // Return null in case of error
        }
    };






    const createOrderAsync = async (orderData) => {
        try {
            const orderResponse = await fetch('http://localhost:8000/api/order/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(orderData),
            });

            const createdOrder = await orderResponse.json();
            if (!createdOrder || orderResponse.status !== 200) {
                console.error('Error creating order:', createdOrder.message);

                return null; // Return null if order creation fails
            }
            return createdOrder; // Return the created order
        } catch (error) {
            console.error('Error creating order asynchronously:', error);
            return null; // Return null in case of error
        }
    };

    const createShippingLabelAsync = async (shippingDetails) => {
        try {
            const backendUrl = 'http://localhost:8000/api/shippo/create';
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ shippingDetails }),
            });

            if (!response.ok) {
                const errorText = await response.text(); // Or response.json() if the response is in JSON format
                console.error(`HTTP Error: ${response.status} ${response.statusText}`, errorText);
                throw new Error(`HTTP Error: ${response.status}`);
            } else {
                const result = await response.json();

                return result

            }
        } catch (error) {
            console.error('Error creating shipping label:', error);

        }
    };

    const updateCustomerDataAsync = async (customerId, data) => {
        try {
            await fetch(`http://localhost:8000/api/customer/${customerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });
            // Optionally handle the response or errors
        } catch (error) {
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
                credentials: 'include',
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
    };

    const handleShippingOptions = (options, info) => {
        setShippingOptions(options, info);

    };

    useEffect(() => {
        // If the URL step is not valid, redirect to the first step
        if (isNaN(activeStep) || activeStep < 0 || activeStep >= steps.length) {
            navigate('/checkout/1');
        }
    }, [activeStep, steps.length, navigate]);



    const handleNext = () => {
        navigate(`/checkout/${activeStep + 2}`); // Navigate to the next step
    };

    const handleBack = () => {
        navigate(`/checkout/${activeStep}`); // Navigate to the previous step
    };






    const stepperStyles = {
        position: { xs: 'fixed', sm: 'relative' }, // 'fixed' on xs screens, 'relative' otherwise
        top: { xs: 0, sm: 'auto' }, // Stick to the top on xs screens
        zIndex: { xs: 10000, sm: 'auto' }, // Ensure it's above other content
        pt: { xs: 6, sm: 0 },
        pb: { xs: 1, sm: 0 },
        width: { xs: '100%' }, // Full width on xs screens
        bgcolor: { xs: 'background.paper' }, // Add background color for visibility
        borderBottom: { xs: '0.1px solid black', sm: 'none' },

    };


    const brandIconStyles = {
        position: 'fixed', // 'fixed' on xs screens, 'relative' otherwise
        top: -40,
        left: 35,
        textAlign: 'center',
        zIndex: { xs: 10001, sm: 'auto' }, // Ensure it's above other content
        pt: { xs: 3.5, sm: 0 },
        pb: { xs: 1, sm: 0 },

        display: { xs: 'block', sm: 'none' },
        minWidth: '350px',
        cursor: 'pointer',
    };
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300, // Adjust the width as needed
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    const textStyle = {
        marginBottom: '20px',
        textAlign: 'center',

    };

    const buttonStyle = {
        marginTop: '10px',
        width: '80%', // Adjust the width as needed
    };


    return (
        <div className='checkoutPage-container'>

            <LoadingModal open={isLoading} message="Your payment is being processed, Please do not leave or refresh this page" />
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', md: 'row' } }}>
                <div style={{ flex: 1 }}>

                    <div>

                        <div>
                            <Box sx={brandIconStyles} className='brand-icon-checkout' onClick={handleBrandIconClick}>
                                <img src={BrandIcon} alt="brand-con" width={'80%'} height={'auto'} />
                            </Box>

                            <Stepper activeStep={activeStep} alternativeLabel sx={stepperStyles}>
                                {steps.map((label) => (
                                    <Step key={label}>

                                        <StepLabel >{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            <Box sx={{ mt: { xs: 5, sm: 0 } }}>
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

                                    handleBack
                                    cartItems={cart.map(item => ({
                                        _id: item.product._id,
                                        weight: item.product.shipping.weight,
                                        length: item.product.shipping.dimensions.length,
                                        width: item.product.shipping.dimensions.width,
                                        height: item.product.shipping.dimensions.height,
                                        quantity: item.quantity,
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
                                    fullCost={fullCost}
                                    setShippingDetails={setShippingDetails}
                                />}
                                {activeStep === 3 && (
                                    isSquareSdkLoaded ? (
                                        <SquarePaymentForm
                                            onPaymentProcess={onPaymentProcess}
                                            paymentForm={window.SqPaymentForm}
                                            shippingDetails={shippingDetails}
                                            back={handleBack}
                                            errors={paymentError}
                                            total={fullCost}

                                        />
                                    ) : (
                                        <div style={{ margin: '20px' }}>
                                            <ShippingDetailsComponent
                                                shippingDetails={shippingDetails}
                                                back={handleBack}

                                            />
                                            <CircularProgress />
                                        </div>
                                    ))}
                            </Box>
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
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={null}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert

                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            onClick={handleCloseSnackbar}
                        >
                            {/* CLOSE ICON */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill='black' height="40" width="40"><path d="m10.458 31.458-1.916-1.916 9.5-9.542-9.5-9.542 1.916-1.916 9.542 9.5 9.542-9.5 1.916 1.916-9.5 9.542 9.5 9.542-1.916 1.916-9.542-9.5Z" /></svg>
                        </IconButton>
                    }
                >
                    Checking out as guest.<br />   <Link to="/registration" color="inherit" underline="hover">
                        Create account?
                    </Link>
                </Alert>
            </Snackbar>
            <Modal open={openConfirmDialog} onClose={handleCloseDialog}>
                <Box sx={modalStyle}>
                    <p style={textStyle}>Are you sure you want to leave the checkout process? Your progress may* be lost.</p>
                    <Button color='error' style={buttonStyle} onClick={handleConfirmNavigation}>Yes, leave</Button>
                    <Button style={buttonStyle} onClick={handleCloseDialog}>No, stay</Button>
                </Box>
            </Modal>
        </div>
    );
};

export default CheckoutPage;
