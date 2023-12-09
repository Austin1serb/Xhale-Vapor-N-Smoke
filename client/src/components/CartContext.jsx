import React, { createContext, useState, useContext } from 'react';
import { Box, Snackbar } from '@mui/material';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [name, setName] = useState('')

    const [notes, setNotes] = useState('');


    const updateNotes = (newNotes) => {
        setNotes(newNotes);
    };

    const addToCart = (product, quantity = 1) => {
        const existingProduct = cart.find(item => item.product._id === product._id);
        setOpenSnackbar(true);
        setName(product.name)

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
        setCart(prevCart => prevCart.map(item =>
            item.product._id === productId
                ? { ...item, quantity: Math.max(quantity, 1) } // Ensures quantity is never less than 1
                : item
        ));
    };

    const clearCart = () => {
        setCart([]); // This sets the cart to an empty array, effectively clearing it
    };



    const truncatedName = name.length > 30 ? name.slice(0, 30) + '...' : name;


    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, adjustQuantity, notes, updateNotes, clearCart, setNotes }}>
            {children}



            <Snackbar
                sx={{
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: '#282F48', // Background color of the snackbar
                        color: 'white',            // Text color of the snackbar
                    },


                }}
                open={openSnackbar}
                autoHideDuration={2000} // Snackbar will close after 2 seconds
                onClose={() => setOpenSnackbar(false)}
                message={`${truncatedName} - has been added to the cart.`}
                action={<React.Fragment>
                    <Box>
                        <svg height='24' version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enableBackground="new 0 0 48 48">
                            <polygon fill="#43A047" points="40.6,12.1 17,35.7 7.4,26.1 4.6,29 17,41.3 43.4,14.9" />
                        </svg>
                    </Box>
                </React.Fragment>}
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
