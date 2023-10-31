
import '../Styles/Shop.css'
import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Chip } from '@mui/material';
import axios from 'axios';
import { useCart } from '../components/CartContext.jsx';
const Shop = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToCart } = useCart();

    useEffect(() => {
        axios.get('http://localhost:8000/api/product/')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching products:", error);
            });
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box className="shop" sx={{ padding: '20px' }}>
            {/* Search Bar */}
            {/* Search Bar (optional based on design) */}
            <Box mb={4}>
                <TextField label="Search Products" variant="outlined" value={searchTerm} onChange={handleSearchChange} fullWidth />
            </Box>


            {/* Products Grid */}
            <Grid container spacing={3}>
                {filteredProducts.map(product => (
                    <Grid item xs={12} sm={6} md={4} key={product._id}>
                        <Box sx={{
                            border: '1px solid #ccc',
                            borderRadius: '10px',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <img src={product.imgSource.url} alt={product.name} width="80%" height="200px" style={{ objectFit: 'cover' }} />
                            <Typography variant="h6" mt={2}>{product.name}</Typography>
                            <Typography variant="subtitle1" color="textSecondary">{product.brand}</Typography>
                            <Typography variant="subtitle2">${product.price.toFixed(2)}</Typography>
                            <Typography variant="body2" mt={2} noWrap>
                                {product.description.length > 60 ? product.description.substring(0, 60) + "..." : product.description}
                            </Typography>
                            <Button variant="contained" color="primary" mt={2} onClick={() => addToCart(product)}>
                                Add to Cart
                            </Button>
                        </Box>
                    </Grid>

                ))}
            </Grid>

            {/* Pagination - if needed */}

            {/* Footer - as per Home.jsx */}
        </Box>
    );
}

export default Shop;