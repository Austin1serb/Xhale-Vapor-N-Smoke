import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';


const PaymentComponent = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Call your backend to create the payment intent
            const response = await fetch('http://localhost:8000/api/stripe/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: 1000 }), // example amount
            });

            const paymentIntent = await response.json();

            const confirmPayment = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
                payment_method: paymentMethod.id,
            });

            if (confirmPayment.error) {
                setError(confirmPayment.error.message);
                setLoading(false);
            } else {
                // Handle successful payment here
                setLoading(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe || loading}>Pay</button>
            {error && <div>{error}</div>}
        </form>
    );
};
export default PaymentComponent;