import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import {
    Paper,
    Typography,
    Skeleton,
    Box,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function AccountDetails() {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            // If the user is not logged in, navigate to the login page
            navigate('/login');
        } else {
            // Decode the token to get the user's ID (assuming the token contains user information)
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;

            // Send the user's ID to your backend to retrieve their account details
            fetchCustomerData(userId);
        }
    }, [navigate]);

    const fetchCustomerData = (userId) => {
        // Make an API request to your backend to get the customer data
        fetch(`http://localhost:8000/api/customer/${userId}`)
            .then((response) => {
                if (!response.ok) {
                    throw Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setCustomer(data); // Update the customer state with the retrieved data
                setLoading(false); // Set loading to false when data is loaded
            })
            .catch((error) => {
                console.error(error);
                // Handle errors, e.g., display an error message to the user
            });
    };

    const getRowId = (row) => row._id; // Use the _id field as the unique row ID

    return (
        <Paper sx={{ p: 2, maxWidth: 600, margin: '0 auto', marginTop: 4 }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Account Details
            </Typography>
            {loading ? (
                // Display a skeleton while loading
                <Box>
                    <Skeleton sx={{ width: '100%', height: 100 }} />
                    <Skeleton sx={{ width: '100%', height: 200 }} />
                </Box>
            ) : (
                <DataGrid
                    rows={customer ? [customer] : []}
                    columns={[
                        { field: 'firstName', headerName: 'First Name', flex: 1 },
                        { field: 'lastName', headerName: 'Last Name', flex: 1 },
                        { field: 'email', headerName: 'Email', flex: 1 },
                    ]}
                    getRowId={getRowId} // Provide the getRowId function
                    sx={{ height: 300 }} // Adjust the height as needed
                />
            )}
        </Paper>
    );
}

export default AccountDetails;
