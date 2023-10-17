import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();
    const isLoggedIn = Boolean(localStorage.getItem('token')) || Boolean(sessionStorage.getItem('token')); // Check if the user is logged in

    const refreshToken = localStorage.getItem('refreshToken'); // Retrieve the refreshToken

    const handleLogout = async () => {
        // Retrieve the refreshToken


        console.log('user logged out')
        try {
            // Make a request to log the user out using the refreshToken
            const response = await fetch('http://localhost:8000/api/customer/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (response.ok) {
                // If the logout is successful on the server, clear tokens in the frontend
                localStorage.removeItem('token'); // Clear access token
                localStorage.removeItem('refreshToken'); // Clear refresh token
                sessionStorage.clear(); // Clear tokens from session storage

                // Redirect to the login page or any other appropriate action
                navigate('/');
            } else {
                // Handle logout failure, display an error message, etc.
            }
        } catch (error) {
            // Handle error when making the logout request
            console.error('Logout failed:', error);
            // You can display an error message or take appropriate action
        }
    };

    return (
        isLoggedIn && (
            <Button variant="outlined" color="secondary" onClick={handleLogout}>
                Logout
            </Button>
        )
    );
};

export default LogoutButton;
