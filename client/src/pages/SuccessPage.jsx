// SuccessPage.jsx

import React, { useEffect } from 'react';
import '../Styles/SuccessPage.css'
import { Link, useLocation } from 'react-router-dom';
const SuccessPage = () => {
    const location = useLocation();
    const paymentResult = location.state ? location.state.paymentResult : '';

    useEffect(() => {
        document.title = "Success - Thank You for Your Purchase at Herba Naturals";
        document.querySelector('meta[name="description"]').setAttribute("content", "Thank you for your purchase at Herba Naturals. We are preparing your CBD products for delivery. Explore more while you wait.");
    }, []);

    if (!paymentResult) {
        return <div className="success-page">
            <h1>No Payment Details Avaliable!</h1>
            <Link to='/'>Home</Link>
        </div>
            ;
    }
    return (
        <>
            <div className="success-page">
                <h1>Thank You for Your Order!</h1>
                <p>Your order has been placed successfully.</p>
                <p>You will recieve an email shortly.</p>
                <p>Transaction ID: {paymentResult.response && paymentResult.response.result && paymentResult.response.result.payment && paymentResult.response.result.payment.id ? paymentResult.response.result.payment.id : 'Not available yet'}</p>
                <Link to='/'>Home</Link>
            </div>

        </>
    );
};

export default SuccessPage;
