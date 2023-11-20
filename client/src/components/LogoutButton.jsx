import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();
    const isLoggedIn = Boolean(localStorage.getItem('token')) || Boolean(sessionStorage.getItem('token')); // Check if the user is logged in
    const handleLogout = async () => {
        try {

            const response = await fetch('http://localhost:8000/api/customer/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                console.log('Logout successful');
                // Clear tokens and user data from local storage
                ['token', 'refreshToken', 'userFirstName', 'userLastName', 'customerId', 'userEmail'].forEach(key => {
                    localStorage.removeItem(key);
                });

                sessionStorage.clear(); // Clear session storage
                navigate('/'); // Redirect to the home page
            } else {
                console.error('Logout failed:', response.status, response.statusText);
                const data = await response.json();
                console.error('Error details:', data);
                // Display an error message to the user or take other appropriate actions
            }

        } catch (error) {
            console.error('Network error during logout:', error.message);
            // Display an error message or handle network error
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
