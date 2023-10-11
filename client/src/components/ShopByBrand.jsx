import { Box, Button, Typography, Popover } from '@mui/material';
import React, { useState } from 'react';
import '../Styles/ShopByBrand.css'
import wyld from '../assets/Wyld.jpg'
const BestSellersSection = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);


    return (
        <Box>
            <h2 className='brand-header' >Brands We Carry</h2>
            <div className="brand">

                <div className="brand-item">
                    <h2 className="brand-name">WYLD</h2>
                    <div className="brand-img-container"

                    >
                        <img className="brand-image" src={wyld} alt="" />
                    </div>
                    <Box>
                        <Typography
                            className='brand-popover-button'
                            onMouseEnter={handlePopoverOpen}
                            onMouseLeave={handlePopoverClose}

                        >
                            Learn More
                        </Typography>
                    </Box>
                    <Popover
                        sx={{
                            pointerEvents: 'none',
                        }}
                        open={open}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        onClose={handlePopoverClose}
                        disableRestoreFocus
                    >
                        <Typography sx={{ p: 1 }}>
                            Wyld was founded in 2016 to create best-in-class cannabis edibles using real fruit and natural flavors.
                        </Typography>
                    </Popover>
                    <Button className='brand-button' >SHOP NOW</Button>
                </div>


                <div className="brand-item">
                    <h2 className="brand-name">BeeZbee</h2>
                    <div className="brand-img-container"
                    >
                        <img
                            src='https://www.beezbeecbd.com/cdn/shop/files/bzb-fullcolor_150x.png?v=1618001658'
                            alt=''
                            className="brand-image"
                        />

                    </div>
                    <Box>
                        <Typography
                            className='brand-popover-button'
                            onMouseEnter={handlePopoverOpen}
                            onMouseLeave={handlePopoverClose}

                        >
                            Learn More
                        </Typography>
                    </Box>
                    <Popover
                        sx={{
                            pointerEvents: 'none',
                        }}
                        open={open}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        onClose={handlePopoverClose}
                        disableRestoreFocus
                    >
                        <Typography sx={{ p: 1 }}>
                            Wyld was founded in 2016 to create best-in-class cannabis edibles using real fruit and natural flavors.
                        </Typography>
                    </Popover>
                    <Button >SHOP NOW</Button>
                </div>
                <div className="brand-item">
                    <h2 className="brand-name">beeZbee</h2>
                    <div className="brand-img-container"
                    >
                        <img
                            src='https://www.beezbeecbd.com/cdn/shop/files/bzb-fullcolor_150x.png?v=1618001658'
                            alt=''
                            className="brand-image"
                            style={{ backgroundColor: 'black' }}
                        />

                    </div>
                    <Box>
                        <Typography
                            className='brand-popover-button'
                            onMouseEnter={handlePopoverOpen}
                            onMouseLeave={handlePopoverClose}

                        >
                            Learn More
                        </Typography>
                    </Box>
                    <Popover
                        sx={{
                            pointerEvents: 'none',
                        }}
                        open={open}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        onClose={handlePopoverClose}
                        disableRestoreFocus
                    >
                        <Typography sx={{ p: 1 }}>
                            Wyld was founded in 2016 to create best-in-class cannabis edibles using real fruit and natural flavors.
                        </Typography>
                    </Popover>
                    <Button >SHOP NOW</Button>
                </div>

            </div>
        </Box>
    );
};

export default BestSellersSection;
