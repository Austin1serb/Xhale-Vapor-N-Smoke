
import '../Styles/Shop.css'
import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Skeleton } from '@mui/material';
import axios from 'axios';
import { useCart } from '../components/CartContext.jsx';
import QuickView from '../components/QuickView';


const ProductSkeleton = ({ count }) => (
    <Grid container spacing={3}>
        {Array.from({ length: count }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{
                    border: '.1px solid #ccc',
                    borderRadius: '1px',
                    py: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '300px',
                    justifyContent: 'space-between'
                }}>
                    <Skeleton variant="rectangular" width="100%" height={150} />
                    <Skeleton variant="text" width="80%" height={24} />
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="text" width="30%" height={24} />
                </Box>
            </Grid>
        ))}
    </Grid>
);



const Shop = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [quickViewOpen, setQuickViewOpen] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const pageSize = 20; // Adjust the number of products per page as needed
    const { addToCart } = useCart();



    // Inside the Shop component
    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:8000/api/product/paginate/?page=1&pageSize=${pageSize}`)
            .then(response => {
                setProducts(response.data.products);
                setPage(2); // since the first page is already loaded
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the products:", error);
                setLoading(false);
            });
    }, []);

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop ===
            document.documentElement.offsetHeight
        ) {
            // User has scrolled to the bottom
            if (!loadingMore) {
                setLoadingMore(true);

                // Fetch the next page of products
                axios
                    .get(`http://localhost:8000/api/product/paginate/?page=${page + 1}&pageSize=${pageSize}`)
                    .then(response => {
                        // Append the new products to the existing products array
                        setProducts(prevProducts => [...prevProducts, ...response.data.products]);
                        setPage(prevPage => prevPage + 1);
                        setLoadingMore(false);
                    })
                    .catch(error => {
                        console.error("There was an error fetching more products:", error);
                        setLoadingMore(false);
                    });
            }
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [loadingMore]);


    const getRelatedProducts = (categories) => {
        return products.filter(product =>
            product.categories.some(category =>
                categories.includes(category)
            )
        ).slice(0, 3); // Return only the first 3 related products
    };
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
            {loading ? ( // Check if products are loading
                <ProductSkeleton count={pageSize} />
            ) : ( // Render products when not loading
                <Grid container spacing={3}>
                    {filteredProducts.map(product => (
                        <Grid item xs={12} sm={6} md={4} key={product._id}>
                            <Box sx={{
                                border: '.1px solid #ccc',
                                borderRadius: '1px',
                                py: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                height: '300px',
                                justifyContent: 'space-between'
                            }}>

                                <img className="shop-img" src={product.imgSource[0].url} alt={product.name} height="150px" loading='lazy' />
                                <Typography variant="h6" sx={{ fontWeight: 100, fontSize: 14 }} className='shop-name' mt={2}>{product.name}</Typography>
                                <Typography variant="subtitle1" className='shop-brand' sx={{ fontSize: 12, fontWeight: 100, color: 'gray' }}>{product.brand}</Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: 100, fontSize: 16 }} className='shop-price'>${product.price.toFixed(2)}</Typography>
                                {/*<Typography variant="body2" mt={2} noWrap>
                                {product.description.length > 60 ? product.description.substring(0, 60) + "..." : product.description}
                            </Typography>*/}

                                <Box className='shop-button-container'>
                                    <Button variant="outlined" className='shop-button-cart' sx={{ border: 1, borderRadius: 0, letterSpacing: 2, fontSize: 12, color: 'white', backgroundColor: '#283047', borderColor: '#283047', borderWidth: 1.5, transition: 'all 0.3s', '&:hover': { backgroundColor: '#FE6F49', color: 'white', borderColor: '#FE6F49', transform: 'scale(1.05)' } }} onClick={() => addToCart(product)}>
                                        Add to Cart
                                    </Button>
                                    <Button variant="outlined" className='shop-button-view' sx={{ border: 1, borderRadius: 0, letterSpacing: 2, fontSize: 12, color: '#283047', backgroundColor: 'white', borderColor: '#283047', borderWidth: 1.5, transition: 'all 0.3s', '&:hover': { backgroundColor: '#283047', color: 'white', transform: 'scale(1.05)' } }} onClick={() => {
                                        setQuickViewProduct(product._id);
                                        setQuickViewOpen(true)
                                    }}>Quick View</Button>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}

            <QuickView
                productId={quickViewProduct}
                open={quickViewOpen}
                handleClose={() => setQuickViewOpen(false)}
                products={products} // Pass the products to QuickView
                getRelatedProducts={getRelatedProducts} // Pass the function to get related products
            />

        </Box>
    );
}

export default Shop;