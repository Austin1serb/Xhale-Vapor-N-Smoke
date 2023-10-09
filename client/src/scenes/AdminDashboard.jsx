import React from 'react';
import { AppBar, Toolbar, Typography, Container, Grid, Paper } from '@mui/material';
import ProductList from '../components/ProductList';
import UserList from '../components/UserList';
import OrderList from '../components/OrderList';

const AdminDashboard = () => {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Admin Dashboard</Typography>
                </Toolbar>
            </AppBar>
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Paper>
                            <ProductList />

                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper>
                            {/* Add content for order history here */}
                            <Typography variant="h6">Order History</Typography>
                            <OrderList />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                            <Typography variant="h6">Financial Data</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            <Container>
                <Grid container spacing={3}>
                    <Paper>

                        <Typography variant="h6">User Management</Typography>
                        <UserList />
                    </Paper>
                </Grid>
            </Container>
        </div>
    );
};

export default AdminDashboard;
