import { Box, Button, CircularProgress, IconButton, List, ListItem, Paper, } from '@mui/material';
import React, { Suspense, useEffect, useState } from 'react';
import '../Styles/DropDownMenu.css';
import { Link } from 'react-router-dom';
import { Collapse } from '@mui/material';


const QuickView = React.lazy(() => import('../components/QuickView'));

const DropdownMenu = ({ isVisible, onLinkClick }) => {
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

        const handleResize = () => {
            // Check if window width is greater than 900px
            if (window.innerWidth > 900) {
                if (isVisible && featuredProducts.length === 0) {
                    fetchFeaturedProducts();
                }
            } else {
                // Optionally, clear the featured products if the window is resized to less than 900px
                setFeaturedProducts([]);
            }
        };

        // Attach resize event listener
        window.addEventListener('resize', handleResize);

        // Initial check on component mount
        handleResize();

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isVisible, featuredProducts.length]);


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

    const paddingSmScreen = { pl: { xs: 5, md: 0 }, }
    return (
        <Paper elevation={0} className="dropdown" component='div' sx={{ boxShadow: '0 6px 6px rgba(0, 0, 0, 0.1)', }}
        >
            <Box className='dropdown-container'>
                <Box component='div' sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: '92%', }}>
                    <div className="dropdown-section">
                        <div className='list-header' onClick={() => {
                            handleToggleSection('SHOP_ALL_CBD');

                        }}>

                            <span className="list-content">SHOP ALL</span>

                            <IconButton className='icon-button-dropdown' sx={{ display: { md: 'none' } }}>

                                <svg height='40' className={`arrow-icon ${openedSection === 'SHOP_ALL_CBD' && 'rotate'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z" /></svg>
                            </IconButton>

                        </div>

                        <Collapse in={openedSection === 'SHOP_ALL_CBD' || window.innerWidth > 900}>
                            <List sx={paddingSmScreen} className='list-container' >
                                <ListItem className="list-item" component={Link} to="/shop" onClick={onLinkClick}>
                                    <span className="list-content">Shop All A-Z</span>
                                </ListItem>
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
                                    <span className="list-content">Featured </span>
                                </ListItem>
                            </List>
                        </Collapse>
                    </div>

                    {/* SHOP BY CATEGORY Section */}
                    <div className="dropdown-section">
                        <div className='list-header' onClick={() => handleToggleSection('SHOP_BY_CATEGORY')}>
                            <span className="list-content">SHOP BY CATEGORY</span>
                            <IconButton className='icon-button-dropdown' sx={{ display: { md: 'none' } }}>

                                <svg height='40' className={`arrow-icon ${openedSection === 'SHOP_BY_CATEGORY' && 'rotate'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z" /></svg>
                            </IconButton>
                        </div>
                        <Collapse in={openedSection === 'SHOP_BY_CATEGORY' || window.innerWidth > 900}>
                            <List sx={paddingSmScreen} className='list-container'>
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
                                <ListItem className="list-item" component={Link} to="/shop?filter=tinctures" onClick={onLinkClick}>
                                    <span className="list-content">CBD Tinctures</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/shop?filter=edibles" onClick={onLinkClick}>
                                    <span className="list-content">CBD Edibles</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/shop?filter=cbd" onClick={onLinkClick}>
                                    <span className="list-content">THC-Free CBD</span>
                                </ListItem>
                            </List>
                        </Collapse>

                    </div>
                    {/*MORE CANNABINOIDS Section*/}
                    <div className="dropdown-section">
                        <div className='list-header' onClick={() => handleToggleSection('MORE_CANNABINOIDS')}>
                            <span className="list-content"> MORE CANNABINOIDS</span>
                            <IconButton className='icon-button-dropdown' sx={{ display: { md: 'none' } }}>


                                <svg height='40' className={`arrow-icon ${openedSection === 'MORE_CANNABINOIDS' && 'rotate'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z" /></svg>
                            </IconButton>
                        </div>
                        <Collapse in={openedSection === 'MORE_CANNABINOIDS' || window.innerWidth > 900}>
                            <List sx={paddingSmScreen} className='list-container'>
                                <ListItem className="list-item" component={Link} to="/shop?filter=cbn" onClick={onLinkClick}>
                                    <span className="list-content">CBN</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/shop?filter=cbg" onClick={onLinkClick}>
                                    <span className="list-content">CBG</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/shop?filter=CBDa" onClick={onLinkClick}>
                                    <span className="list-content">CBDa</span>
                                </ListItem>
                                <ListItem className="list-item" component={Link} to="/shop?filter=delta 9" onClick={onLinkClick}>
                                    <span className="list-content">Delta 9</span>
                                </ListItem>
                            </List>
                        </Collapse>
                    </div>

                    {/* OTHER PRODUCTS Section */}
                    <div className="dropdown-section" style={{ display: `${window.innerWidth >= 900 && window.innerWidth <= 1050 ? 'none' : 'block'}` }}>

                        <div className='list-header' onClick={() => handleToggleSection('OTHER_PRODUCTS')}>
                            <span className="list-content">OTHER PRODUCTS</span>
                            <IconButton className='icon-button-dropdown' sx={{ display: { md: 'none' } }}>


                                <svg height='40' className={`arrow-icon ${openedSection === 'OTHER_PRODUCTS' && 'rotate'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z" /></svg>
                            </IconButton>
                        </div>
                        <Collapse in={openedSection === 'OTHER_PRODUCTS' || window.innerWidth > 900}>
                            <List sx={paddingSmScreen} className='list-container' >

                                <ListItem className="list-item" onClick={onLinkClick} component={Link} to="/shop?filter=mushrooms">
                                    <span className="list-content">Mushroom Gummies</span>
                                </ListItem>
                                <ListItem className="list-item" onClick={onLinkClick} component={Link} to="/shop?filter=kratom">
                                    <span className="list-content">Kratom</span>
                                </ListItem>
                                <ListItem className="list-item" onClick={onLinkClick} component={Link} to="/shop?filter=pet">
                                    <span className="list-content">CBD for Pets</span>
                                </ListItem>
                            </List>

                        </Collapse>
                    </div>
                    {/* "Join Us" Section */}
                    <Box className="dropdown-section" sx={{ display: { sm: 'block', md: 'none' } }}>
                        <div className='list-header' onClick={() => handleToggleSection('JOIN_US')}>
                            <span className="list-content">Join Us</span>
                            <IconButton className='icon-button-dropdown' sx={{ display: { md: 'none' } }}>


                                <svg height='40' className={`arrow-icon ${openedSection === 'JOIN_US' && 'rotate'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z" /></svg>
                            </IconButton>
                        </div>
                        <Collapse in={openedSection === 'JOIN_US' || window.innerWidth > 900}>

                            <List sx={paddingSmScreen} className='list-container'>
                                <ListItem className="list-item" component={Link} to="/registration" onClick={onLinkClick}>
                                    <span className="list-content">Sign Up</span>
                                </ListItem>
                                {/* Add more list items if necessary */}
                            </List>
                        </Collapse>
                    </Box>

                    {/* "About Us" Section */}
                    <Box className="dropdown-section" sx={{ display: { sm: 'block', md: 'none' } }}>
                        <div className='list-header' onClick={() => handleToggleSection('ABOUT_US')} >

                            <span className="list-content">About Us</span>
                            <IconButton className='icon-button-dropdown' sx={{ display: { md: 'none' } }}>


                                <svg height='40' className={`arrow-icon ${openedSection === 'ABOUT_US' && 'rotate'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z" /></svg>
                            </IconButton>
                        </div>
                        <Collapse in={openedSection === 'ABOUT_US' || window.innerWidth > 900}>
                            <List sx={paddingSmScreen} className='list-container'>
                                <ListItem className="list-item" component={Link} to="/about" onClick={onLinkClick}>
                                    <span className="list-content">Our Story</span>
                                </ListItem>
                                {/* Add more list items if necessary */}
                            </List>
                        </Collapse>
                    </Box>

                    {/* "Support" Section */}
                    <Box className="dropdown-section" sx={{ display: { sm: 'block', md: 'none' }, mb: 2 }}>
                        <div className='list-header' onClick={() => handleToggleSection('SUPPORT')}>
                            <span className="list-content">Support</span>
                            <IconButton className='icon-button-dropdown' sx={{ display: { md: 'none' } }}>


                                <svg height='40' className={`arrow-icon ${openedSection === 'SUPPORT' && 'rotate'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z" /></svg>
                            </IconButton>
                        </div>
                        <Collapse in={openedSection === 'SUPPORT' || window.innerWidth > 900}>
                            <List sx={paddingSmScreen} className='list-container'>
                                <ListItem className="list-item" component={Link} to="/contact" onClick={onLinkClick}>
                                    <span className="list-content">Customer Service</span>
                                </ListItem>

                            </List>
                        </Collapse>
                    </Box>
                </Box>

                {loading ?
                    <Box><CircularProgress /></Box> :
                    <Box className='dropdown-featured' sx={{ ml: { ms: 0, lg: -10 } }}>
                        <legend className='dropdown-featured-header' >Featured Products</legend>
                        {featuredProducts.map((product) => (
                            <Box onClick={() => {
                                setQuickViewProduct(product._id);
                                setQuickViewOpen(true);
                            }} className='drowdown-featured-container' key={product._id}> {/* Use `_id` or appropriate key property */}
                                <img className='dropdown-featured-img' alt='featured' src={product.imgSource[0].url}
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
                Herba Natural Co
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
