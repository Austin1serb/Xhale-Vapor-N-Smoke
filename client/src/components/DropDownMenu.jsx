import { Box, Button, CircularProgress, IconButton, List, ListItem, Paper, } from '@mui/material';
import React, { Suspense, useEffect, useState } from 'react';
import '../Styles/DropDownMenu.css';
import { Link } from 'react-router-dom';


const QuickView = React.lazy(() => import('../components/QuickView'));

const DropdownMenu = ({ isVisible, onLinkClick }) => {
    const [openedSection, setOpenedSection] = useState(false);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [quickViewOpen, setQuickViewOpen] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    const throttle = (func, limit) => {
        let lastFunc;
        let lastRan;
        return function () {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function () {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        }
    };



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

                                <svg height='40' className={`arrow-icon ${openedSection === 'SHOP_ALL_CBD' && 'rotate'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z" /></svg>
                            </IconButton>

                        </div>
                        {(openedSection === 'SHOP_ALL_CBD' || window.innerWidth > 900) && (
                            <List className='list-container' >
                                <ListItem className="list-item" component={Link} to="/shop?filter=best-sellers" onClick={onLinkClick}>
                                    <span className="list-content">Best Sellers</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/shop?filter=new-products" onClick={onLinkClick}>
                                    <span className="list-content">New Products</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/shop?filter=high-potency" onClick={onLinkClick}>
                                    <span className="list-content">High Potency</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/shop?filter=featured" onClick={onLinkClick}>
                                    <span className="list-content">Featured Products</span>
                                </ListItem>

                            </List>


                        )}
                    </div>

                    {/* SHOP BY CATEGORY Section */}
                    <div className="dropdown-section">
                        <div className='list-header' onClick={() => handleToggleSection('SHOP_BY_CATEGORY')}>
                            <span className="list-content">SHOP BY CATEGORY</span>
                            <IconButton className='icon-button-dropdown' sx={{ display: { md: 'none' } }}>

                                <svg height='40' className={`arrow-icon ${openedSection === 'SHOP_BY_CATEGORY' && 'rotate'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z" /></svg>
                            </IconButton>
                        </div>
                        {(openedSection === 'SHOP_BY_CATEGORY' || window.innerWidth > 900) && (
                            <List className='list-container'>
                                <ListItem className="list-item" component={Link} to="/shop?filter=gummies" onClick={onLinkClick}>
                                    <span className="list-content">CBD Gummies</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/shop?filter=oils" onClick={onLinkClick}>
                                    <span className="list-content">CBD Oils</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/shop?filter=pills" onClick={onLinkClick}>
                                    <span className="list-content">CBD Pills</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/shop?filter=topicals" onClick={onLinkClick}>
                                    <span className="list-content">CBD Topicals</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/shop?filter=smokables" onClick={onLinkClick}>
                                    <span className="list-content">CBD Smokables</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/shop?filter=edibles" onClick={onLinkClick}>
                                    <span className="list-content">CBD Edibles</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/shop?filter=cbd" onClick={onLinkClick}>
                                    <span className="list-content">THC-Free CBD</span>
                                </ListItem>


                            </List>

                        )}
                    </div>
                    {/* MORE CANNABINOIDS Section */}
                    <div className="dropdown-section">
                        <div className='list-header' onClick={() => handleToggleSection('MORE_CANNABINOIDS')}>
                            <span className="list-content"> MORE CANNABINOIDS</span>
                            <IconButton className='icon-button-dropdown' sx={{ display: { md: 'none' } }}>


                                <svg height='40' className={`arrow-icon ${openedSection === 'MORE_CANNABINOIDS' && 'rotate'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z" /></svg>
                            </IconButton>
                        </div>
                        {(openedSection === 'MORE_CANNABINOIDS' || window.innerWidth > 900) && (
                            <List className='list-container'>
                                <ListItem className="list-item" component={Link} to="/" onClick={onLinkClick}>
                                    <span className="list-content">CBN</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/" onClick={onLinkClick}>
                                    <span className="list-content">CBG</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/" onClick={onLinkClick}>
                                    <span className="list-content">CBDa</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/" onClick={onLinkClick}>
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


                                <svg height='40' className={`arrow-icon ${openedSection === 'OTHER_PRODUCTS' && 'rotate'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z" /></svg>
                            </IconButton>
                        </div>
                        {(openedSection === 'OTHER_PRODUCTS' || window.innerWidth > 900) && (
                            <List className='list-container'>
                                <ListItem className="list-item" onClick={onLinkClick} component={Link} to="/shop?filter=pet">
                                    <span className="list-content">CBD for Pets</span>
                                </ListItem>
                                <ListItem className="list-item" onClick={onLinkClick} component={Link} to="/shop?filter=pet">
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


                                <svg height='40' className={`arrow-icon ${openedSection === 'JOIN_US' && 'rotate'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z" /></svg>
                            </IconButton>
                        </div>
                        {(openedSection === 'JOIN_US' || window.innerWidth > 900) && (
                            <List className='list-container'>
                                <ListItem className="list-item" component={Link} to="/registration" onClick={onLinkClick}>
                                    <span className="list-content">Sign Up</span>
                                </ListItem>
                                {/* Add more list items if necessary */}
                            </List>
                        )}
                    </Box>

                    {/* "About Us" Section */}
                    <Box className="dropdown-section" sx={{ display: { sm: 'block', md: 'none' } }}>
                        <div className='list-header' onClick={() => handleToggleSection('ABOUT_US')} >

                            <span className="list-content">About Us</span>
                            <IconButton className='icon-button-dropdown' sx={{ display: { md: 'none' } }}>


                                <svg height='40' className={`arrow-icon ${openedSection === 'ABOUT_US' && 'rotate'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z" /></svg>
                            </IconButton>
                        </div>
                        {(openedSection === 'ABOUT_US' || window.innerWidth > 900) && (
                            <List className='list-container'>
                                <ListItem className="list-item" component={Link} to="/" onClick={onLinkClick}>
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


                                <svg height='40' className={`arrow-icon ${openedSection === 'SUPPORT' && 'rotate'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z" /></svg>
                            </IconButton>
                        </div>
                        {(openedSection === 'SUPPORT' || window.innerWidth > 900) && (
                            <List className='list-container'>
                                <ListItem className="list-item" component={Link} to="/" onClick={onLinkClick}>
                                    <span className="list-content">Customer Service</span>
                                </ListItem>

                            </List>
                        )}
                    </Box>
                </Box>

                {loading ?
                    <Box><CircularProgress /></Box> :
                    <Box className='dropdown-featured'>
                        <legend className='dropdown-featured-header' >Featured Products</legend>
                        {featuredProducts.map((product) => (
                            <Box onClick={() => {
                                setQuickViewProduct(product._id);
                                setQuickViewOpen(true);
                            }} className='drowdown-featured-container' key={product._id}> {/* Use `_id` or appropriate key property */}
                                <img className='dropdown-featured-img' alt='featured' src={product.imgSource[0].url.split('/upload/').join('/upload/c_fill,h_50,w_50/f_auto,q_auto:good/')}
                                    loading='lazy' />
                                <Box>

                                    <Box className='dropdown-featured-name'>{product.name}</Box>

                                    <Box className='dropdown-featured-price' >${product.price}
                                        <Button variant='outlined' sx={buttonStyle} className='dropdown-featured-button' >Quick View</Button>
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
            <Suspense fallback={<CircularProgress />}>
                <QuickView
                    productId={quickViewProduct}
                    open={quickViewOpen}
                    handleClose={() => setQuickViewOpen(false)}
                    products={featuredProducts}
                />
            </Suspense>
        </Paper>


    );
};

export default DropdownMenu;
