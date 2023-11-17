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

    const handleFormSubmit = (event) => {
        event.preventDefault();
        // Handle form submission to update customer data
    };

    if (loading) {
        return (
            <Paper sx={{ p: 2, maxWidth: 800, margin: '0 auto', marginTop: 4 }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    Loading Account Details...
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
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="First Name"
                            fullWidth
                            value={customer?.firstName || ''}
                            onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                        />
                    </Grid>
                    {/* Add more TextField components for other fields */}
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
