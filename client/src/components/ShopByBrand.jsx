import { Box, Button, Typography, Popover, Grid } from '@mui/material';
import React, { } from 'react';
import '../Styles/ShopByBrand.css'
import wyld from '../assets/Wyld.webp'
import koi from '../assets/koi-logo.webp'
import beezbee from '../assets/beezbee.webp'
import { Link } from 'react-router-dom';
const BestSellersSection = () => {
    const [anchorElWyld, setAnchorElWyld] = React.useState(null);
    const [anchorElBeeZbee, setAnchorElBeeZbee] = React.useState(null);
    const [anchorElKoi, setAnchorElKoi] = React.useState(null);


    const handlePopoverOpenWyld = (event) => {
        setAnchorElWyld(event.currentTarget);
    };
    const handlePopoverCloseWyld = () => {
        setAnchorElWyld(null);
    };

    const handlePopoverOpenBeeZbee = (event) => {
        setAnchorElBeeZbee(event.currentTarget);
    };
    const handlePopoverCloseBeeZbee = () => {
        setAnchorElBeeZbee(null);
    };

    const handlePopoverOpenKoi = (event) => {
        setAnchorElKoi(event.currentTarget);
    };
    const handlePopoverCloseKoi = () => {
        setAnchorElKoi(null);
    };
    const brandRefWyld = React.useRef(null);
    const brandRefBeeZbee = React.useRef(null);
    const brandRefKoi = React.useRef(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('product-slide-in');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.01 }
        );

        [brandRefWyld, brandRefBeeZbee, brandRefKoi].forEach(ref => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        return () => {
            [brandRefWyld, brandRefBeeZbee, brandRefKoi].forEach(ref => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            });
        };
    }, []);



    const productStyles = {

        paddingTop: '10px',
        paddingBottom: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px',

    }
    return (
        <div>
            <h1 className='brand-header' >Brands We Carry</h1>
            <Grid container spacing={2} className="brand">

                {/* Brand Item 1 */}
                <Grid item xs={12} sm={6} md={4} ref={brandRefWyld} >
                    <div className="brand-item" style={productStyles}>
                        <Box>
                            <div
                                className='brand-popover-button'
                                onMouseEnter={handlePopoverOpenWyld}
                                onMouseLeave={handlePopoverCloseWyld}
                            >
                                <h2 className="brand-name">WYLD
                                    <svg height='16' style={{ transform: 'translate(2px,-5px)' }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z" /></svg>
                                </h2>
                            </div>
                        </Box>
                        <Popover
                            sx={{
                                pointerEvents: 'none'
                            }}
                            open={Boolean(anchorElWyld)}
                            anchorEl={anchorElWyld}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            onClose={handlePopoverCloseWyld}
                            disableRestoreFocus
                        >
                            <Typography sx={{ p: 1 }}>
                                Wyld was founded in 2016 to create best-in-class cannabis edibles using real fruit and natural flavors.
                            </Typography>
                        </Popover>

                        <div className="brand-img-container">
                            <img className="brand-image" src={wyld} alt="wldLogo" loading='lazy' />
                        </div>
                        <Box component={Link} to="/shop?filter=brand-wyld">
                            <Button className='brand-button' >SHOP NOW</Button>
                        </Box>

                    </div>
                </Grid>



                {/* Brand Item 2 */}
                <Grid item xs={12} sm={6} md={4} ref={brandRefBeeZbee} style={{ animationDelay: '0.5s' }} >
                    <div className="brand-item" style={productStyles}>
                        <Box>
                            <div
                                className='brand-popover-button'
                                onMouseEnter={handlePopoverOpenBeeZbee}
                                onMouseLeave={handlePopoverCloseBeeZbee}
                            >
                                <h2 className="brand-name">beeZbee
                                    <svg height='16' style={{ transform: 'translate(2px,-5px)' }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z" /></svg>
                                </h2>
                            </div>
                        </Box>
                        <Popover
                            sx={{
                                pointerEvents: 'none',
                            }}
                            open={Boolean(anchorElBeeZbee)}
                            anchorEl={anchorElBeeZbee}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            onClose={handlePopoverCloseBeeZbee}
                            disableRestoreFocus
                        >
                            <Typography sx={{ p: 1 }}>
                                Founded in 2016, beeZbee is your one-stop-shop for high-quality, natural, and innovative cannabis products. We began out of a need to provide shops with better CBD smokable products and have expanded from there.
                            </Typography>
                        </Popover>
                        <div className="brand-img-container"
                        >
                            <img
                                src={beezbee}
                                alt='beeZbeelogo'
                                className="brand-image"
                                loading='lazy'
                            />

                        </div>
                        <Box component={Link} to="/shop?filter=brand-beeZbee">
                            <Button className='brand-button' >SHOP NOW</Button>
                        </Box>
                    </div>
                </Grid>
                {/* Brand Item 3 */}
                <Grid item xs={12} sm={6} md={4} ref={brandRefKoi} style={{ animationDelay: '1s' }} >
                    <div className="brand-item" style={productStyles} >
                        <Box>
                            <div
                                className='brand-popover-button'
                                onMouseEnter={handlePopoverOpenKoi}
                                onMouseLeave={handlePopoverCloseKoi}
                            >
                                <h2 className="brand-name">Koi
                                    <svg height='16' style={{ transform: 'translate(2px,-5px)' }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z" /></svg>
                                </h2>
                            </div>
                        </Box>
                        <Popover
                            sx={{ pointerEvents: 'none' }}
                            open={Boolean(anchorElKoi)}
                            anchorEl={anchorElKoi}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            onClose={handlePopoverCloseKoi}
                            disableRestoreFocus
                        >
                            <Typography sx={{ p: 1 }}>
                                In 2013, out of a single-car garage in Norwalk, California, two siblings and their cousin planted the seed for what would grow into one the cannabinoid industry's most trusted brands.
                            </Typography>
                        </Popover>
                        <div className="brand-img-container"
                        >
                            <img
                                src={koi}
                                alt='koiLogo'
                                className="brand-image"

                                loading='lazy'
                            />

                        </div>

                        <Box component={Link} to="/shop?filter=brand-koi">
                            <Button className='brand-button' >SHOP NOW</Button>
                        </Box>
                    </div>
                </Grid>

            </Grid>
        </div >
    );
};

export default BestSellersSection;
