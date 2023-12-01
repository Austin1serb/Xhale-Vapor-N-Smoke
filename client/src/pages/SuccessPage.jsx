// SuccessPage.jsx

import React from 'react';
import '../Styles/SuccessPage.css'
import { Link } from 'react-router-dom';
const SuccessPage = () => {
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
