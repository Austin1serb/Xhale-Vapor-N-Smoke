import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, ...rest }) => {
    let isAuthenticated = false;
    let isAdmin = false;
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            isAuthenticated = true;
            isAdmin = decodedToken.isAdmin;
        } catch (error) {
            console.error('Error decoding token', error);
        }
    }

    return isAuthenticated && isAdmin ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
