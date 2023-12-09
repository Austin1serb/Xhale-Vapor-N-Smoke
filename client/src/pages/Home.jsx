import React, { Suspense, useEffect } from 'react';
import '../Styles/Home.css'; // You can create a CSS file for styling
import cdbImage from '../assets/cbd.webp'
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Button, CircularProgress } from '@mui/material';


import { Link } from 'react-router-dom';
//lazy load my imports
const BestSellersSection = React.lazy(() => import('../components/BestSellersSection.jsx'));
const ShopByBrand = React.lazy(() => import('../components/ShopByBrand.jsx'));

const Home = () => {

    useEffect(() => {
        document.title = "Herba Naturals - Premium CBD Products in Kirkland | Home";
        document.querySelector('meta[name="description"]').setAttribute("content", "Discover premium CBD products with Herba Naturals in Kirkland. Explore our range of Koi, Beezbee, and Wyld CBD oils, edibles, and topicals.");
    }, []);


    const customFont = "freight-display-pro, serif";
    const listItemSx = {
        pt: 2,
        pb: 3,

        borderBottom: '0.1px solid gray',
        '@media (max-width: 380px)': {

            minWidth: '320px',
            maxWidth: '320px',

        },
        '@media (max-width: 600px)': {

            minWidth: '320px',
            maxWidth: '320px',

        }

    };
    return (

        <div>

            <Box sx={{ ml: { xs: -1.25, sm: 0 } }} className="home-container">
                <div className="left-content">
                    <div className='colored-square-content'>
                        <div className="colored-square">
                            <h1>Clean & Premium CBD</h1>
                            <Link to='/shop' >
                                <button className='colored-square-button'>SHOP CBD</button>
                            </Link>

                        </div>
                    </div>
                </div>
                <div className="right-content animated-left slide-in">
                    <img
                        src={cdbImage}
                        alt="cbd"
                        height='400px'
                        width='400px'

                    />
                </div>
            </Box>
            <Box component='div' py={{ xs: 5, sm: 16 }} sx={{ width: { xs: '320px', sm: '70%' }, height: 'auto', alignItems: 'center', justifyContent: 'center', margin: '0 auto', textAlign: 'center', mt: { xs: -30, sm: -40, md: 0 } }}>
                <div >
                    <Typography style={{ fontFamily: customFont, fontSize: '30px' }}>

                        Our Carriers CBD is award-winning and tested for quality. We proudly offer products from the best CBD producers.
                    </Typography>
                </div>
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
                            ml: 2
                        }}
                    >
                        <ListItem sx={listItemSx} className="ListItem1">
                            <ListItemIcon>
                                {/* FLAG */}
                                <svg height='32' fill='currentColor' className='li-icon1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M 3 7 L 3 17 L 15 17 L 17 17 L 29 17 L 29 15 L 17 15 L 17 13 L 29 13 L 29 11 L 17 11 L 17 9 L 29 9 L 29 7 L 17 7 L 15 7 L 3 7 z M 5 8 C 5.552 8 6 8.448 6 9 C 6 9.552 5.552 10 5 10 C 4.448 10 4 9.552 4 9 C 4 8.448 4.448 8 5 8 z M 9 8 C 9.552 8 10 8.448 10 9 C 10 9.552 9.552 10 9 10 C 8.448 10 8 9.552 8 9 C 8 8.448 8.448 8 9 8 z M 13 8 C 13.552 8 14 8.448 14 9 C 14 9.552 13.552 10 13 10 C 12.448 10 12 9.552 12 9 C 12 8.448 12.448 8 13 8 z M 7 11 C 7.552 11 8 11.448 8 12 C 8 12.552 7.552 13 7 13 C 6.448 13 6 12.552 6 12 C 6 11.448 6.448 11 7 11 z M 11 11 C 11.552 11 12 11.448 12 12 C 12 12.552 11.552 13 11 13 C 10.448 13 10 12.552 10 12 C 10 11.448 10.448 11 11 11 z M 15 11 C 15.552 11 16 11.448 16 12 C 16 12.552 15.552 13 15 13 C 14.448 13 14 12.552 14 12 C 14 11.448 14.448 11 15 11 z M 5 14 C 5.552 14 6 14.448 6 15 C 6 15.552 5.552 16 5 16 C 4.448 16 4 15.552 4 15 C 4 14.448 4.448 14 5 14 z M 9 14 C 9.552 14 10 14.448 10 15 C 10 15.552 9.552 16 9 16 C 8.448 16 8 15.552 8 15 C 8 14.448 8.448 14 9 14 z M 13 14 C 13.552 14 14 14.448 14 15 C 14 15.552 13.552 16 13 16 C 12.448 16 12 15.552 12 15 C 12 14.448 12.448 14 13 14 z M 3 19 L 3 21 L 29 21 L 29 19 L 3 19 z M 3 23 L 3 25 L 29 25 L 29 23 L 3 23 z" /></svg>
                            </ListItemIcon>
                            <ListItemText primary="Sourced in the USA" />
                        </ListItem>
                        <ListItem sx={listItemSx} className="ListItem1">
                            <ListItemIcon>
                                {/* Lightning Bolt */}
                                <svg className='li-icon2' xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5zM6.374 1 4.168 8.5H7.5a.5.5 0 0 1 .478.647L6.78 13.04 11.478 7H8a.5.5 0 0 1-.474-.658L9.306 1H6.374z" />
                                </svg>
                            </ListItemIcon>
                            <ListItemText primary="Full-spectrum Extracts" />
                        </ListItem>
                        <ListItem sx={listItemSx} className="ListItem1">
                            <ListItemIcon>
                                {/* Sheild Icon */}
                                <svg className='li-icon3' fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" /></svg>
                            </ListItemIcon>
                            <ListItemText primary="30-day risk-free trial" />
                        </ListItem>
                        <ListItem sx={listItemSx} className="ListItem1">
                            <ListItemIcon>
                                {/* atom logo */}
                                <svg height='30' fill='currentColor' className='li-icon4' role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Atom</title><path d="M20.489 9.025c-2.183-.93-5.116-1.53-8.25-1.695-.5-.03-.987-.04-1.45-.04 2.318-2.83 4.802-4.73 6.437-4.79.322-.013.595.055.813.196.706.458.905 1.768.545 3.59-.04.25.12.493.36.54.25.05.49-.11.54-.36.45-2.28.12-3.846-.94-4.538-.38-.248-.84-.365-1.35-.346-2.05.077-4.94 2.3-7.59 5.72-1.154.035-2.24.13-3.232.287-.646-2.897-.39-4.977.594-5.477.138-.073.285-.11.457-.124.697-.054 1.66.395 2.71 1.27.194.16.486.14.646-.06a.458.458 0 00-.06-.645C9.459 1.51 8.297 1 7.347 1.07a2.244 2.244 0 00-.803.22c-1.19.607-1.67 2.327-1.37 4.838.07.52.16 1.062.29 1.62-3.281.656-5.371 1.97-5.461 3.624-.06 1.17.865 2.284 2.68 3.222a.46.46 0 10.42-.816C1.653 13.031.873 12.19.92 11.42c.05-1.08 1.772-2.19 4.76-2.78.27.994.62 2.032 1.05 3.09-1.018 1.888-1.756 3.747-2.137 5.4-.56 2.465-.26 4.22.86 4.948.36.234.78.35 1.247.35.935 0 2.067-.46 3.347-1.372a.458.458 0 10-.53-.746c-1.544 1.103-2.844 1.472-3.562 1.003-.76-.495-.926-1.943-.46-3.976.32-1.386.907-2.93 1.708-4.52.2.438.41.876.63 1.313 1.425 2.796 3.17 5.227 4.91 6.845 1.386 1.29 2.674 1.963 3.735 1.963.35 0 .68-.075.976-.223 1.145-.585 1.64-2.21 1.398-4.575-.224-2.213-1.06-4.91-2.354-7.6a.46.46 0 00-.83.396c2.69 5.602 2.88 10.19 1.37 10.96-1.59.813-5.424-2.355-8.39-8.18-.34-.655-.637-1.3-.9-1.93.34-.608.7-1.22 1.095-1.83.395-.604.806-1.188 1.224-1.745h.394c.54 0 1.126.01 1.734.048 6.53.343 10.975 2.56 10.884 4.334-.04.765-.924 1.538-2.425 2.12a.464.464 0 00-.26.596.455.455 0 00.593.262c1.905-.74 2.95-1.756 3.01-2.93.07-1.33-1.17-2.61-3.5-3.6v-.01zM8.073 9.45c-.27.415-.52.827-.764 1.244a23.66 23.66 0 01-.723-2.215c.713-.11 1.485-.19 2.31-.24-.28.39-.554.794-.82 1.21v-.01zm3.925 1.175a1.375 1.375 0 100 2.75 1.375 1.375 0 100-2.75z" /></svg>
                            </ListItemIcon>
                            <ListItemText primary="Science driven" />
                        </ListItem>
                        <ListItem sx={listItemSx} className="ListItem1">
                            <ListItemIcon>
                                {/* Lab Icon */}
                                <svg className='icon5' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="none" stroke="#000" strokeWidth="2" d="M8.9997,0.99999995 L8.9997,8.0003 L1.9997,20.0003 L1.9997,23.0003 L21.9997,23.0003 L21.9997,20.0003 L14.9997,8.0003 L14.9997,0.99999995 M15,18 C15.5522847,18 16,17.5522847 16,17 C16,16.4477153 15.5522847,16 15,16 C14.4477153,16 14,16.4477153 14,17 C14,17.5522847 14.4477153,18 15,18 Z M9,20 C9.55228475,20 10,19.5522847 10,19 C10,18.4477153 9.55228475,18 9,18 C8.44771525,18 8,18.4477153 8,19 C8,19.5522847 8.44771525,20 9,20 Z M18,13 C11,9.99999996 12,17.0000002 6,14 M5.9997,1.0003 L17.9997,1.0003" />
                                </svg>
                            </ListItemIcon>
                            <ListItemText primary="Lab-tested" />
                        </ListItem>
                        <ListItem sx={listItemSx} className="ListItem1">
                            <ListItemIcon>
                                {/* plant Icon */}
                                <svg className='li-icon6' xmlns="http://www.w3.org/2000/svg" height='33px' viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><path d="M138.54,141.46C106.62,88.25,149.18,35.05,239.63,40.37,245,130.82,191.75,173.38,138.54,141.46Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M88.47,152.47c22.8-38-7.6-76-72.21-72.21C12.46,144.87,50.47,175.27,88.47,152.47Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="56" y1="120" x2="120" y2="184" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M200,80l-61.25,61.25A64,64,0,0,0,120,186.51V216" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>

                            </ListItemIcon>
                            <ListItemText primary="Vegan & non-GMO" />
                        </ListItem>
                    </List>
                </Box>

                <Box className="bottom-box" sx={{}}>
                    <Box className='bottom-box-button1' component={Link} to="/shop?filter=best-sellers">
                        <Button >SHOP CBD BESTSELLERS</Button>
                    </Box>
                    <Box className='bottom-box-button2'>
                        <Button onClick={() => window.open('https://projectcbd.org/#CBD-explained')} >LEARN MORE ABOUT CBD</Button>
                    </Box>
                </Box>
            </Box>
            <Suspense fallback={<CircularProgress />}>
                <BestSellersSection />
            </Suspense>
            <Suspense fallback={<CircularProgress />}>
                <ShopByBrand />
            </Suspense>
        </div>

    );
}

export default Home;
