import { Box, Button } from '@mui/material';
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
        <Box>
            <h2 className='best-seller-header' >Our Customer Favorites</h2>
            <div className="best-sellers">

                {bestSellersData.map((item) => (
                    <div className="best-seller-item" key={item.id}>
                        <img
                            src={require('../assets/cbditem.webp')}
                            alt={item.name}
                            className="best-seller-image"
                        />
                        <Button className='best-sellers-button' >SHOP NOW</Button>
                        <p className="best-seller-name">{item.name}</p>
                        <p className="best-seller-price">{item.price}</p>
                    </div>
                ))}
            </div>
        </Box>
    );
};

export default BestSellersSection;
