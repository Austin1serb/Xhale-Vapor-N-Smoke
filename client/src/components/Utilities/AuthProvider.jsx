import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [customerId, setCustomerId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    // Constants for the retry mechanism
    const MAX_RETRY_ATTEMPTS = 3; // Maximum number of retry attempts
    const RETRY_DELAY_MS = 3000; // Delay between retries in milliseconds (e.g., 3 seconds)

    // Function to delay execution for a specified duration
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


    useEffect(() => {

        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            try {

                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.isAdmin === true || decodedToken.isAdmin === 'true') {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);


    const logout = async (attempt = 1) => {
        try {
            const response = await fetch('http://localhost:8000/api/customer/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                clearLocalStorageAndSession();
                window.alert('USER SUCCESSFULLY LOGGED OUT');
            } else {
                if (attempt < MAX_RETRY_ATTEMPTS) {
                    await delay(RETRY_DELAY_MS);
                    await logout(attempt + 1); // Retry logout
                } else {
                    console.error('Logout failed after maximum retries:', response.status, response.statusText);
                    const data = await response.json();
                    console.error('Error details:', data);
                    clearLocalStorageAndSession();
                }
            }
        } catch (error) {
            if (attempt < MAX_RETRY_ATTEMPTS) {
                console.error(`Network error during logout attempt ${attempt}, retrying...`, error.message);
                await delay(RETRY_DELAY_MS);
                await logout(attempt + 1); // Retry logout
            } else {
                console.error('Network error during logout, maximum retries reached:', error.message);
                clearLocalStorageAndSession();
            }
        }
    };

    // Function to clear local storage and session, and update state
    const clearLocalStorageAndSession = () => {
        const isVerified = localStorage.getItem('isVerified');
        localStorage.clear();
        localStorage.setItem('isVerified', isVerified); // Preserve isVerified if needed
        sessionStorage.clear(); // Clear session storage
        setIsLoggedIn(false); // Update the logged-in state
        setCustomerId(null); // Clear customer ID
        navigate('/'); // Redirect to the home page
    };


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



    // The retry mechanism for refreshing the access token
    const retryRefreshToken = async (attempt = 1) => {
        if (attempt > MAX_RETRY_ATTEMPTS) {
            console.error('Maximum retry attempts reached, logging out.');
            logout();
            return;
        }

        console.log(`Attempt ${attempt} to refresh token...`);
        try {


            const response = await fetch('http://localhost:8000/api/customer/refresh', {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to refresh access token');
            }

            const data = await response.json();
            const newAccessToken = data.accessToken;

            localStorage.setItem('token', newAccessToken);
            const decodedToken = jwtDecode(newAccessToken);
            setCustomerId(decodedToken.customerId);
            setIsLoggedIn(true);
        } catch (error) {
            console.error(`Error on retry attempt ${attempt}:`, error.message);
            await delay(RETRY_DELAY_MS);
            retryRefreshToken(attempt + 1); // Recursive call for the next attempt
        }
    };

    // The primary function to refresh the access token
    const refreshAccessToken = async () => {
        try {
            await retryRefreshToken(); // Initiate the retry mechanism
        } catch (error) {
            console.error('Error during token refresh:', error.message);
            logout(); // Logout on unhandled error
        }
    };






    return (
        <AuthContext.Provider value={{ isLoggedIn, logout, setIsLoggedIn, deleteUser, customerId, setCustomerId, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
