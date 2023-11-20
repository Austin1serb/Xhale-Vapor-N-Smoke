import React from 'react';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import ShippingDetailsComponent from './ShippingDetailsComponent';
import { Button, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
const SquarePaymentForm = ({ onPaymentProcess, shippingDetails, back }) => {


    const applicationId = process.env.REACT_APP_SQUARE_APPLICATION_ID_SANDBOX;
    const locationId = process.env.REACT_APP_SQUARE_LOCATION_ID_SANDBOX;


    const handleTokenRecieved = (paymentToken) => {
        // Call your onPaymentProcess function with the paymentToken
        onPaymentProcess(paymentToken);
    };



    return (
        <div className='checkout-paymentForm-container'>
            <ShippingDetailsComponent
                shippingDetails={shippingDetails}
                back={back}

            />
            <Typography mt={8} variant='h6' >
                Payment:  </Typography>
            <Typography variant="body2" fontWeight={100} className='checkout-paymentForm-SQUARE'>
                <span className='square-text'> All transactions are processed secured and encrypted by</span>    <img src="https://images.ctfassets.net/2d5q1td6cyxq/58rgox9CjnDZYQSxSwikxb/d9cae0bf4d3f53900820eac00b049528/PD04488_-_black_logo_on_white.png?w=1502&h=768&fm=avif&q=85&fit=scale" alt="square-logo" className='checkout-paymentForm-logo' loading='lazy' />
            </Typography>
            <Typography variant='body2' fontWeight={100} className='square-form-text'>Square© Payment Form</Typography>
            <div className='checkout-payment-card-form'>
                <PaymentForm
                    applicationId={applicationId}
                    locationId={locationId}
                    cardTokenizeResponseReceived={handleTokenRecieved}


                >


                    <CreditCard />


                </PaymentForm>

            </div>
            <Button onClick={back} className='cart-checkout-button' variant="outlined" sx={{ mt: 3, width: '100%', letterSpacing: 2, color: '#283047', backgroundColor: 'white', borderColor: '#283047', borderWidth: 1.5, height: 50, '&:hover': { backgroundColor: '#0F75E0', color: 'white', } }}>
                <ArrowBackIosNewIcon sx={{ fontSize: 18, mr: 1 }} />
                Return to shipping</Button>
        </div>
    );
};

export default SquarePaymentForm;
