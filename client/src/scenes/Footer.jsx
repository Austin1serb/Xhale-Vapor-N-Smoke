import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
    const footerStyles = {
        backgroundColor: '#282F48',
        color: '#FFFFFF',
        padding: '20px', // You can customize the padding here
        marginTop: '90px',
        height: '100px'
    };

    const linkStyles = {
        color: '#FE6F49',
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    };

    return (
        <footer >
            <Container sx={footerStyles} maxWidth="lg">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1">
                        &copy; {new Date().getFullYear()} Your Website Name
                    </Typography>
                    <Typography variant="body2">
                        <Link href="#" sx={linkStyles}>
                            Privacy Policy
                        </Link>
                        {' | '}
                        <Link href="#" sx={linkStyles}>
                            Terms of Service
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </footer>
    );
};

export default Footer;
