import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, Grid, Tabs, Tab, Select, MenuItem, InputLabel, CircularProgress, FormControl } from '@mui/material';
import { useCart } from './CartContext';
import '../Styles/QuickView.css'

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

const QuickView = ({ productId, open, handleClose }) => {
    const [productDetails, setProductDetails] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedImage, setSelectedImage] = useState('');
    const [quantity, setQuantity] = useState(1); // State for the selected quantity
    const [flavor, setFlavor] = useState(''); // State for the selected flavor
    const [loading, setLoading] = useState(false);
    const { addToCart } = useCart();


    useEffect(() => {
        // If the modal is closed, clear the product details
        if (!open) {
            setProductDetails(null);
            setSelectedImage('');
            return;
        }

        // Fetch the product details when the productId changes and the modal is open
        if (productId) {

            setLoading(true);
            const fetchProductDetails = async () => {
                try {
                    const response = await fetch(`http://localhost:8000/api/product/${productId}`);
                    if (!response.ok) {
                        throw new Error('Could not fetch product');
                    }
                    const data = await response.json();
                    setProductDetails(data);
                } catch (error) {
                    console.error('Error fetching product details:', error);
                }
                finally {
                    setLoading(false);
                }
            };

            // Reset the product details while we're fetching new ones
            setProductDetails(null);
            setSelectedImage('');
            fetchProductDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId, open]);


    useEffect(() => {
        // When productDetails is updated and has an imgSource, set the selected image
        if (productDetails && productDetails.imgSource.length > 0) {
            setSelectedImage(productDetails.imgSource[0].url);
        }
    }, [productDetails]); // Now it listens for changes in productDetails



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

    const handleMouseMove = (e) => {
        const target = e.target;
        // Obtain the size of the main image
        const targetRect = target.getBoundingClientRect();
        const targetWidth = targetRect.width;
        const targetHeight = targetRect.height;

        // Calculate the position of the cursor relative to the top-left corner of the image
        const x = e.pageX - targetRect.left - window.scrollX + 40;
        const y = e.pageY - targetRect.top - window.scrollY + 25;

        // Update the state of the lens position
        setLensPosition({
            x: x - lensSize.width / 2,
            y: y - lensSize.height / 2,
        });
        return targetWidth + targetHeight
    };



    return (
        <Modal open={open} onClose={handleClose}>
            <Box className="quickview-container" sx={modalStyle}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : productDetails ? (

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={5}>

                            <Box className='quickview-img-container'>
                                {/* Thumbnails */}
                                <Box sx={{ display: 'flex' }}>
                                    {productDetails.imgSource.map((image, i) => (
                                        <Box className='quickview-thumbnail-container'>
                                            <img
                                                className='quickview-thumbnail'
                                                key={i}
                                                src={image.url}
                                                alt={`${productDetails.name} thumbnail ${i}`}

                                                onClick={() => handleThumbnailClick(image.url)}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                                {/* Main Image displayed */}
                                <Box
                                    className="image-container"
                                    onMouseEnter={() => setShowLens(true)}
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={() => setShowLens(false)}
                                >
                                    <img
                                        src={selectedImage}
                                        alt={productDetails.name}
                                        key={productDetails.name}
                                        style={{ maxWidth: '300px', height: 'auto' }}
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
                            <Typography variant="h5">{productDetails.name}</Typography>
                            <Typography variant="subtitle1">{productDetails.category}</Typography>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', width: 'fit-content' }}>
                                <Tabs value={selectedTab} onChange={handleChangeTab} aria-label="Product details tabs" >
                                    <Tab label="Details" />
                                    <Tab label="Features" />
                                    <Tab label="Specs" />
                                </Tabs>
                            </Box>
                            {/* Content for each tab */}
                            <Box height='360px'>
                                <TabPanel value={selectedTab} index={0}>{productDetails.description}</TabPanel>
                                <TabPanel value={selectedTab} index={1}>{productDetails.features}</TabPanel>
                                <TabPanel value={selectedTab} index={2}>{productDetails.specs}</TabPanel>
                            </Box>
                            {/* Quantity Selector */}
                            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
                                <FormControl sx={{ ml: 3 }} >
                                    <InputLabel>Qty</InputLabel>
                                    <Select
                                        sx={{ width: '100px', borderRadius: 0 }}
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        label="Quantity"
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
                                <Button variant="outlined" className='shop-button-cart' sx={{ border: 1, borderRadius: 0, letterSpacing: 2, fontSize: 12, color: 'white', backgroundColor: '#283047', borderColor: '#283047', borderWidth: 1.5, transition: 'all 0.3s', '&:hover': { backgroundColor: '#FE6F49', color: 'white', borderColor: '#FE6F49', transform: 'scale(1.05)' } }} onClick={() => addToCart(productDetails)}>
                                    Add to Cart
                                </Button>
                                <Button variant="outlined" color="secondary">Save to Wish List</Button>
                            </Box>
                        </Grid>
                    </Grid>
                ) : null}
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