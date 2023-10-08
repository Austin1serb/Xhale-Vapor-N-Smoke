import React from 'react';
import { AppBar, Toolbar, Typography, Container, Grid, Paper } from '@mui/material';

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
                            {/* Add content for product management here */}
                            <Typography variant="h6">Product Management</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper>
                            {/* Add content for order history here */}
                            <Typography variant="h6">Order History</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                            {/* Add content for financial data here */}
                            <Typography variant="h6">Financial Data</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default AdminDashboard;
