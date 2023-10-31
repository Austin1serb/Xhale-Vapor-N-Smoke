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
import { FcTodoList, FcBusinessman, FcComboChart, FcHome } from 'react-icons/fc';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import ProductList from '../components/ProductList';
import UserList from '../components/UserList';
import OrderList from '../components/OrderList';
import SalesOverview from '../components/SalesOverview';

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState('AdminDashboard');

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleSidebarItemClick = (component) => {
        setSelectedComponent(component);
        setSidebarOpen(false);
    };

    // Function to generate sidebar menu items
    const generateSidebarItems = () => {
        const menuItems = [
            { icon: <FcHome />, text: 'Dashboard Home', component: 'AdminDashboard' },
            { icon: <FcTodoList />, text: 'Product List', component: 'productList' },
            { icon: <FcBusinessman />, text: 'User List', component: 'userList' },
            { icon: <FcComboChart />, text: 'Order List', component: 'orderList' },
        ];

        return menuItems.map((item, index) => (
            <ListItem
                key={index}
                button
                onClick={() => handleSidebarItemClick(item.component)}
            >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
            </ListItem>
        ));
    };

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
                        <Paper>
                            {selectedComponent === 'AdminDashboard' && (
                                <div>
                                    <SalesOverview />
                                    {/* Add summary widgets and charts here */}
                                </div>
                            )}
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
