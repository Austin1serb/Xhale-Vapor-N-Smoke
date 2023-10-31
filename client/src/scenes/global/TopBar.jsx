
import { AppBar, Toolbar, Typography, IconButton, Badge, Box, Drawer, List, ListItem, ListItemText, ListItemIcon, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import '../../Styles/TopBar.css';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import useMediaQuery from '@mui/material/useMediaQuery';
import BrandIcon from '../../assets/brandIcon.png'
import React, { useState, useEffect, } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from '../../components/LogoutButton';
import { FcShop } from 'react-icons/fc';
import { useCart } from '../../components/CartContext.jsx';
import Cart from '../../components/Cart';
import { useAuth } from '../../useAuth';

const TopBar = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [showBorder, setShowBorder] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');
    const isMenuOpen = Boolean(anchorEl);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    const navigate = useNavigate();

    const { cart, } = useCart();
    const [shake, setShake] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);



    const { isLoggedIn, logout } = useAuth();// Check if the user is logged in

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

    const handleMobileMenuOpen = () => {
        setMobileDrawerOpen(true);
    };

    const handleMobileMenuClose = () => {
        setMobileDrawerOpen(false);
    };
    const handleLogout = () => {
        logout();
        // Any other logic you want to execute on logout
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



    const renderMobileMenu = (
        <Drawer
            anchor="left" // You can change the anchor to "left" if needed
            open={mobileDrawerOpen}
            onClose={handleMobileMenuClose}
        >
            <div style={{ width: 250 }}>
                <MenuItem onClick={handleMobileMenuClose}>
                    {/* Your menu items here */}
                    <List variant="body1" sx={{ flexGrow: 1 }}  >
                        <ListItem sx={{ backgroundColor: 'inherit', textAlign: 'center' }}>
                            <ListItemText primary="MENU" />
                        </ListItem>

                        <ListItem component="a" href="/shop" className="nav-link" sx={{ marginRight: 2 }}>
                            <ListItemIcon sx={{ fontSize: 20 }}>
                                <FcShop />
                            </ListItemIcon>
                            <ListItemText primary="SHOP" />
                        </ListItem>

                        <ListItem component="a" href="#99" className="nav-link" sx={{ marginRight: 2 }}>
                            <ListItemIcon sx={{ fontSize: 20 }}>
                                <FcShop />
                            </ListItemIcon>
                            <ListItemText primary="SUBSCRIBE" />
                        </ListItem>
                        <ListItem component="a" href="#" className="nav-link" sx={{ marginRight: 2 }}>
                            <ListItemIcon sx={{ fontSize: 20 }}>
                                <FcShop />
                            </ListItemIcon>
                            <ListItemText primary="30 Day TRIAL" />
                        </ListItem>
                        <ListItem component="a" href="#" className="nav-link" sx={{ marginRight: 2 }}>
                            Support
                        </ListItem>
                        <ListItem component="a" href="#" className="nav-link">
                            Reviews
                        </ListItem>
                    </List>
                </MenuItem>
            </div>
        </Drawer>
    );


    return (
        <Box sx={{ flexGrow: 1, mb: 10 }}   >
            <AppBar sx={{
                background: '#F5F5F5',
                boxShadow: 'none',
                borderBottom: showBorder ? '0.1px solid #000' : 'none', // Border conditionally based on scroll
                transition: 'border-bottom 0.3s', // Smooth transition
            }}>
                <Toolbar>

                    <IconButton
                        className='menu-icon'
                        aria-label="show more"
                        onClick={handleMobileMenuOpen}
                        sx={{ mr: 2, display: { xs: 'flex', md: 'none' }, backgroundColor: 'white' }}
                    >
                        <MenuIcon sx={{ fontSize: '32px' }} />
                    </IconButton>

                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        <Box component="a" href="/" className="nav-link">
                            <Box component={'img'} src={BrandIcon} alt="Brand Icon" className='brand-icon' ></Box>
                        </Box>
                    </Typography>
                    {!isMobile ? (
                        <Typography className='nav-typography' variant="body1" sx={{ flexGrow: 10, display: { sm: 'none', md: 'flex', fontFamily: "freight-display-pro, serif " } }}  >
                            <Box component="a" href="/shop" className="nav-link" sx={{ marginRight: 2 }}>
                                Shop
                            </Box>
                            <Box component="a" href="#99" className="nav-link" sx={{ marginRight: 2 }}>
                                Subscribe
                            </Box>
                            <Box component="a" href="#" className="nav-link" sx={{ marginRight: 2 }}>
                                30-Day Trial
                            </Box>
                            <Box component="a" href="#" className="nav-link" sx={{ marginRight: 2 }}>
                                Support
                            </Box>
                            <Box component="a" href="#" className="nav-link">
                                Reviews
                            </Box>
                        </Typography>
                    ) : null}
                    <Box component="a" className="nav-link" onClick={() => setDrawerOpen(true)}>
                        <IconButton color="inherit">
                            <Badge badgeContent={totalItems} color="secondary">
                                <ShoppingCartIcon className={shake ? 'shake-animation' : ''} sx={{ fontSize: '32px' }}

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
                        >
                            <AccountCircle sx={{ fontSize: '32px' }} />
                        </IconButton>
                    </Box>
                    <Box>
                        <LogoutButton />
                    </Box>
                </Toolbar >
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
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
