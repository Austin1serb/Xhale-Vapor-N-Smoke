// src/store/slices/checkoutSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeStep: 0,
    cartItems: [],
    shippingDetails: {},
    // ... other state variables ...
};

export const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        setActiveStep: (state, action) => {
            state.activeStep = action.payload;
        },
        setCartItems: (state, action) => {
            state.cartItems = action.payload;
        },
        setShippingDetails: (state, action) => {
            state.shippingDetails = action.payload;
        },
        // ... other reducers ...
    },
});

// Export actions
export const { setActiveStep, setCartItems, setShippingDetails } = checkoutSlice.actions;

// Export reducer
export default checkoutSlice.reducer;
