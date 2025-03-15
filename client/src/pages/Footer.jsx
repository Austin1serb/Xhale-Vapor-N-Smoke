import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import '../Styles/Footer.css'
import Icon from '../components/Common/Icon';
const Footer = () => {


    const footerStyles = {
        backgroundColor: '#282F48',
        color: '#FFFFFF',
        padding: '20px',
        height: 'auto',
        paddingBottom: '20px',
        maxWidth: '100%'

    };


    const cardStyles = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'end',
        marginTop: '20px',

    }

    return (
        <footer className='footer-container'>
            <div style={footerStyles} >

                <Box display="flex" justifyContent="space-between" flexDirection={{ xs: 'column', sm: 'row' }}>
                    <Box display={'flex'} mb={2} flexDirection={"column"} justifyContent={"space-between"}>
                        <Typography variant="body2">
                            &copy; {new Date().getFullYear()} Herba Natural
                        </Typography>
                        <div className='footer-contact-container'>

                            <ul style={{ fontSize: 14, listStyle: 'none', marginTop: 10 }}>
                                <li style={{ fontFamily: "sans-serif" }}>Contact: Customerservices@herbanaturalco.com</li>

                            </ul>
                        </div>
                    </Box>
                    <div>
                        <Typography variant="body2">
                            <Link to="/privacy-policy" className='footer-links'>
                                Privacy Policy
                            </Link>
                            {' | '}
                            <Link to="/terms" className='footer-links'>
                                Terms of Service
                            </Link>
                            {' | '}
                            <Link to="/shipping-policy" className='footer-links'>
                                Shipping Policy
                            </Link>
                            {' | '}

                            <Link to='/refund' className='footer-links'>
                                Refund Policy
                            </Link>
                        </Typography>
                    </div>
                </Box>
                <div className="footer-payment-icons" style={cardStyles}>



                    <Icon name="amex" />
                    <Icon name="diners" />
                    <Icon name="discover" />


                    <Icon name='jcb' />
                    <Icon name='mastercard' />

                    <Icon name='visa' />

                </div>

                <div>
                    <Typography variant="body2" style={{ fontSize: '12px', fontWeight: 100, marginTop: '10px' }}>
                        * These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure or prevent any disease. Products on this site contain a value of 0.3% THC or less.


                    </Typography>
                </div>
            </div>

        </footer>
    );
};

export default Footer;
