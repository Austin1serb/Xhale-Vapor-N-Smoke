import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Box, Typography, Button, Grid, Tabs, Tab, Select, MenuItem, InputLabel, CircularProgress, FormControl, IconButton, Tooltip } from '@mui/material';
import { useCart } from './CartContext';
import '../Styles/QuickView.css'
import { throttle } from 'lodash';
import { AiFillCloseSquare } from 'react-icons/ai'
// Style object for the modal content
const modalStyle = {

    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '800px',
    maxHeight: '600px',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};



const QuickView = ({ productId, open, handleClose, products, getRelatedProducts }) => {
    const [productDetails, setProductDetails] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedImage, setSelectedImage] = useState('');
    const [quantity, setQuantity] = useState(1); // State for the selected quantity
    const [flavor, setFlavor] = useState(''); // State for the selected flavor
    const [loading, setLoading] = useState(false);
    const { addToCart } = useCart();
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        // If the modal is closed, clear the product details
        if (!open) {
            setProductDetails(null);
            setSelectedImage('');
            return;
        }

        // Find the product details from the products array when the productId changes and the modal is open
        if (productId) {
            const foundProduct = products.find(product => product._id === productId);
            if (foundProduct) {
                setProductDetails(foundProduct);
                if (foundProduct.imgSource.length > 0) {
                    setSelectedImage(foundProduct.imgSource[0].url);
                }
            } else {
                console.error('Product not found');
            }
        }
    }, [productId, open, products]);




    useEffect(() => {
        if (productDetails) {
            const related = products.filter(product =>
                product._id !== productDetails._id && // This ensures the current product is not included
                product.category.some(category =>
                    productDetails.category.includes(category)
                )
            ).slice(0, 3); // Only take the first 3 related products

            setRelatedProducts(related);
        }
    }, [productDetails, products]);



    useEffect(() => {
        // When productDetails is updated and has an imgSource, set the selected image
        if (productDetails && productDetails.imgSource.length > 0) {
            setSelectedImage(productDetails.imgSource[0].url);
        }
    }, [productDetails]); // Now it listens for changes in productDetails

    useEffect(() => {

        return () => {
            handleMouseMoveThrottled.cancel();
        };
    }, []);

    const handleChangeTab = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleThumbnailClick = (imageUrl) => {
        setSelectedImage(imageUrl); // Update the main image displayed
    };

    //HOVER ZOOM 
    const [showLens, setShowLens] = useState(false);
    const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
    const [lensSize] = useState({ width: 200, height: 200 }); // You can adjust this size
    const [zoomFactor] = useState(2);


    const handleMouseMoveThrottled = useCallback(throttle((e) => {
        const target = e.target;
        // Obtain the size of the main image
        const targetRect = target.getBoundingClientRect();
        // Calculate the position of the cursor relative to the top-left corner of the image
        const x = e.pageX - targetRect.left - window.scrollX + 40;
        const y = e.pageY - targetRect.top - window.scrollY + 25;

        // Update the state of the lens position
        console.log('positioning')
        setLensPosition({

            x: x - lensSize.width / 2,
            y: y - lensSize.height / 2,
        });



    }, 50), [lensSize, zoomFactor, setLensPosition]); // 100 ms throttle time


    const renderContent = () => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                </Box>
            );
        } else if (productDetails) {
            // Return the complex JSX for when productDetails are present
            return (
                <Grid container spacing={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={5}>

                            <Box className='quickview-img-container'>
                                {/* Thumbnails */}
                                <Box sx={{ display: 'flex' }}>
                                    {productDetails.imgSource.map((image, i) => (
                                        <Box key={i} className='quickview-thumbnail-container'>
                                            <img
                                                className='quickview-thumbnail'
                                                src={image.url}
                                                alt={`${productDetails.name} thumbnail ${i}`}
                                                onClick={() => handleThumbnailClick(image.url)}
                                                loading='lazy'
                                            />
                                        </Box>
                                    ))}
                                </Box>

                                {/* Main Image displayed */}
                                <Box
                                    className="image-container"
                                    onMouseEnter={() => setShowLens(true)}
                                    onMouseMove={handleMouseMoveThrottled}
                                    onMouseLeave={() => setShowLens(false)}
                                >
                                    <img
                                        src={selectedImage}
                                        alt={productDetails.name}
                                        key={productDetails.name}
                                        style={{ maxWidth: '300px', height: 'auto' }}
                                        loading='lazy'
                                    />
                                </Box>
                                <Typography className='zoom-box-title'>Zoom Box</Typography>
                                <Box className='zoom-box'>

                                    {showLens && (
                                        <Box>
                                            <Box
                                                className="zoom-lens"
                                                style={{
                                                    position: 'relative',

                                                    width: `${lensSize.width}px`,
                                                    height: `${lensSize.height}px`,
                                                    overflow: 'hidden',
                                                    border: '1px solid black',
                                                }}
                                            >
                                                <img
                                                    src={selectedImage}
                                                    alt={productDetails.name}
                                                    loading='lazy'
                                                    style={{
                                                        position: 'absolute',

                                                        width: `${300 * zoomFactor}px`,
                                                        height: `${300 * zoomFactor}px`,
                                                        left: `-${lensPosition.x * zoomFactor}px`, // Update based on mouse move
                                                        top: `-${lensPosition.y * zoomFactor}px`, // Update based on mouse move
                                                        pointerEvents: 'none',
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    )}
                                </Box>

                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={7} >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography sx={{ width: '90%', fontSize: 18 }} variant="h6" className='quickview-title'>{productDetails.name}</Typography>

                                <IconButton sx={{ '&:hover': { transition: 'color 0.3s ease', color: '#282F48' } }} className='quickview-close-button' onClick={handleClose}>
                                    <AiFillCloseSquare style={{ fontSize: 40 }} />
                                </IconButton>
                            </Box>
                            <Typography sx={{ fontSize: 14, fontWeight: 100, textTransform: 'capitalize' }} >{productDetails.category.join(', ')}</Typography>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', width: 'fit-content' }}>
                                <Tabs value={selectedTab} onChange={handleChangeTab} aria-label="Product details tabs" >
                                    <Tab tabIndex={0} role="button" label="Details" />
                                    <Tab tabIndex={1} role="button" label="Related" />
                                    <Tab tabIndex={3} role="button" label="Specs" />
                                </Tabs>
                            </Box>
                            {/* Content for each tab */}
                            <Box height='320px' sx={{

                            }}>
                                < TabPanel value={selectedTab} index={0} >
                                    <Box sx={{ overflow: 'auto', height: '240px', border: .1, px: 2 }}>
                                        <span className='quickview-description'>{productDetails.description}</span>
                                    </Box>
                                </TabPanel>
                                <TabPanel value={selectedTab} index={1}>
                                    {relatedProducts.map((product) => (
                                        <Box className='quickview-related-container' key={product._id}> {/* Use `_id` or appropriate key property */}
                                            <img className='quickview-related-img' alt='related' src={product.imgSource[0].url} loading='lazy' />
                                            <Box variant='button' onClick={() => setProductDetails(product)}>
                                                <Tooltip title={product.name} arrow>
                                                    <Box className='quickview-related-name'>{product.name}</Box>
                                                </Tooltip>
                                            </Box>

                                        </Box>
                                    ))}
                                </TabPanel>
                                <TabPanel value={selectedTab} index={2}>{productDetails.specs}</TabPanel>




                            </Box>
                            <Box className='quickview-price'>
                                Price: ${productDetails.price}
                            </Box>
                            {/* Quantity Selector */}
                            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
                                <FormControl sx={{ ml: 3 }} >
                                    <InputLabel>Qty</InputLabel>
                                    <Select
                                        sx={{ width: '100px', borderRadius: 0 }}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        label="Quantity"
                                        defaultValue={1}
                                    >
                                        {[...Array(10).keys()].map((x) => (
                                            <MenuItem key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {/*Flavor Selector */}
                                <FormControl sx={{ width: '280px', }}>
                                    <InputLabel>Flavor</InputLabel>
                                    <Select
                                        sx={{ borderRadius: 0 }}
                                        value={flavor ? productDetails.flavor : flavor}
                                        onChange={(e) => setFlavor(e.target.value)}
                                        label="Flavor"

                                    >
                                        {productDetails.flavor.split(',').map((flavorOption, index) => (
                                            <MenuItem key={index} value={flavorOption.trim()}>
                                                {flavorOption.trim()}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box>
                                <Button variant="outlined" className='shop-button-cart' sx={{ ml: 3, border: 1, borderRadius: 0, letterSpacing: 2, fontSize: 12, color: 'white', backgroundColor: '#283047', borderColor: '#283047', borderWidth: 1.5, transition: 'all 0.3s', '&:hover': { backgroundColor: '#FE6F49', color: 'white', borderColor: '#FE6F49', transform: 'scale(1.05)' } }} o onClick={() => addToCart(productDetails, quantity)}>
                                    Add to Cart
                                </Button>

                            </Box>
                        </Grid>
                    </Grid >


                </Grid >
            );
        }
        return null; // Or some fallback component
    };




    return (
        <Modal open={open} onClose={handleClose}>
            <Box className="quickview-container" sx={modalStyle}>
                {renderContent()}
            </Box>
        </Modal >
    );
};

// TabPanel component
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export default QuickView;