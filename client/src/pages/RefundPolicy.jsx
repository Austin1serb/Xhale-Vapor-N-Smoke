import React, { useEffect } from 'react'
import '../Styles/PolicyPages.css';

const RefundPolicy = () => {
    useEffect(() => {
        document.title = "Refund Policy - Herba Natural's Customer Service Guidelines";
        document.querySelector('meta[name="description"]').setAttribute("content", "Read Herba Natural's refund policy. Understand how we handle returns, refunds, and exchanges to ensure customer satisfaction.");
    }, []);

    return (
        <div className="policy-pages">
            <div className="container">
                <h1>Refund Policy</h1>

                <p>We have a <strong>30-day return policy</strong>, which means you have 30 days after receiving your item to request a return.</p>

                <h3>Eligibility for Return</h3>
                <p>To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.</p>

                <h3>Starting a Return</h3>
                <p>To start a return, you can contact us at <a href="mailto:customerservices@herbanaturalco.com">customerservices@herbanaturalco.com</a>. If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.</p>

                <h3>Damages and Issues</h3>
                <p>Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.</p>

                <h3>Exceptions / Non-Returnable Items</h3>
                <ul>
                    <li>Perishable goods such as food, flowers, or plants</li>
                    <li>Custom products (such as special orders or personalized items)</li>
                    <li>Personal care goods (such as beauty products)</li>
                    <li>Hazardous materials, flammable liquids, or gases</li>
                </ul>
                <p>Unfortunately, we cannot accept returns on sale items or gift cards.</p>

                <h3>Exchanges</h3>
                <p>The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.</p>

                <h3>Refunds</h3>
                <p>We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method. Please remember it can take some time for your bank or credit card company to process and post the refund too.</p>
            </div>
        </div>
    );
}

export default RefundPolicy;
