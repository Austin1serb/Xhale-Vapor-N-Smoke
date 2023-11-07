
import { AppBar, Toolbar, Typography, IconButton, Badge, Box, Drawer, } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import '../../Styles/TopBar.css';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import useMediaQuery from '@mui/material/useMediaQuery';
import BrandIcon from '../../assets/brandIcon.png'
import React, { useState, useEffect, useRef, } from 'react';
import { Link, } from 'react-router-dom';
import LogoutButton from '../../components/LogoutButton';
import { useCart } from '../../components/CartContext.jsx';
import Cart from '../../components/Cart';
import { useAuth } from '../../useAuth';
import DropdownMenu from '../../components/DropDownMenu';
import { RiArrowDropDownLine } from 'react-icons/ri'
import CloseIcon from '@mui/icons-material/Close';
const TopBar = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [showBorder, setShowBorder] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');
    const isMenuOpen = Boolean(anchorEl);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const { cart, } = useCart();
    const [shake, setShake] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const { isLoggedIn, logout } = useAuth();// Check if the user is logged in
    const dropdownRef = useRef(null);
    const menuIconRef = useRef(null);
    const closeIconRef = useRef(null);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
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
        // Any other logic you want to execute on logout
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
            >
                {isLoggedIn ? <MenuItem onClick={handleMenuClose}><Link style={{ textDecoration: 'none' }} to={'/details'}>Account</Link></MenuItem>
                    : null
                }
                {isLoggedIn ?
                    <MenuItem onClick={handleLogout}><LogoutButton /></MenuItem> : <MenuItem onClick={handleMenuClose}><Link style={{ textDecoration: 'none' }} to={'/login'}>Login</Link></MenuItem>
                }
            </Menu>
        </Box>
    );



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
                        sx={{ mr: 2, display: { xs: 'flex', md: 'none' }, backgroundColor: 'white', }}
                    >

                        <MenuIcon
                            style={{
                                ...iconStyles.icon,
                                transform: mobileDrawerOpen ? 'rotate(45deg)' : 'rotate(0)',
                                opacity: mobileDrawerOpen ? 0 : 1
                            }}
                            sx={{ fontSize: '32px', zIndex: 999 }}
                        />
                    </IconButton>
                    <IconButton

                        className='menu-icon'
                        aria-label="show more"
                        onClick={handleMobileMenuToggle}
                        ref={closeIconRef}
                        sx={{ mr: -4, display: { xs: 'flex', md: 'none' }, backgroundColor: 'transparent', transform: 'translateX(-65px)' }}
                    >
                        <CloseIcon
                            style={{
                                ...iconStyles.icon,
                                transform: mobileDrawerOpen ? 'rotate(0)' : 'rotate(-45deg)',
                                opacity: mobileDrawerOpen ? 1 : 0
                            }}
                            sx={{ fontSize: '32px', color: "#FE6F49" }}
                        />

                    </IconButton>



                    <Box className={`dropdown-box-mobile ${mobileDrawerOpen ? 'dropdown-visible' : ''}`} ref={dropdownRef}>
                        <DropdownMenu />
                    </Box>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        <Box component={Link} to="/" className="nav-link">
                            <Box component={'img'} src={BrandIcon} alt="Brand Icon" className='brand-icon' ></Box>
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
                                    <RiArrowDropDownLine className='shop-arrow' />
                                </Box>
                                <Box className="dropdown-box" sx={{}}>
                                    <Box className='dropdown-separation'></Box>
                                    {isDropdownVisible && <DropdownMenu isVisible={isDropdownVisible} />}
                                </Box>
                            </Box>
                            <Box component="a" href="#99" className="nav-link" sx={{ marginRight: 2 }}>
                                Join Us
                            </Box>
                            <Box component="a" href="#" className="nav-link" sx={{ marginRight: 2 }}>
                                About Us
                            </Box>
                            <Box component="a" href="#" className="nav-link" sx={{ marginRight: 2 }}>
                                Support
                            </Box>

                        </Typography>
                    ) : null}
                    <Box component="a" className="nav-link" onClick={() => setDrawerOpen(true)}>
                        <IconButton sx={{ mr: -2, ml: { xs: 0, sm: 0 } }} color="inherit">
                            <Badge badgeContent={totalItems} color="secondary">
                                <ShoppingCartIcon className={shake ? 'shake-animation' : ''} sx={{ fontSize: { xs: '26px', sm: '32px' }, }}
                                />
                            </Badge>
                        </IconButton>
                    </Box>
                    <Box component="a" href="#" className="nav-link">
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                            sx={{ mr: { xs: -2, sm: 0 } }}
                        >
                            <AccountCircle sx={{ fontSize: { xs: '26px', sm: '32px' }, }} />
                        </IconButton>
                    </Box>
                    <Box>
                        <LogoutButton />
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
                    <Cart
                        setDrawerOpen={setDrawerOpen}
                    />
                </Box>
            </Drawer >
        </Box >

    );
};

export default TopBar;
