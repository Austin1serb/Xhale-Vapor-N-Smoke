// SuccessPage.jsx

import React, { useEffect } from 'react';
import '../Styles/SuccessPage.css'
import { Link } from 'react-router-dom';
const SuccessPage = () => {
    useEffect(() => {
        document.title = "Success - Thank You for Your Purchase at Herba Naturals";
        document.querySelector('meta[name="description"]').setAttribute("content", "Thank you for your purchase at Herba Naturals. We are preparing your CBD products for delivery. Explore more while you wait.");
    }, []);


    return (
        <>
            <div className="success-page">
                <h1>Thank You for Your Order!</h1>
                <p>Your order has been placed successfully.</p>
                <p>You will recieve an email shortly.</p>
                <Link to='/'>Home</Link>
            </div>

        </>
    );
};

export default SuccessPage;
