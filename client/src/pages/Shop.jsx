
import '../Styles/Shop.css'
import React, { useCallback, useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Skeleton, InputAdornment, IconButton, Snackbar, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useCart } from '../components/CartContext.jsx';
import { Link, useLocation } from 'react-router-dom';


const QuickView = React.lazy(() => import('../components/QuickView'));

const ProductSkeleton = ({ count }) => (


    Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
            <Box sx={{
                border: '.1px solid #ccc',
                borderRadius: '1px',
                py: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '321px',
                width: '335px',
                justifyContent: 'space-between'
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



const Shop = () => {
    useEffect(() => {
        document.title = "Shop at Herba Natural - Explore Koi, Beezbee, Wyld Products and More";
        document.querySelector('meta[name="description"]').setAttribute("content", "Browse Herba Natural's online store for the finest CBD products. Featuring brands like Koi, Beezbee, and Wyld with a variety of CBD oils, edibles, and topicals.");
    }, []);


    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [quickViewOpen, setQuickViewOpen] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const pageSize = 12; // Adjust the number of products per page as needed
    const { addToCart } = useCart();
    const [totalProducts, setTotalProducts] = useState(0);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [filter, setFilter] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false)

    const debounceTimeout = 500; // 500ms debounce

    // Function to fetch products based on search term
    // Function to fetch products based on search term and current filter
    const fetchSearchProducts = useCallback((searchTerm) => {
        setLoadingSearch(true); // Set loading to true when fetching starts
        // Include the filter in the search URL
        const newFilter = queryParams.get('filter') || '';
        setFilter(newFilter);
        const url = `http://localhost:8000/api/product/search?term=${encodeURIComponent(searchTerm)}&filter=${filter}&pageSize=${pageSize}`;

        axios.get(url)
            .then(response => {
                setTotalProducts(response.data.totalProducts);
                setProducts(response.data.products);
                console.log(totalProducts)
                console.log(response.data.products)
                setLoadingSearch(false); // Set loading to false when fetching is complete
            })
            .catch(error => {
                console.error("Error fetching search results:", error);
                setLoadingSearch(false); // Ensure loading is set to false even if there's an error
            });
    }, [pageSize, filter,]); // Include filter in the dependency array


    // Debounced search handler
    useEffect(() => {
        let handler;
        let loadingTimer;

        if (searchTerm) {
            setLoadingSearch(true); // Set loading to true when debounce starts

            // Timer to ensure loading state lasts for at least the debounce period
            loadingTimer = setTimeout(() => {
                setLoadingSearch(false);
            }, debounceTimeout);

            handler = setTimeout(() => {
                fetchSearchProducts(searchTerm);
            }, debounceTimeout);
        } else {
            // Reset the loading state immediately if the search term is cleared
            setLoadingSearch(false);
        }

        return () => {
            clearTimeout(handler);
            clearTimeout(loadingTimer);
        };

    }, [searchTerm, fetchSearchProducts, debounceTimeout]);





    useEffect(() => {
        setSnackbarOpen(true);
    }, []);



    const fetchProducts = (url) => {
        setLoading(true);
        axios.get(url)
            .then(response => {
                setProducts(prevProducts => [...prevProducts, ...response.data.products]);
                setPage(prevPage => prevPage + 1);
                setTotalProducts(response.data.totalProducts);
                setLoading(false);
                setLoadingMore(false);
            })
            .catch(error => {
                console.error("There was an error fetching the products:", error);
                setLoading(false);
                setLoadingMore(false);
            });
    };




    useEffect(() => {
        const newFilter = queryParams.get('filter') || '';
        setFilter(newFilter);
        setProducts([]);
        setSearchTerm('')
        setPage(1);
        const url = `http://localhost:8000/api/product/paginate/?page=1&pageSize=${pageSize}&filter=${newFilter}`;
        fetchProducts(url)

    }, [location.search]);






    const handleScroll = useCallback(() => {
        // Define a threshold (in pixels) from the bottom of the page
        const threshold = 800; // for example, 200 pixels from the bottom

        // Calculate the distance from the bottom
        const distanceFromBottom = document.documentElement.offsetHeight - (window.innerHeight + document.documentElement.scrollTop);

        if (distanceFromBottom < threshold) {
            // User is within threshold from the bottom
            if (products.length < totalProducts && !loadingMore) {
                console.log('fetching')
                setLoadingMore(true);
                // Fetch the next page of products
                const url = `http://localhost:8000/api/product/paginate/?page=${page}&pageSize=${pageSize}&filter=${filter}`;
                axios.get(url)
                    .then(response => {
                        const newProducts = response.data.products.filter(np => !products.some(p => p._id === np._id));
                        setProducts(prevProducts => [...prevProducts, ...newProducts]);
                        setPage(prevPage => prevPage + 1);
                        setLoadingMore(false);
                    })
                    .catch(error => {
                        console.error("There was an error fetching more products:", error);
                        setLoadingMore(false);
                    });
            }
        }
    }, [loadingMore, page, pageSize, products.length, totalProducts]);



    const getRelatedProducts = (categories) => {
        return products.filter(product =>
            product.categories.some(category =>
                categories.includes(category)
            )
        ).slice(0, 3); // Return only the first 3 related products
    };


    const resetStateOnClearSearch = () => {
        setPage(1); // Reset page number
        setProducts([]); // Revert to initial products
        setLoadingMore(false); // Reset loading states
        const newFilter = queryParams.get('filter') || '';
        setFilter(newFilter);
        fetchProducts(`http://localhost:8000/api/product/paginate/?page=1&pageSize=${pageSize}&filter=${filter}`);
    };

    // Modified handleSearchChange to reset state when search is cleared
    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (!value) {
            resetStateOnClearSearch();
        }
    };



    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll, filter]); // Only depends on handleScroll


    const productStyles = {
        border: '.1px solid #ccc',
        borderRadius: '5px',
        paddingTop: '10px',
        paddingBottom: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '300px',
        justifyContent: 'space-between'
    }
    return (
        <Box className="shop" sx={{ padding: '20px', mt: 10 }}>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                sx={{ mt: 10 }}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}

            >
                <Alert onClose={() => setSnackbarOpen(false)} sx={{ width: '100%' }}>
                    Enjoy free shipping on all orders over $50!
                </Alert>
            </Snackbar>

            {/* Display the current filter */}
            <Box sx={{ mb: 4 }}>
                <Link to="/shop" style={{ textDecoration: 'none' }}>
                    <Typography variant="body1" component="h1" >
                        SHOP
                    </Typography>
                </Link>
                {filter && (
                    <div style={{ marginLeft: '10px' }}>

                        <Typography variant="body1" component="span" > {' > '} </Typography>
                        <Link to={`/shop?filter=${filter}`} style={{ textDecoration: 'none' }}>
                            <Typography variant="body1" component="span" >
                                {filter.toUpperCase()}
                            </Typography>
                        </Link>
                    </div>
                )}
            </Box>
            <Box mb={4}>
                <TextField
                    name='searchBar'
                    autoCorrect="false"
                    autoComplete="off"
                    autoCapitalize="off"
                    id='searchBar'
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start" >
                                <IconButton
                                    name='magnifying-icon'
                                    id='magnifying-icon'
                                    aria-label="magnifying-icon"
                                    sx={{

                                        transition: 'opacity 0.3s', // Add opacity transition

                                    }}
                                >
                                    {loadingSearch ?
                                        <CircularProgress size={25} /> :
                                        <svg
                                            name='magnifying-icon-svg'
                                            id='magnifying-icon-svg'
                                            aria-label="magnifying-icon-svg"
                                            fill='#0F75E0'
                                            xmlns="http://www.w3.org/2000/svg"
                                            height='20'
                                            viewBox="0 0 512 512"
                                        >
                                            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                                        </svg>}
                                </IconButton>

                            </InputAdornment>
                        ),
                    }}
                    label={`Search ${!!filter ? filter.toUpperCase() : 'Products'}`}
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    fullWidth
                />
            </Box>



            {/* Products Grid */}
            {loading ? ( // Check if products are loading
                <Grid container spacing={3}>
                    <ProductSkeleton count={pageSize} />
                </Grid>
            ) : ( // Render products when not loading
                <Grid container spacing={3} >
                    {products && products.length === 0 ? ( // No products found

                        <Typography ml={5} variant="h5">No products found</Typography>

                    ) : (null)}

                    {products.map((product, index) => (

                        <Grid item xs={12} sm={6} md={4} key={product._id} style={{ animationDelay: `${index * 0.2}s` }} className="product-slide-in-shop">
                            <div style={productStyles}>

                                <img
                                    className="shop-img"
                                    src={`${product.imgSource[0].url}`}
                                    alt={product.name}
                                    height="150"
                                    width="150"

                                />


                                <Typography sx={{ fontWeight: 100, fontSize: 14 }} className='shop-name' mt={2}>{product.name}</Typography>
                                <Typography variant="subtitle1" className='shop-brand' sx={{ fontSize: 12, fontWeight: 100, color: 'black' }}>{product.brand}</Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: 100, fontSize: 16 }} className='shop-price'>${product.price.toFixed(2)}</Typography>

                                <Box className='shop-button-container'>
                                    <Button variant="outlined" className='shop-button-cart' sx={{ border: 1, borderRadius: 0, letterSpacing: 2, fontSize: 12, color: 'white', backgroundColor: '#283047', borderColor: '#283047', borderWidth: 1.5, transition: 'all 0.3s', '&:hover': { backgroundColor: '#FE6F49', color: 'white', borderColor: '#FE6F49', transform: 'scale(1.05)' } }} onClick={() => addToCart(product)}>
                                        Add to Cart
                                    </Button>
                                    <Button variant="outlined" className='shop-button-view' sx={{ border: 1, borderRadius: 0, letterSpacing: 2, fontSize: 12, color: '#283047', backgroundColor: 'white', borderColor: '#283047', borderWidth: 1.5, transition: 'all 0.3s', '&:hover': { backgroundColor: '#283047', color: 'white', transform: 'scale(1.05)' } }} onClick={() => {
                                        setQuickViewProduct(product._id);
                                        setQuickViewOpen(true)
                                    }}>Quick View</Button>
                                </Box>

                            </div>

                        </Grid>
                    ))}
                    {/* Display skeletons if more products are to be loaded or loading more products */}

                    {(loadingMore) && (

                        <CircularProgress />
                    )}


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