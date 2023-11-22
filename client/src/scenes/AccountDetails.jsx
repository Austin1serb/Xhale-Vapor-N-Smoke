import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import {
    Paper,
    Typography,
    Box,
    Button,
    TextField,
    Grid,
    CircularProgress,
} from '@mui/material';

function AccountDetails() {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.customerId;
            fetchCustomerData(userId);
        }
    }, [navigate]);

    const fetchCustomerData = (userId) => {
        fetch(`http://localhost:8000/api/customer/${userId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setCustomer(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching customer data:', error);
            });
    };
    const handleChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };


    const handleFormSubmit = (event) => {
        event.preventDefault();
        // Handle form submission to update customer data
    };

    if (loading) {
        return (
            <Paper sx={{ p: 2, maxWidth: 800, margin: '0 auto', marginTop: 4 }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    Loading Account Details...
                    <CircularProgress />
                </Typography>
                {/* You can add Skeleton loaders here */}
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 2, maxWidth: 800, margin: '0 auto', marginTop: 4 }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Account Details
            </Typography>
            <form onSubmit={handleFormSubmit}>
                <Grid container spacing={2}>
                    {/* Add more fields here */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="First Name"
                            fullWidth
                            name="firstName"
                            value={customer?.firstName || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Last Name"
                            fullWidth
                            name="lastName"
                            value={customer?.lastName || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            fullWidth
                            name="email"
                            value={customer?.email || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    {/* Address Line 1 */}
                    <Grid item xs={12}>
                        <TextField
                            label="Address"
                            fullWidth
                            name="address"
                            value={customer?.address || ''}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* Address Line 2 */}
                    <Grid item xs={12}>
                        <TextField
                            label="Address 2"
                            fullWidth
                            name="address2"
                            value={customer?.address2 || ''}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* City */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="City"
                            fullWidth
                            name="city"
                            value={customer?.city || ''}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* State */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="State"
                            fullWidth
                            name="state"
                            value={customer?.state || ''}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* Zip Code */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Zip"
                            fullWidth
                            name="zip"
                            value={customer?.zip || ''}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* Phone Number */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Phone"
                            fullWidth
                            name="phone"
                            value={customer?.phone || ''}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* Country */}
                    <Grid item xs={12}>
                        <TextField
                            label="Country"
                            fullWidth
                            name="country"
                            value={customer?.country || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    {/* Remember to exclude sensitive fields like password */}
                </Grid>
                <Box sx={{ marginTop: 2 }}>
                    <Button variant="contained" color="primary" type="submit">
                        Save Changes
                    </Button>
                </Box>
            </form>
        </Paper>
    );
}

export default AccountDetails;