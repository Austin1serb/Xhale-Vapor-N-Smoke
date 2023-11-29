import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Button, CircularProgress } from '@mui/material';

const GuestCheckoutPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const handleGuestCheckout = () => {
        setLoading(true);
        const customerId = "guest-" + uuidv4(); // Generate a UUID
        localStorage.setItem('customerId', customerId); // Store  in localStorage

        navigate('/checkout/1');
    };

    const containerStyles = {

        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: '35px'
    }
    return (
        <div
            style={containerStyles}
        >

            <Paper
                sx={{
                    padding: 3,
                    border: 0.01,
                    boxShadow: 0,
                    margin: 3,
                }}
            >
                <Typography variant="h4" align="center">
                    Guest Checkout
                </Typography>
                <Typography variant="subtitle1" align="center" mb={2}>
                    Proceed with your order without creating an account.
                </Typography>

                {loading ? (
                    <CircularProgress />
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleGuestCheckout}
                    >
                        Continue as Guest
                    </Button>
                )}
            </Paper>
            <Typography display={{ xs: 'block', sm: 'none' }} variant='h6' textAlign={'center'}>Or Create an account!</Typography>
        </div>
    );
};

export default GuestCheckoutPage;
