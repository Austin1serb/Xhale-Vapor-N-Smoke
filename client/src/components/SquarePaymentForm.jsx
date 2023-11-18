import React, { useEffect } from 'react';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import { Client, Environment, ApiError } from "square";

const SquarePaymentForm = ({ onPaymentProcess }) => {
    console.log("onPaymentProcess type:", typeof onPaymentProcess);

    const applicationId = process.env.REACT_APP_SQUARE_APPLICATION_ID_SANDBOX;
    const locationId = process.env.REACT_APP_SQUARE_LOCATION_ID_SANDBOX;
    const handleTokenRecieved = (paymentToken) => {
        // Call your onPaymentProcess function with the paymentToken
        onPaymentProcess(paymentToken);
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

    const cardStyles = {
        width: '50%',

    }
    return (
        <div style={cardStyles}>
            <PaymentForm
                applicationId={applicationId}
                locationId={locationId}
                cardTokenizeResponseReceived={handleTokenRecieved}
                createVerificationDetails={createVerificationDetails}

            >
                <div>
                    <CreditCard />
                </div>
            </PaymentForm>
        </div>
    );
};

export default SquarePaymentForm;
