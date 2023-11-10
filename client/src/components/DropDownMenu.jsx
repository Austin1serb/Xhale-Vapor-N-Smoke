import { Box, Button, CircularProgress, IconButton, List, ListItem, Paper, Tooltip, } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import '../Styles/DropDownMenu.css';
import throttle from 'lodash/throttle';
import { Link } from 'react-router-dom';
import QuickView from './QuickView';



const DropdownMenu = ({ isVisible }) => {
    const [openedSection, setOpenedSection] = useState(false);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [quickViewOpen, setQuickViewOpen] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    const fetchFeaturedProducts = async () => {

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/product/featured?limit=3');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setFeaturedProducts(data);
        } catch (error) {
            console.error("Could not fetch featured products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isVisible && featuredProducts.length === 0) {
            fetchFeaturedProducts();
        }
    }, [isVisible, featuredProducts.length]);

    const checkSize = throttle(() => {
        if (window.innerWidth > 899) {
            setOpenedSection(false);
        }
    }, 500); // Adjust the '100' to increase or decrease the throttle time

    useEffect(() => {
        window.addEventListener('resize', checkSize);
        // Run initially to check the size on load
        checkSize();
        // Cleanup the event listener when the component is unmounted
        return () => {
            window.removeEventListener('resize', checkSize);
            checkSize.cancel(); // If using lodash's throttle, cancel any trailing invocations
        };
    }, []);

    const handleToggleSection = (sectionName) => {
        if (openedSection === sectionName) {
            setOpenedSection(null);
        } else {
            setOpenedSection(sectionName);
        }
    };
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };


    useEffect(() => {
        // Check screen width on mount
        if (window.innerWidth <= 900) {
            setOpenedSection(null);
        }

        // Debounced resize handler
        const handleResize = debounce(() => {
            if (window.innerWidth <= 900) {
                setOpenedSection(null);
            }
        }, 150); // Here 150ms is the delay. Adjust if needed.

        window.addEventListener('resize', handleResize);

        // Cleanup - remove the listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const buttonStyle = {
        fontSize: '10px',
        padding: '5px',
        borderRadius: '0px',
        marginRight: '10px',
        height: '26px'
    }


    return (
        <Paper elevation={0} className="dropdown" component='div' sx={{ boxShadow: '0 6px 6px rgba(0, 0, 0, 0.1)', }}
        >
            <Box className='dropdown-container'>
                <Box component='div' sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: '92%', }}>
                    <div className="dropdown-section">
                        <div className='list-header' onClick={() => handleToggleSection('SHOP_ALL_CBD')}>
                            <span className="list-content">SHOP ALL CBD</span>
                            <IconButton className='icon-button-dropdown' sx={{ display: { md: 'none' } }}>
                                <RiArrowDropDownLine

                                    className={`arrow-icon ${openedSection === 'SHOP_ALL_CBD' && 'rotate'}`}
                                    size={38}
                                />
                            </IconButton>

                        </div>
                        {(openedSection === 'SHOP_ALL_CBD' || window.innerWidth > 900) && (
                            <List className='list-container' >

                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">Best Sellers</span>

                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">New Products</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">High Potency</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">Bundle & Save</span>
                                </ListItem>
                            </List>

                        )}
                    </div>

                    {/* SHOP BY CATEGORY Section */}
                    <div className="dropdown-section">
                        <div className='list-header' onClick={() => handleToggleSection('SHOP_BY_CATEGORY')}>
                            <span className="list-content">SHOP BY CATEGORY</span>
                            <IconButton className='icon-button-dropdown' sx={{ display: { md: 'none' } }}>
                                <RiArrowDropDownLine className={`arrow-icon ${openedSection === 'SHOP_BY_CATEGORY' && 'rotate'}`} size={38} />
                            </IconButton>
                        </div>
                        {(openedSection === 'SHOP_BY_CATEGORY' || window.innerWidth > 900) && (
                            <List className='list-container'>
                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">CBD Gummies</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">CBD Oils</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">CBD Pills</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">CBD Topicals</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">CBD Smokables</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">CBD Edibles</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">THC-Free CBD</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">RSO Oil Products</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">THC Gummies</span>
                                </ListItem>
                            </List>

                        )}
                    </div>
                    {/* MORE CANNABINOIDS Section */}
                    <div className="dropdown-section">
                        <div className='list-header' onClick={() => handleToggleSection('MORE_CANNABINOIDS')}>
                            <span className="list-content"> MORE CANNABINOIDS</span>
                            <IconButton className='icon-button-dropdown' sx={{ display: { md: 'none' } }}>
                                <RiArrowDropDownLine className={`arrow-icon ${openedSection === 'MORE_CANNABINOIDS' && 'rotate'}`} size={38} />
                            </IconButton>
                        </div>
                        {(openedSection === 'MORE_CANNABINOIDS' || window.innerWidth > 900) && (
                            <List className='list-container'>
                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">CBN</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">CBG</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">CBDa</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">Delta 9</span>
                                </ListItem>
                            </List>
                        )}
                    </div>

                    {/* OTHER PRODUCTS Section */}
                    <div className="dropdown-section">
                        <div className='list-header' onClick={() => handleToggleSection('OTHER_PRODUCTS')}>
                            <span className="list-content">OTHER PRODUCTS</span>
                            <IconButton className='icon-button-dropdown' sx={{ display: { md: 'none' } }}>
                                <RiArrowDropDownLine className={`arrow-icon ${openedSection === 'OTHER_PRODUCTS' && 'rotate'}`} size={38} />
                            </IconButton>
                        </div>
                        {(openedSection === 'OTHER_PRODUCTS' || window.innerWidth > 900) && (
                            <List className='list-container'>
                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">CBD for Pets</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">CBD for Horses</span>
                                </ListItem>
                            </List>

                        )}
                    </div>
                    {/* "Join Us" Section */}
                    <Box className="dropdown-section" sx={{ display: { sm: 'block', md: 'none' } }}>
                        <div className='list-header' onClick={() => handleToggleSection('JOIN_US')}>
                            <span className="list-content">Join Us</span>
                            <IconButton className='icon-button-dropdown' sx={{ display: { md: 'none' } }}>
                                <RiArrowDropDownLine className={`arrow-icon ${openedSection === 'JOIN_US' && 'rotate'}`} size={38} />
                            </IconButton>
                        </div>
                        {(openedSection === 'JOIN_US' || window.innerWidth > 900) && (
                            <List className='list-container'>
                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">Careers</span>
                                </ListItem>
                                {/* Add more list items if necessary */}
                            </List>
                        )}
                    </Box>

                    {/* "About Us" Section */}
                    <Box className="dropdown-section" sx={{ display: { sm: 'block', md: 'none' } }}>
                        <div className='list-header' onClick={() => handleToggleSection('ABOUT_US')}>
                            <span className="list-content">About Us</span>
                            <IconButton className='icon-button-dropdown' sx={{ display: { md: 'none' } }}>
                                <RiArrowDropDownLine className={`arrow-icon ${openedSection === 'ABOUT_US' && 'rotate'}`} size={38} />
                            </IconButton>
                        </div>
                        {(openedSection === 'ABOUT_US' || window.innerWidth > 900) && (
                            <List className='list-container'>
                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">Our Story</span>
                                </ListItem>
                                {/* Add more list items if necessary */}
                            </List>
                        )}
                    </Box>

                    {/* "Support" Section */}
                    <Box className="dropdown-section" sx={{ display: { sm: 'block', md: 'none' }, mb: 2 }}>
                        <div className='list-header' onClick={() => handleToggleSection('SUPPORT')}>
                            <span className="list-content">Support</span>
                            <IconButton className='icon-button-dropdown' sx={{ display: { md: 'none' } }}>
                                <RiArrowDropDownLine className={`arrow-icon ${openedSection === 'SUPPORT' && 'rotate'}`} size={38} />
                            </IconButton>
                        </div>
                        {(openedSection === 'SUPPORT' || window.innerWidth > 900) && (
                            <List className='list-container'>
                                <ListItem className="list-item" component={Link} to="/">
                                    <span className="list-content">Customer Service</span>
                                </ListItem>
                                {/* Add more list items if necessary */}
                            </List>
                        )}
                    </Box>
                </Box>

                {loading ?
                    <Box><CircularProgress /></Box> :
                    <Box className='dropdown-featured'>
                        <legend className='dropdown-featured-header' >Featured Products</legend>
                        {featuredProducts.map((product) => (
                            <Box className='drowdown-featured-container' key={product._id}> {/* Use `_id` or appropriate key property */}
                                <img className='dropdown-featured-img' alt='featured' src={product.imgSource[0].url} loading='lazy' />
                                <Box>
                                    <Tooltip title={product.name} arrow>
                                        <Box className='dropdown-featured-name'>{product.name}</Box>
                                    </Tooltip>
                                    <Box className='dropdown-featured-price' >${product.price}
                                        <Button variant='outlined' sx={buttonStyle} className='dropdown-featured-button' onClick={() => {
                                            setQuickViewProduct(product._id);
                                            setQuickViewOpen(true);
                                        }}>Quick View</Button>
                                    </Box>

                                </Box>

                            </Box>
                        ))}
                    </Box>
                }


            </Box>
            <Box sx={{ textAlign: 'center', mt: 5, borderBottom: .5 }}>
                Exhale Vapor & Smoke
            </Box>
            <QuickView
                productId={quickViewProduct}
                open={quickViewOpen}
                handleClose={() => setQuickViewOpen(false)}
                products={featuredProducts}
            />
        </Paper>


    );
};

export default DropdownMenu;
