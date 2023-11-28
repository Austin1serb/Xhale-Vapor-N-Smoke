import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Grid,
    Paper,
    Drawer,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Box,
    ListItemIcon,
    Menu,
    MenuItem,
    Button,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import ProductList from '../components/ProductList';
import UserList from '../components/UserList';
import OrderList from '../components/OrderList';
import SalesOverview from '../components/SalesOverview';
import { useAuth } from '../components/Utilities/useAuth';
import { Link } from 'react-router-dom';


const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState('AdminDashboard');
    const [anchorEl, setAnchorEl] = useState(null);
    const { isLoggedIn, logout, isAdmin } = useAuth();
    // Function to handle menu open
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Function to handle menu close
    const handleMenuClose = () => {
        setAnchorEl(null);
    };


    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleSidebarItemClick = (component) => {
        setSelectedComponent(component);
        setSidebarOpen(false);
    };


    const handleLogout = () => {
        logout();

    };
    // Function to generate sidebar menu items
    const generateSidebarItems = () => {
        const menuItems = [
            {
                icon: <svg height='24' version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enableBackground="new 0 0 48 48">
                    <polygon fill="#E8EAF6" points="42,39 6,39 6,23 24,6 42,23" />
                    <g fill="#C5CAE9">
                        <polygon points="39,21 34,16 34,9 39,9" />
                        <rect x="6" y="39" width="36" height="5" />
                    </g>
                    <polygon fill="#B71C1C" points="24,4.3 4,22.9 6,25.1 24,8.4 42,25.1 44,22.9" />
                    <rect x="18" y="28" fill="#D84315" width="12" height="16" />
                    <rect x="21" y="17" fill="#01579B" width="6" height="6" />
                    <path fill="#FF8A65" d="M27.5,35.5c-0.3,0-0.5,0.2-0.5,0.5v2c0,0.3,0.2,0.5,0.5,0.5S28,38.3,28,38v-2C28,35.7,27.8,35.5,27.5,35.5z" />
                </svg>, text: 'Dashboard Home', component: 'AdminDashboard'
            },
            {
                icon: <svg height='24' version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enableBackground="new 0 0 48 48">
                    <g fill="#3F51B5">
                        <polygon points="17.8,18.1 10.4,25.4 6.2,21.3 4,23.5 10.4,29.9 20,20.3" />
                        <polygon points="17.8,5.1 10.4,12.4 6.2,8.3 4,10.5 10.4,16.9 20,7.3" />
                        <polygon points="17.8,31.1 10.4,38.4 6.2,34.3 4,36.5 10.4,42.9 20,33.3" />
                    </g>
                    <g fill="#90CAF9">
                        <rect x="24" y="22" width="20" height="4" />
                        <rect x="24" y="9" width="20" height="4" />
                        <rect x="24" y="35" width="20" height="4" />
                    </g>
                </svg>, text: 'Product List', component: 'productList'
            },
            {
                icon: <svg height='24' version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enableBackground="new 0 0 48 48">
                    <polygon fill="#FF9800" points="24,37 19,31 19,25 29,25 29,31" />
                    <g fill="#FFA726">
                        <circle cx="33" cy="19" r="2" />
                        <circle cx="15" cy="19" r="2" />
                    </g>
                    <path fill="#FFB74D" d="M33,13c0-7.6-18-5-18,0c0,1.1,0,5.9,0,7c0,5,4,9,9,9s9-4,9-9C33,18.9,33,14.1,33,13z" />
                    <path fill="#424242" d="M24,4c-6.1,0-10,4.9-10,11c0,0.8,0,2.3,0,2.3l2,1.7v-5l12-4l4,4v5l2-1.7c0,0,0-1.5,0-2.3c0-4-1-8-6-9l-1-2 H24z" />
                    <g fill="#784719">
                        <circle cx="28" cy="19" r="1" />
                        <circle cx="20" cy="19" r="1" />
                    </g>
                    <polygon fill="#fff" points="24,43 19,31 24,32 29,31" />
                    <polygon fill="#D32F2F" points="23,35 22.3,39.5 24,43.5 25.7,39.5 25,35 26,34 24,32 22,34" />
                    <path fill="#546E7A" d="M29,31L29,31l-5,12l-5-12c0,0-11,2-11,13h32C40,33,29,31,29,31z" />
                </svg>, text: 'User List', component: 'userList'
            },
            {
                icon: <svg height='24' version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enableBackground="new 0 0 48 48">
                    <g fill="#00BCD4">
                        <rect x="37" y="18" width="6" height="24" />
                        <rect x="29" y="26" width="6" height="16" />
                        <rect x="21" y="22" width="6" height="20" />
                        <rect x="13" y="32" width="6" height="10" />
                        <rect x="5" y="28" width="6" height="14" />
                    </g>
                    <g fill="#3F51B5">
                        <circle cx="8" cy="16" r="3" />
                        <circle cx="16" cy="18" r="3" />
                        <circle cx="24" cy="11" r="3" />
                        <circle cx="32" cy="13" r="3" />
                        <circle cx="40" cy="9" r="3" />
                        <polygon points="39.1,7.2 31.8,10.9 23.5,8.8 15.5,15.8 8.5,14.1 7.5,17.9 16.5,20.2 24.5,13.2 32.2,15.1 40.9,10.8" />
                    </g>
                </svg>, text: 'Order List', component: 'orderList'
            },
        ];

        return menuItems.map((item, index) => (
            <ListItem
                key={index}

                onClick={() => handleSidebarItemClick(item.component)}
            >
                <Button variant='text' sx={{}}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                </Button>
            </ListItem>
        ));
    };

    const menuId = 'primary-search-account-menu';


    return (
        <div>
            <AppBar position="static">
                <Toolbar sx={{ justifyContent: 'space-between', backgroundColor: '#283047' }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleSidebarToggle}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">Admin Dashboard</Typography>
                    <Box onClick={handleMenuOpen}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            sx={{ color: 'white' }}
                        >
                            <AccountCircle sx={{ fontSize: '32px' }} />
                        </IconButton>
                    </Box>
                    {/* The menu */}
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
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        sx={{ mt: 4, ml: 3 }}
                    >
                        {/* Menu items */}


                        <MenuItem key="home" onClick={handleMenuClose}>
                            <Link style={{ textDecoration: 'none', color: 'black' }} to={'/'}>Home</Link>
                        </MenuItem>
                        <MenuItem key="admin" onClick={handleMenuClose}>
                            <Link style={{ textDecoration: 'none', color: 'black' }} to={'/api/customer/admin'}>Admin</Link>
                        </MenuItem>

                        <MenuItem key="account" onClick={handleMenuClose}>
                            <Link style={{ textDecoration: 'none', color: 'black' }} to={'/details'}>Account</Link>
                        </MenuItem>
                        <MenuItem key="logout" onClick={handleLogout}>
                            <span style={{ textDecoration: 'none', cursor: 'pointer' }}>Logout</span>
                        </MenuItem>


                    </Menu>
                </Toolbar>
            </AppBar>
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper>
                            {selectedComponent === 'AdminDashboard' && (<SalesOverview />)}
                            {selectedComponent === 'productList' && <ProductList />}
                            {selectedComponent === 'userList' && <UserList />}
                            {selectedComponent === 'orderList' && <OrderList />}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            <Drawer anchor="left" open={sidebarOpen} onClose={handleSidebarToggle}>
                <List>
                    <ListItem sx={{ backgroundColor: 'inherit', textAlign: 'center' }}>
                        <ListItemText primary="MENU" />
                    </ListItem>
                    {generateSidebarItems()}
                </List>
            </Drawer>
        </div>
    );
};

export default AdminDashboard;
