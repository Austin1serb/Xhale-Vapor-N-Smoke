import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Slide, Zoom } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
const AgeVerificationOverlay = ({ onVerify }) => {
    const [showOverlayMessage, setShowOverlayMessage] = useState(false);
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

    const handleOldEnough = () => {
        setShowWelcomeMessage(true); // Triggers the zoom-in effect
        setTimeout(() => onVerify(true), 1600); // Wait for 2 seconds before closing the overlay
    };
    const handleNotOldEnough = () => {
        setShowOverlayMessage(true);
    };


    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}
        >
            <Paper
                sx={{
                    position: 'relative', // Necessary for the Slide component
                    display: 'inline-grid',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    padding: '40px',
                    textAlign: 'center',
                    height: '400px',
                    width: '80%'
                }}
            >
                {/* Zoom component for the welcome message */}
                <Zoom in={showWelcomeMessage}>
                    <Box
                        sx={{
                            position: 'absolute',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <ThumbUpIcon sx={{ fontSize: 60, color: 'green' }} />
                        <Typography variant="h4" sx={{ mt: 2, color: 'green' }}>
                            Welcome to Herbal Zestfulness!
                        </Typography>
                    </Box>
                </Zoom>
                {!showWelcomeMessage && (
                    <>
                        <Slide direction="down" in={showOverlayMessage} mountOnEnter unmountOnExit>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '15%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            ><Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>
                                    You Are Not Old Enough to Enter This Site
                                </Typography>
                            </Box>
                        </Slide>
                        <Typography variant="h3">
                            Are You of Legal Age?
                        </Typography>
                        <Typography variant="body2" sx={{ margin: '10px 0', fontWeight: 100 }}>
                            By entering this website, you certify that you are of legal age to comsume CBD in the state in which you reside.
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                            <Button
                                onClick={handleOldEnough}
                                variant="outlined"
                                sx={{
                                    width: 200,
                                    letterSpacing: 2,
                                    color: 'white',
                                    borderRadius: 0,
                                    backgroundColor: '#283047',
                                    mb: { xs: 3, sm: 3 },
                                    height: 56.5,
                                    "&:hover": {
                                        backgroundColor: '#FE6F49',
                                        border: 'none',
                                    },

                                    py: 2
                                }}
                            >
                                YES
                            </Button>
                            <Button
                                onClick={handleNotOldEnough}
                                variant="outlined"
                                sx={{
                                    mb: 1,
                                    width: 200,
                                    letterSpacing: 2,
                                    color: '#283047',
                                    borderRadius: 0,
                                    backgroundColor: 'white',
                                    borderColor: '#283047',
                                    borderWidth: 1.5,
                                    height: 55,
                                    '&:hover': {
                                        backgroundColor: '#0F75E0',
                                        color: 'white'
                                    },

                                    py: 2
                                }}
                            >
                                NO
                            </Button>
                        </Box>
                    </>
                )}

            </Paper>
        </Box>
    );
};

export default AgeVerificationOverlay;
