import React from 'react';
import { CircularProgress, Fade, Modal } from '@mui/material';
const modalStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center' }
const fadeStyle = { transitionDuration: '500ms' }
const divStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '10px' }
const textStyle = { marginTop: '10px', fontSize: '16px' }
const LoadingModal = ({ open, message }) => {
    return (
        <Modal
            open={open}
            closeAfterTransition
            style={modalStyle}
        >
            <Fade in={open} style={fadeStyle}>
                <div style={divStyle}>
                    <CircularProgress />
                    <span style={textStyle}>{message}</span>
                </div>
            </Fade>
        </Modal>
    );
};

export default LoadingModal;
