import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        setIsLoggedIn(Boolean(token));

    }, []);

    const logout = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/customer/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                console.log('Logout successful');
                ['token', 'refreshToken', 'userFirstName', 'userLastName', 'customerId', 'userEmail'].forEach(key => {
                    localStorage.removeItem(key);
                });
                sessionStorage.clear(); // Clear session storage
                setIsLoggedIn(false); // Update the logged in state
                navigate('/'); // Redirect to the home page
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
    };

    return {
        isLoggedIn,
        logout
    };
};
