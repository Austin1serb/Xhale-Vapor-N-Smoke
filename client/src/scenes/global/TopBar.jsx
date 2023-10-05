import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import '../../Styles/TopBar.css';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import useMediaQuery from '@mui/material/useMediaQuery';
import BrandIcon from '../../assets/brandIcon.png'
const TopBar = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMobile = useMediaQuery('(max-width:600px)');
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
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
                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleMenuClose}>My account</MenuItem>
            </Menu>
        </Box>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (

        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem className='nav-link' >
                <Typography variant="body1" sx={{ flexGrow: 1 }}  >
                    <Box component="a" href="#" className="nav-link" sx={{ marginRight: 2 }}>
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
            </MenuItem>
        </Menu>
    );

    return (
        <Box sx={{ flexGrow: 1, m: -1 }}   >
            <AppBar position="static" sx={{ background: '#F5F5F5', transition: 'none' }}>
                <Toolbar>

                    <IconButton
                        className='menu-icon'
                        aria-label="show more"
                        aria-controls={mobileMenuId}
                        aria-haspopup="true"
                        onClick={handleMobileMenuOpen}
                        sx={{ mr: 2, display: { xs: 'flex', md: 'none' }, backgroundColor: 'white' }}
                    >
                        <MenuIcon sx={{ fontSize: '32px' }} />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        <Box component="a" href="#" className="nav-link">
                            <Box component={'img'} src={BrandIcon} alt="Brand Icon" className='brand-icon' ></Box>
                        </Box>
                    </Typography>
                    {!isMobile ? (
                        <Typography variant="body1" sx={{ flexGrow: 1, display: { sm: 'none', md: 'flex' } }}  >
                            <Box component="a" href="#" className="nav-link" sx={{ marginRight: 2 }}>
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
                    <Box component="a" href="#" className="nav-link">
                        <IconButton
                            color="inherit"
                        >
                            <Badge badgeContent={3} color="secondary">
                                <ShoppingCartIcon sx={{ fontSize: '32px' }} />
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

                </Toolbar >
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box >
    );
};

export default TopBar;
