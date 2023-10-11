import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const AgeVerificationOverlay = ({ onVerify }) => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.6)', // Blue semi-transparent background
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,

            }}
        >
            <Box
                sx={{
                    display: 'inline-grid',
                    alignItems: 'center',
                    backgroundColor: '#282F48',
                    color: '#64B7C0',
                    padding: '40px',
                    borderRadius: '0px',
                    textAlign: 'center',
                    height: '400px',
                    width: '80%'
                }}
            >
                <Typography variant="h3" sx={{ color: '#00BFFF' }}>
                    Are You at Least 18?
                </Typography>
                <Typography variant="body1" sx={{ color: '#00BFFF', margin: '10px 0' }}>
                    You must be 18 or older to enter this site.
                </Typography>
                <Button
                    variant="outlined" // Use outlined buttons
                    color="primary" // Light blue color
                    sx={{ margin: '0 20%', py: 2 }}
                    onClick={() => onVerify(true)}
                >
                    I am over 18
                </Button>
                <Button
                    variant="outlined" // Use outlined buttons
                    color="secondary" // Light blue color
                    sx={{ margin: '0  20%', py: 2 }}
                    onClick={() => window.close()}
                >
                    I am not over 18
                </Button>
            </Box>
        </Box>
    );
};

export default AgeVerificationOverlay;
