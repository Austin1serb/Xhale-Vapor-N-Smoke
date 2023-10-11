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
} from '@mui/material';
import { FcTodoList, FcBusinessman, FcComboChart, FcHome } from "react-icons/fc";
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu';
import ProductList from '../components/ProductList';
import UserList from '../components/UserList';
import OrderList from '../components/OrderList';
import SalesOverview from '../components/SalesOverview';

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState(null);

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleSidebarItemClick = (component) => {
        setSelectedComponent(component);
        setSidebarOpen(false); // Close the sidebar when an item is clicked
    };

    return (
        <div>
            <AppBar position="static">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleSidebarToggle}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">Admin Dashboard</Typography>
                    <Box component="a" href="#" className="nav-link">
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            color="inherit"
                        >
                            <AccountCircle sx={{ fontSize: '32px' }} />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <SalesOverview />
                        <Paper>
                            {selectedComponent === 'AdminDashboard' && <SalesOverview />}
                            {selectedComponent === 'productList' && <ProductList />}
                            {selectedComponent === 'userList' && <UserList />}
                            {selectedComponent === 'orderList' && <OrderList />}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            <Drawer anchor="left" open={sidebarOpen} onClose={handleSidebarToggle}>
                <List>
                    <ListItem sx={{ backgroundColor: '', text: 'center' }} >
                        <ListItemText primary='MENU' />
                    </ListItem>
                    <ListItem button onClick={() => handleSidebarItemClick('AdminDashboard')}>
                        <ListItemIcon>
                            <FcHome />
                        </ListItemIcon>

                        <ListItemText primary="Dashboard Home" />
                    </ListItem>
                    <ListItem button onClick={() => handleSidebarItemClick('productList')}>
                        <ListItemIcon>
                            <FcTodoList />
                        </ListItemIcon>

                        <ListItemText primary="Product List" />
                    </ListItem>
                    <ListItem button onClick={() => handleSidebarItemClick('userList')}>
                        <ListItemIcon>
                            <FcBusinessman />
                        </ListItemIcon>
                        <ListItemText primary="User List" />
                    </ListItem>
                    <ListItem button onClick={() => handleSidebarItemClick('orderList')}>
                        <ListItemIcon>
                            <FcComboChart />
                        </ListItemIcon>
                        <ListItemText primary="Order List" />
                    </ListItem>
                </List>

            </Drawer>

        </div>
    );
};

export default AdminDashboard;
