// useAuth.js
import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        setIsLoggedIn(Boolean(token));
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token); // or sessionStorage based on preference
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return {
        isLoggedIn,
        login,
        logout
    };
};
