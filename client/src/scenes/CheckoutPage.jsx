import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, Box } from '@mui/material';
import InformationPage from '../components/InformationPage';
import ShippingComponent from '../components/ShippingComponent';
import CartSummaryComponent from '../components/CartSummaryComponent';
import { useCart } from '../components/CartContext';
import BrandIcon from '../assets/brandIcon.png'

const CheckoutPage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [shippingDetails, setShippingDetails] = useState({});
    const steps = ['Cart', 'Information', 'Shipping', 'Payment'];
    const { cart, removeFromCart, adjustQuantity } = useCart();
    const [shippingCost, setShippingCost] = useState('Shipping Cost Calculated at Next Step');
    const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const tax = "Calculated at checkout";

    const handleShippingCostChange = (cost) => {
        setShippingCost(cost);
    };

    const handleShippingDetailsSubmit = (details) => {
        setShippingDetails(details);
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
        <div style={{ width: '100%' }}>
            {/* Logo here */}
            {/* Replace with your actual logo image */}



            <Box sx={{ display: 'flex', }}>
                <div style={{ width: '50%' }}>
                    {activeStep === steps.length ? (
                        <div>
                            <Typography sx={{ mt: 2, mb: 1 }}>
                                All steps completed - you&apos;re finished
                            </Typography>
                            <Button onClick={handleReset}>Reset</Button>
                        </div>
                    ) : (
                        <div>
                            <div>
                                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                    <img src={BrandIcon} alt="Brand Logo" style={{ width: '100px' }} loading='lazy' />
                                </div>
                                {/* Stepper */}
                                <Stepper activeStep={activeStep} alternativeLabel>
                                    {steps.map((label) => (
                                        <Step key={label}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                                {/*{activeStep === 0 && <CartComponent />}*/}
                                {activeStep === 1 && <InformationPage next={handleNext} onShippingDetailsSubmit={handleShippingDetailsSubmit} />}
                                {activeStep === 2 && <ShippingComponent shippingDetails={shippingDetails} onShippingCostChange={handleShippingCostChange} />}
                                {/*{activeStep === 3 && <PaymentComponent />}*/}
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
                <div>
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
                    />
                </div>
            </Box>
        </div>
    );
};

export default CheckoutPage;
