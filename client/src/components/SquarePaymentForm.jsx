import React, { useEffect } from 'react';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import { Client, Environment, ApiError } from "square";

const SquarePaymentForm = ({ onPaymentProcess }) => {
    console.log("onPaymentProcess type:", typeof onPaymentProcess);

    const applicationId = process.env.REACT_APP_SQUARE_APPLICATION_ID_SANDBOX;
    const locationId = process.env.REACT_APP_SQUARE_LOCATION_ID_SANDBOX;
    const handleCardNonceResponseReceived = (token) => {
        // Call your onPaymentProcess function with the token
        onPaymentProcess(token);
    };

    const createVerificationDetails = () => {
        // Return verification details object
        return {
            amount: '1.00', // Replace with the actual amount
            currencyCode: 'USD', // Replace with the actual currency code
            intent: 'CHARGE', // Charge or Store
            billingContact: {
                // Fill in with billing details if necessary
            },
        };
    };
    //useeffct to console log applicationId
    // create a use effect to console log applicationId and location id 
    useEffect(() => {
        console.log(applicationId);
        console.log(locationId);
    }, [])

    return (

        <PaymentForm

            applicationId={applicationId}
            locationId={locationId}
            cardNonceResponseReceived={(token) => onPaymentProcess(token)}
            createVerificationDetails={createVerificationDetails}
        >
            <div>
                <CreditCard />

            </div>
        </PaymentForm>
    );
};

export default SquarePaymentForm;
