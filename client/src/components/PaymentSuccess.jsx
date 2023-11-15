import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function PaymentSuccess() {
    const location = useLocation();

    useEffect(() => {
        const verifyPayment = async () => {
            const queryParams = new URLSearchParams(location.search);
            const sessionId = queryParams.get('session_id');

            if (sessionId) {
                // Call backend to verify payment
                const response = await fetch(`http://localhost:8000/api/stripe/verify-payment?sessionId=${sessionId}`);
                const data = await response.json();

                // Handle response
                if (data.success) {
                    // Payment verified
                    console.log('Payment Successful:', data.order);
                    // Optionally, redirect to a thank you page or display a success message
                } else {
                    // Handle error or failed verification
                    console.log('Payment verification failed');
                }
            }
        };

        verifyPayment();
    }, [location]);

    return (
        <div>
            <h1>Payment Successful</h1>
            <p>Your order has been processed.</p>
        </div>
    );
}

export default PaymentSuccess;
