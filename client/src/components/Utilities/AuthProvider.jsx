import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [customerId, setCustomerId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            try {

                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.isAdmin === true) {
                    setIsAdmin(true)

                }
                else {
                    setIsAdmin(false)

                }
                if (decodedToken.exp < currentTime) {
                    console.log('Access token expired, attempting to refresh');
                    refreshAccessToken(); // Call to refresh the access token
                } else {
                    setIsLoggedIn(true);
                    setCustomerId(decodedToken.customerId);
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                logout();
            }
        } else {
            setIsLoggedIn(false);
            setCustomerId(null);
        }
    }, [navigate]);


    const logout = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/customer/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                console.log('Logout successful');
                ['token', 'refreshToken', 'userFirstName', 'userLastName', 'customerId', 'userEmail', 'isGuest'].forEach(key => {
                    localStorage.removeItem(key);
                });
                sessionStorage.clear(); // Clear session storage
                setIsLoggedIn(false); // Update the logged in state
                navigate('/'); // Redirect to the home page
                setCustomerId(null);
                window.alert('USER SUCCESSFULLY LOGGED OUT')
            } else {
                console.error('Logout failed:', response.status, response.statusText);
                const data = await response.json();
                console.error('Error details:', data);
                // Handle error as needed
            }
        } catch (error) {
            console.error('Network error during logout:', error.message);
            // Handle network error as needed
        }
        ['token', 'refreshToken', 'userFirstName', 'userLastName', 'customerId', 'userEmail', 'isGuest'].forEach(key => {
            localStorage.removeItem(key);
        });
        //sessionStorage.clear(); // Clear session storage
        //setIsLoggedIn(false); // Update the logged in state
        //navigate('/'); // Redirect to the home page
        //setCustomerId(null);
    }
    //funciton to delete user
    const deleteUser = async () => {

        ['token', 'refreshToken', 'userFirstName', 'userLastName', 'customerId', 'userEmail'].forEach(key => {
            localStorage.removeItem(key);
        });
        sessionStorage.clear(); // Clear session storage
        setIsLoggedIn(false); // Update the logged in state
        navigate('/'); // Redirect to the home page
        window.alert('USER SUCCESSFULLY DELETED')
    }


    const refreshAccessToken = async () => {
        try {
            console.log("refreshing token..")
            const response = await fetch('http://localhost:8000/api/customer/refresh', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to refresh access token');
            }

            const data = await response.json();
            const newAccessToken = data.accessToken;

            // Update access token in local or session storage
            localStorage.setItem('token', newAccessToken);
            const decodedToken = jwtDecode(newAccessToken);
            setCustomerId(decodedToken.customerId);
            setIsLoggedIn(true);
        } catch (error) {
            console.error('Error refreshing access token:', error);
            logout(); // Logout if token refresh fails
        }
    };





    return (
        <AuthContext.Provider value={{ isLoggedIn, logout, setIsLoggedIn, deleteUser, customerId, setCustomerId, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
