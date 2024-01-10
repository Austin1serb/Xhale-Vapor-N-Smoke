
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CircularProgress from '@mui/material/CircularProgress';
import '../../Styles/TopBar.css';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import BrandIcon from '../../assets/cbdhorizontaltext.webp'
import SmallBrandIcon from '../../assets/cbdiconsmall.webp'
import BrandText from '../../assets/cbdtextwicon.webp'
import React, { useState, useEffect, useRef, Suspense, } from 'react';
import { Link, } from 'react-router-dom';
import { useCart } from '../../components/CartContext.jsx';
import { useAuth } from '../../components/Utilities/useAuth';




const Cart = React.lazy(() => import('../../components/Cart'));
const DropdownMenu = React.lazy(() => import('../../components/DropDownMenu'));


const TopBar = ({ screenWidth }) => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [showBorder, setShowBorder] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');
    const isMenuOpen = Boolean(anchorEl);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const { cart, } = useCart();
    const [shake, setShake] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const { isLoggedIn, logout, isAdmin } = useAuth();// Check if the user is logged in
    const dropdownRef = useRef(null);
    const menuIconRef = useRef(null);
    const closeIconRef = useRef(null);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    useEffect(() => {
        // Determine which image to preload based on screen width
        let imageToPreload = screenWidth < 600 ? SmallBrandIcon : BrandIcon;

        // Create preload link element
        const preloadLink = document.createElement("link");
        preloadLink.href = imageToPreload;
        preloadLink.rel = "preload";
        preloadLink.as = "image";
        document.head.appendChild(preloadLink);

        // Cleanup function to remove the preload link when the component unmounts or screen width changes
        return () => {
            document.head.removeChild(preloadLink);
        };
    }, [screenWidth]); // Re-run when screenWidth changes

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                menuIconRef.current && !menuIconRef.current.contains(event.target) &&
                closeIconRef.current && !closeIconRef.current.contains(event.target)
            ) {
                setMobileDrawerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);




    useEffect(() => {

        const handleScroll = () => {
            if (window.scrollY > 0) {
                // Add border bottom when scrolling down
                setShowBorder(true);
            } else {
                // Remove border bottom when at the top
                setShowBorder(false);
            }
        };
        // Attach the scroll event listener
        window.addEventListener('scroll', handleScroll);
        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {

        if (cart.length > 0) {
            setShake(true);

            // Reset the shake effect after 500ms
            const timer = setTimeout(() => {
                setShake(false);
            }, 500);

            return () => clearTimeout(timer); // Clean up on component unmount
        }
    }, [cart]);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };



    const handleMobileMenuClose = () => {
        setMobileDrawerOpen(false);
    };
    const handleLogout = () => {
        logout();

    };
    const handleMobileMenuToggle = () => {
        setMobileDrawerOpen(prev => !prev); // toggles the value
    };
    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Box className='nav-link' >
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                id={menuId}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={isMenuOpen}
                onClose={handleMenuClose}
                sx={{ mt: 4, ml: 3 }}
            >
                {isLoggedIn ? [
                    !!isAdmin ? (<MenuItem key="admin" onClick={handleMenuClose}>
                        <Link id='link-admin' style={{ textDecoration: 'none', color: 'black' }} to={'/customer/admin'}>Admin</Link>
                    </MenuItem>) : (null),
                    <MenuItem id='link-account' key="account" onClick={handleMenuClose}>
                        <Link style={{ textDecoration: 'none', color: 'black' }} to={'/details'}>Account</Link>
                    </MenuItem>,
                    <MenuItem id='link-logout' key="logout" onClick={handleLogout}>
                        <span style={{ textDecoration: 'none', cursor: 'pointer' }}>Logout</span>
                    </MenuItem>

                ] : (
                    <MenuItem onClick={handleMenuClose}>
                        <Link style={{ textDecoration: 'none' }} to={'/login'}>Login</Link>
                    </MenuItem>
                )}

            </Menu>
        </Box>
    );

    const toggleDropdown = () => {

        setIsDropdownVisible(!isDropdownVisible);
    };

    //create use effect to setisdropdownvisible to false
    useEffect(() => {
        return () => {
            setIsDropdownVisible(true);
        };
    }
        , []);

    const handleHover = () => {
        if (window.innerWidth > 768) {
            setIsDropdownVisible(true);
        }
    };

    const handleMouseLeave = () => {
        if (window.innerWidth > 768) {
            setIsDropdownVisible(false);
        }
    };
    const iconStyles = {

        icon: {
            transition: 'transform 0.3s ease, opacity 0.3s ease',
        }
    };
    return (
        <>
            <Box className='app-bar' sx={{ flexGrow: 1, mb: 10 }}  >
                <AppBar
                    sx={{
                        background: '#F5F5F5',
                        boxShadow: 'none',
                        borderBottom: showBorder ? '0.1px solid #000' : 'none', // Border conditionally based on scroll
                        transition: 'border-bottom 0.3s', // Smooth transition
                        height: 80,
                        mb: -1
                    }}>
                    <Toolbar>
                        <IconButton
                            className='menu-icon'
                            aria-label="show more"
                            onClick={handleMobileMenuToggle}
                            ref={menuIconRef}
                            sx={{ mr: 2, display: { xs: 'flex', md: 'none' }, backgroundColor: 'white' }}
                        >


                            <svg style={{
                                ...iconStyles.icon,
                                transform: mobileDrawerOpen ? 'rotate(45deg)' : 'rotate(0)',
                                opacity: mobileDrawerOpen ? 0 : 1
                            }} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z" /></svg>
                        </IconButton>
                        <IconButton

                            className='menu-icon'
                            aria-label="show more"
                            onClick={handleMobileMenuToggle}
                            ref={closeIconRef}
                            sx={{ mr: -4, display: { xs: 'flex', md: 'none' }, backgroundColor: 'transparent', transform: 'translate(-65px, 0px)' }}
                        >

                            <svg style={{
                                ...iconStyles.icon,
                                transform: mobileDrawerOpen ? 'rotate(0)' : 'rotate(-45deg)',
                                translate: '-3px -2px',
                                opacity: mobileDrawerOpen ? 1 : 0,
                                color: "#FE6F49",

                            }} xmlns="http://www.w3.org/2000/svg" fill='currentColor' height="35" width="35"><path d="m10.458 31.458-1.916-1.916 9.5-9.542-9.5-9.542 1.916-1.916 9.542 9.5 9.542-9.5 1.916 1.916-9.5 9.542 9.5 9.542-1.916 1.916-9.542-9.5Z" /></svg>
                        </IconButton>



                        <Box className={`dropdown-box-mobile ${mobileDrawerOpen ? 'dropdown-visible' : ''}`} ref={dropdownRef}>
                            <Suspense fallback={<CircularProgress />}>
                                <DropdownMenu onLinkClick={handleMobileMenuClose} />
                            </Suspense>

                        </Box>
                        <Typography variant="h6" sx={{ flexGrow: 1, display: "flex", alignItems: 'center' }}>
                            <Box component={Link} to="/" className="nav-link">
                                <Box sx={{ display: { sm: 'none' }, ml: '31%', mt: 1 }}>
                                    <img
                                        src={BrandIcon} alt="Brand Icon" className='brand-icon' height='200' width='600' />
                                </Box>

                                <Box sx={{ display: { xs: 'none', sm: 'block' }, ml: 3, mr: 1 }}>
                                    <img src={BrandText} height='80px' width='320px' alt="brand-text" className='brand-icon' />
                                </Box>
                                <Box >
                                    <img src={SmallBrandIcon} height='250' width='250' alt="brand-icon-small" className='brand-icon-small' />
                                </Box>
                            </Box>
                            <Box>

                            </Box>
                        </Typography>
                        {!isMobile ? (
                            <Typography component='div' className='nav-typography' variant="body1" sx={{ flexGrow: 10, display: { sm: 'none', md: 'flex', }, }}  >
                                <Box className="box-relative" onMouseLeave={handleMouseLeave}>
                                    <Box
                                        component={Link}
                                        to="/shop"
                                        className="nav-link"
                                        onMouseEnter={handleHover}
                                    >
                                        Shop

                                        <svg height='27' className='shop-arrow' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z" /></svg>
                                    </Box>
                                    <Box className="dropdown-box" sx={{}}>
                                        <Box className='dropdown-separation'></Box>
                                        {isDropdownVisible &&
                                            <Suspense fallback={<CircularProgress />}>
                                                <DropdownMenu onLinkClick={toggleDropdown} isVisible={isDropdownVisible} />
                                            </Suspense>
                                        }
                                    </Box>
                                </Box>
                                <Box component={Link} to='/registration' className="nav-link" sx={{ marginRight: 2 }}>
                                    Join Us
                                </Box>
                                <Box component={Link} to="/about" className="nav-link" sx={{ marginRight: 2 }}>
                                    About Us
                                </Box>
                                <Box component={Link} to="/contact" className="nav-link" sx={{ marginRight: 2 }}>
                                    Contact
                                </Box>

                            </Typography>
                        ) : null}
                        <Box display={'flex'} alignItems={'center'} className='topbar-icon-container' >
                            <Box className="nav-link" onClick={() => setDrawerOpen(true)}>
                                <IconButton
                                    id="cart-button"
                                    aria-label={`Shopping Cart with ${totalItems} items`}
                                    name='cart-button'
                                    sx={{ mr: -2, ml: { xs: 0, sm: 0 } }}
                                    color="inherit">
                                    <Badge badgeContent={totalItems} color="secondary" sx={{ '.MuiBadge-badge': { backgroundColor: 'rgba(195, 26, 210, 0.72)', color: 'white' } }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className={shake ? 'shake-animation' : ''} width="34" height="34" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 3c0 .55.45 1 1 1h1l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h11c.55 0 1-.45 1-1s-.45-1-1-1H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A.996.996 0 0 0 20.01 4H5.21l-.67-1.43a.993.993 0 0 0-.9-.57H2c-.55 0-1 .45-1 1zm16 15c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" /></svg>
                                    </Badge>
                                    {/* Visually hidden text for screen readers */}
                                    <span style={{ position: 'absolute', left: '-9999px' }}>
                                        {`${totalItems} items in cart`}
                                    </span>
                                </IconButton>
                            </Box>
                            <Box className="nav-link">
                                <IconButton
                                    size="large"
                                    edge="end"
                                    className="profile-icon"
                                    id='profile-icon-button'
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                    sx={{ mr: { xs: -2, sm: 0 } }}
                                >

                                    <svg fill='currentColor' xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z" /></svg>


                                </IconButton>
                            </Box>
                        </Box>
                        <Box>
                        </Box>
                    </Toolbar >
                </AppBar>
                {renderMenu}
                {/* CART */}
                <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                    <Box sx={{
                        width: { xs: '250px', sm: '385px', md: '385px' },  // Responsive widths
                        py: 3,
                        height: '100vh'  // Taking up the entire viewport height
                    }}>
                        <Suspense fallback={<CircularProgress />}>
                            <Cart setDrawerOpen={setDrawerOpen} />
                        </Suspense>
                    </Box>
                </Drawer >
            </Box >
        </>
    );
};

export default TopBar;
