import { Box, Grid, Typography, Button, Skeleton } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

import '../Styles/BestSellersSection.css'
import { Link } from 'react-router-dom';

const BestSellersSection = () => {
    const [bestSellers, setBestSellers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const loaderRef = useRef(null);


    const ProductSkeleton = ({ count }) => (

        Array.from({ length: count }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} >
                <Box sx={{
                    border: '.1px solid #ccc',
                    borderRadius: '1px',
                    py: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '300px',
                    justifyContent: 'space-between',
                    mt: '20px',

                }}>
                    <Skeleton variant="rectangular" width="100%" height={150} />
                    <Skeleton variant="text" width="80%" height={24} />
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="text" width="30%" height={24} />
                </Box>
            </Grid>
        ))

    );


    useEffect(() => {

        const observer = new IntersectionObserver((entries) => {
            const firstEntry = entries[0];
            if (firstEntry.isIntersecting && bestSellers.length === 0) {
                fetchBestSellers();

            }
        }, { threshold: 0.1 });

        const currentLoaderRef = loaderRef.current;
        if (currentLoaderRef) {
            observer.observe(currentLoaderRef);
        }

        return () => {
            if (currentLoaderRef) {
                observer.unobserve(currentLoaderRef);
            }
        };
    }, [bestSellers]);


    const fetchBestSellers = () => {
        setIsLoading(true);
        fetch('http://localhost:8000/api/product/bestsellers?limit=3')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setIsLoading(false);
                return response.json(); // Ensure this line is correct
            })
            .then(data => {
                setBestSellers(data)
            })
            .catch(error => {
                console.error('Error fetching best sellers:', error);
            });
    }

    const productStyles = {
        border: '.1px solid #ccc',
        borderRadius: '5px',
        paddingTop: '10px',
        paddingBottom: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '300px',
        justifyContent: 'space-between',
        margin: '20px',
    }
    return (
        <Box component='section' className="best-seller-container" ref={loaderRef} >
            <h2 className='best-seller-header' >Our Customer Favorites</h2 >
            {isLoading ? ( // Check if products are loading
                <Grid container spacing={3}>
                    <ProductSkeleton count={3} />
                </Grid>
            ) : (
                <Grid container spacing={3}>
                    {bestSellers.map((product, index) => (
                        <Grid item xs={12} sm={6} md={4} key={product._id} style={{ animationDelay: `${index * 0.4}s` }} className="product-slide-in">
                            <div style={productStyles}>

                                <img className="shop-img"
                                    src={`${product.imgSource[0].url}`}

                                    alt={product.name}
                                    height="150px" loading='lazy' />
                                <Typography sx={{ textAlign: 'center', fontWeight: 100, fontSize: 14, height: '20px', overflow: "clip" }} className='shop-name' mt={2}>{product.name}</Typography>
                                <Typography variant="subtitle1" className='shop-brand' sx={{ fontSize: 12, fontWeight: 100, color: 'gray' }}>{product.brand}</Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: 100, fontSize: 16 }} className='shop-price'>${product.price.toFixed(2)}</Typography>


                                <Box className='shop-button-container'>
                                    <Link to="/shop?filter=best-sellers" style={{ textDecoration: 'none' }}>
                                        <Button variant="outlined" sx={{ border: 1, borderRadius: 0, letterSpacing: 2, fontSize: 12, color: 'white', backgroundColor: '#283047', borderColor: '#283047', borderWidth: 1.5, transition: 'all 0.3s', '&:hover': { backgroundColor: '#FE6F49', color: 'white', borderColor: '#FE6F49', transform: 'scale(1.05)' }, height: '50px', width: '240px' }} onClick={null}>
                                            SHOP NOW
                                        </Button>
                                    </Link>
                                </Box>

                            </div>

                        </Grid>
                    ))}




                </Grid>)}

        </Box >
    );
};

export default BestSellersSection;
