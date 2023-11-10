import { Box, Button, Grid } from '@mui/material';
import React from 'react';
import '../Styles/BestSellersSection.css'
const BestSellersSection = () => {
    // Sample data for best-sellers
    const bestSellersData = [
        {
            id: 1,
            name: 'Full-Spectrum Hemp CBD Oil',
            price: '$19.99',
            imageUrl: " require('../assets/cbditem.webp').default"
        },
        {
            id: 2,
            name: 'Full-Spectrum Hemp CBD Oil',
            price: '$24.99',
            imageUrl: "require('../assets/cbditem.webp')"
        },
        {
            id: 3,
            name: 'Full-Spectrum Hemp CBD Oil',
            price: '$29.99',
            imageUrl: '/path-to-image/product3.jpg',
        },
    ];

    return (
        <Box className="best-seller-container"  >
            <h2 className='best-seller-header' >Our Customer Favorites</h2>
            <Grid container spacing={2} className="best-sellers">
                {bestSellersData.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <div className="best-seller-item" key={item.id}>
                            <img
                                src={require('../assets/cbditem.webp')}
                                alt={item.name}
                                className="best-seller-image"
                                loading='lazy'
                            />
                            <Button className='best-sellers-button' >SHOP NOW</Button>
                            <p className="best-seller-name">{item.name}</p>
                            <p className="best-seller-price">{item.price}</p>
                        </div>
                    </Grid>
                ))}
            </Grid>

        </Box >
    );
};

export default BestSellersSection;
