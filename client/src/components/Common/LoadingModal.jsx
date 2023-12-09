import React, { useState, useEffect } from 'react';
import { Modal, Fade, Box, Typography, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

const modalStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center' };
const divStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '10px' };
const textStyle = { marginTop: '10px', fontSize: '16px' };

function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="text.secondary">
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

CircularProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
};

const LoadingModal = ({ open, message }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 1.5));
        }, 100);

        return () => {
            clearInterval(timer);
            if (!open) {
                setProgress(0);
            }
        };
    }, [open]);

    return (
        <Modal
            open={open}
            closeAfterTransition
            style={modalStyle}
        >
            <Fade in={open} timeout={500}>
                <div style={divStyle}>
                    <CircularProgressWithLabel value={progress} />
                    <span style={textStyle}>{message}</span>
                </div>
            </Fade>
        </Modal>
    );
};

LoadingModal.propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
};

export default LoadingModal;
