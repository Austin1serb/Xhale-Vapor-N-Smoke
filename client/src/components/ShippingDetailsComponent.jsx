import { Button, Typography } from '@mui/material';
import React from 'react'

const ShippingDetailsComponent = ({ shippingDetails, back }) => {
    const buttonStyle = { textDecoration: 'underline', fontSize: 12 }

    return (
        <div className='checkout-shipping'>
            {/* Contact Information */}
            <Typography variant='h6' >Contact:</Typography>
            <div className='checkout-shipping-contact'>
                <Typography variant="subtitle1"> Contact:</Typography>
                <div className='checkout-shipping-change'>
                    <Typography variant="body2" fontWeight={100}>{shippingDetails.phone}</Typography>
                    <Typography variant="body2" fontWeight={100}>{shippingDetails.email}</Typography>
                    <Button onClick={back} style={buttonStyle}>Change</Button>
                </div>
            </div>

            {/* Shipping Address */}
            <div className='checkout-shipping-address'>
                <Typography variant="subtitle1">Ship to:</Typography>
                <div className="checkout-shipping-change">
                    <Typography fontWeight={100} variant="body2">{shippingDetails.firstName + ' ' + shippingDetails.lastName}</Typography>
                    <Typography fontWeight={100} variant="body2">
                        {`${shippingDetails.address} ${shippingDetails.address2}, ${shippingDetails.city}, ${shippingDetails.state} ${shippingDetails.zip}, ${shippingDetails.country}`}
                    </Typography>
                    <Button onClick={back} style={buttonStyle}>Change</Button>
                </div>
            </div>
        </div>
    );
};

export default ShippingDetailsComponent