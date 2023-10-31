import React, { createContext, useState, useContext } from 'react';
import { Snackbar, Button, IconButton } from '@mui/material';
import { FcCheckmark } from 'react-icons/fc';

import Confetti from 'react-confetti';
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [name, setName] = useState('')


    const [runConfetti, setRunConfetti] = useState(false);

    const addToCart = (product, quantity = 1) => {
        const existingProduct = cart.find(item => item.product._id === product._id);
        setOpenSnackbar(true);
        setName(product.name)
        setRunConfetti(true);
        setTimeout(() => setRunConfetti(false), 5000);
        if (existingProduct) {
            setCart(prevCart => prevCart.map(item =>
                item.product._id === product._id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            ));
        } else {
            setCart(prevCart => [...prevCart, { product, quantity }]);
        }
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.product._id !== productId));
    };

    const adjustQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(prevCart => prevCart.map(item =>
                item.product._id === productId
                    ? { ...item, quantity }
                    : item
            ));
        }
    };




    //confetti

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, adjustQuantity }}>
            {children}

            {/* Confetti */}
            {runConfetti && <Confetti />}
            {/*  */}

            <Snackbar
                sx={{
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: '#282F48', // Background color of the snackbar
                        color: 'white',            // Text color of the snackbar
                    }
                }}
                open={openSnackbar}
                autoHideDuration={4000} // Snackbar will close after 6 seconds
                onClose={() => setOpenSnackbar(false)}
                message={`${name} has been successfully added to the cart.`}
                action={<React.Fragment> <FcCheckmark style={{ fontSize: 26 }} /></React.Fragment>}
            />

        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
