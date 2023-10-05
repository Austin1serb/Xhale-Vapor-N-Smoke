import React from 'react';
import '../Styles/Home.css'; // You can create a CSS file for styling
import cdbImage from '../assets/cbd-background.jpeg'
import { Box } from '@mui/material';
const Home = () => {
    return (
        <Box className="home-container">
            <div className="left-content">
                <div className="colored-square">
                    <h1>Clean & Premium CBD</h1>
                    <button>SHOP CBD</button>
                </div>
            </div>
            <div className="right-content">
                <img src={cdbImage} alt="cbd" />
            </div>
        </Box>
    );
}

export default Home;
