import React, { useEffect } from 'react';
import '../Styles/PolicyPages.css'; // Import your CSS file for styling

function ShippingPolicy() {
    useEffect(() => {
        document.title = "Shipping Policy - Herba Naturals Delivery Information";
        document.querySelector('meta[name="description"]').setAttribute("content", "Understand Herba Natural's shipping policies. Get details on shipping methods, delivery times, and tracking your order of CBD products.");
    }, []);


    return (
        <div className="policy-pages">



            <div className="container">

                <h1>Shipping Policy</h1>


                <p>Welcome to Herba Naturals! We appreciate your business and want to ensure a smooth and transparent shopping experience for our valued customers. Please take a moment to review our shipping policy, which outlines important information regarding shipping, delivery, and related matters.</p>

                <h3>1. Shipping Providers:</h3>
                <p>
                    At Herba Naturals, we offer various shipping options to provide flexibility and convenience to our customers. We may use different shipping providers, such as USPS, FedEx, UPS, or others, depending on the availability and destination of the order. Please note that the shipping provider you select at checkout may not always be the one used for your shipment. We reserve the right to choose the shipping provider that best suits your order to ensure a timely and secure delivery.
                </p>

                <h3>2. Shipping Times:</h3>
                <p>
                    Shipping times may vary depending on your location, the shipping method selected, and unforeseen circumstances. We strive to process and ship orders as quickly as possible, typically within [X] business days after receiving your order. However, please understand that shipping times are estimates and not guarantees. Delays may occur due to factors beyond our control, such as weather, holidays, or disruptions in the shipping network. We recommend considering this when placing time-sensitive orders.
                </p>

                <h3>3. Damages During Shipping:</h3>
                <p>
                    While we take every precaution to ensure that your order is well-packaged and protected for shipping, we cannot be held responsible for any damages that may occur during transit. If you receive a damaged product, please contact us immediately, and we will do our best to assist you in resolving the issue. We may require photographic evidence of the damage to help expedite the process.
                </p>

                <h3>4. Tracking Information:</h3>
                <p>
                    Once your order has been shipped, you will receive an email notification containing tracking information. You can use this information to monitor the progress of your shipment and estimate its expected arrival date. Please note that tracking information may take some time to update, especially during peak shipping periods.
                </p>

                <h3>5. Shipping Restrictions:</h3>
                <p>
                    It is your responsibility to ensure that your order complies with local laws and regulations regarding CBD products. We do not ship to locations where CBD products are prohibited or restricted. Please review our Terms of Service for more information on shipping restrictions.
                </p>

                <h3>6. International Shipping:</h3>
                <p>
                    For international orders, please be aware that customs, duties, taxes, and other fees may apply. These fees are the responsibility of the customer and are not included in the purchase price or shipping cost. Please check with your local customs office for information on potential charges related to your order.
                </p>

                <h3>7. Contact Us:</h3>
                <p>
                    If you have any questions or concerns regarding our shipping policy or the status of your order, please don't hesitate to contact our customer support team at [Customer Support Email] or [Customer Support Phone Number]. We are here to assist you and ensure that your shopping experience with Herba Naturals is as pleasant as possible.
                </p>
            </div>
        </div>
    );
}

export default ShippingPolicy;
