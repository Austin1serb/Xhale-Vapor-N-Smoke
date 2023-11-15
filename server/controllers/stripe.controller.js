const Stripe = require('stripe');
const stripe = Stripe('sk_test_51OC5gnA3ZnEdtXgWDcBud5cGWLdg8GqwMqy9c681upHd5pEzaeeO8OIYIUoxjK0j0csVW1YTiBymuKqRILVVC4Oq00rEiSvh3u');
const Order = require('../models/orders.model');

const convertToSmallestCurrencyUnit = (amount) => {
    return Math.round(amount * 100);
};


exports.createCheckoutSession = async (req, res) => {
    const { cart, formData, fullCost } = req.body;

    const lineItems = cart.map(item => {
        // Extract the image URL from the imgSource array
        const imageUrl = item.product.imgSource.length > 0 ? item.product.imgSource[0].url : null;

        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.product.name,
                    images: imageUrl ? [imageUrl] : [],
                },
                unit_amount: convertToSmallestCurrencyUnit(item.product.price),
            },
            quantity: item.quantity,
        };
    });

    // Add shipping cost as a separate line item if it's greater than 0
    if (fullCost.shippingCost > 0) {
        lineItems.push({
            price_data: {
                currency: 'usd',
                product_data: { name: 'Shipping Cost' },
                unit_amount: convertToSmallestCurrencyUnit(fullCost.shippingCost),
            },
            quantity: 1,
        });
    }

    // Add tax as a separate line item if it's greater than 0
    if (fullCost.tax > 0) {
        lineItems.push({
            price_data: {
                currency: 'usd',
                product_data: { name: 'Tax' },
                unit_amount: convertToSmallestCurrencyUnit(fullCost.tax),
            },
            quantity: 1,
        });
    }
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            customer_email: formData.email,
            mode: 'payment',
            success_url: 'http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/cancel',
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        order.paymentStatus = newStatus;
        await order.save();
        return true;
    } catch (error) {
        console.error('Error updating order status:', error);
        return false;
    }
}



exports.checkoutVerify = async (req, res) => {
    const { sessionId } = req.query;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const isUpdated = await updateOrderStatus(session.metadata.orderId, 'Completed');

            if (isUpdated) {
                res.json({ success: true, order: session.metadata.orderId });
            } else {
                res.status(400).json({ success: false, message: 'Failed to update order status' });
            }
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
