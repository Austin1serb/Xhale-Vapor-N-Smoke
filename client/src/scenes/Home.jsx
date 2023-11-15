import React, { useEffect, useState } from 'react';
import '../Styles/Home.css'; // You can create a CSS file for styling
import cdbImage from '../assets/cbd.jpeg'
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Button } from '@mui/material';
import VerifiedUser from '@mui/icons-material/VerifiedUser';
import { LiaFlagUsaSolid } from 'react-icons/lia'
import { BsLightning } from 'react-icons/bs'
import { GrTest } from 'react-icons/gr'
import { SiAtom } from 'react-icons/si'
import { PiPlant } from 'react-icons/pi'
import BestSellersSection from '../components/BestSellersSection';
import ShopByBrand from '../components/ShopByBrand';
import AgeVerification from './AgeVerification';
import { Link } from 'react-router-dom';

const Home = () => {

    const [showAgeVerification, setShowAgeVerification] = useState(true);
    const [isUserOver18, setIsUserOver18] = useState(false);
    const [shake, setShake] = useState(false);

    useEffect(() => {
        // Check if the user has already verified their age in session storage
        const ageVerified = sessionStorage.getItem('ageVerified');
        if (ageVerified === 'true') {
            setIsUserOver18(true);
            setShowAgeVerification(true);
        }
    }, []);

    const handleAgeVerification = (isOver18) => {
        if (isOver18) {
            setIsUserOver18(true);
            setShowAgeVerification(false);

            // Save the verification status in session storage
            sessionStorage.setItem('ageVerified', 'true');
        } else {
            setIsUserOver18(false);
            setShowAgeVerification(false);
        }
    };


    const customFont = "freight-display-pro, serif";
    const listItemSx = {
        pt: 2,
        pb: 3,
        borderBottom: '0.1px solid gray', // Add the border-bottom property here
        '@media (min-width: 200px)': {

        }

    };
    return (
        <Box  >
            {showAgeVerification && <AgeVerification onVerify={handleAgeVerification} />}

            <>
                <Box className="home-container">
                    <div className="left-content animated-left slide-in">
                        <div className='colored-square-content'>
                            <div className="colored-square">
                                <h1>Clean & Premium CBD</h1>
                                <Link to='/shop' >
                                    <button >SHOP CBD</button>
                                </Link>

                            </div>
                        </div>
                    </div>
                    <div className="right-content animated-left slide-in">
                        <img src={cdbImage} alt="cbd" loading='lazy' />
                    </div>
                </Box>
                <Box className='' component='div' py={16} sx={{ width: '70%', height: 'auto', alignItems: 'center', justifyContent: 'center', margin: '0 auto', textAlign: 'center' }}>
                    <Typography variant='h4' style={{ fontFamily: customFont }}>
                        Our CBD is award-winning and triple-tested for quality. Try for 30 days & love it or send it back—no questions asked.
                    </Typography>
                    <Box className="list-container" >
                        <List
                            sx={{
                                mt: 4,
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns by default
                                //gap: '12px', // Adjust the gap as needed

                                '@media (max-width: 960px)': {
                                    gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns on medium screens
                                },
                                '@media (max-width: 600px)': {
                                    gridTemplateColumns: 'repeat(1, 1fr)', // 1 column on small screens
                                },
                                '@media (max-width: 360px)': {
                                    width: '220px'
                                },
                            }}
                        >
                            <ListItem sx={listItemSx} className="ListItem1">
                                <ListItemIcon>
                                    <LiaFlagUsaSolid className='li-icon1' />
                                </ListItemIcon>
                                <ListItemText primary="Made in the USA" />
                            </ListItem>
                            <ListItem sx={listItemSx} className="ListItem1">
                                <ListItemIcon>
                                    <BsLightning className='li-icon2' />
                                </ListItemIcon>
                                <ListItemText primary="Full-spectrum Extracts" />
                            </ListItem>
                            <ListItem sx={listItemSx} className="ListItem1">
                                <ListItemIcon>
                                    <VerifiedUser className='li-icon3' />
                                </ListItemIcon>
                                <ListItemText primary="30-day risk-free trial" />
                            </ListItem>
                            <ListItem sx={listItemSx} className="ListItem1">
                                <ListItemIcon>
                                    <SiAtom className='li-icon4' />
                                </ListItemIcon>
                                <ListItemText primary="Science driven" />
                            </ListItem>
                            <ListItem sx={listItemSx} className="ListItem1">
                                <ListItemIcon>
                                    <GrTest className='icon5' />
                                </ListItemIcon>
                                <ListItemText primary="Triple-tested" />
                            </ListItem>
                            <ListItem sx={listItemSx} className="ListItem1">
                                <ListItemIcon>
                                    <PiPlant className='li-icon6' />
                                </ListItemIcon>
                                <ListItemText primary="Vegan & non-GMO" />
                            </ListItem>
                        </List>
                    </Box>

                    <Box className="bottom-box" >
                        <Box className='bottom-box-button1'>
                            <Button  >Shop CBD BESTSELLERS</Button>
                        </Box>
                        <Box className='bottom-box-button2'>
                            <Button onClick={() => window.open('https://projectcbd.org/#CBD-explained')} sx={{ border: 1 }} >Learn More About CBD</Button>
                        </Box>
                    </Box>
                </Box>
                <BestSellersSection />
                <ShopByBrand />
            </>

        </Box >
    );
}

export default Home;
