// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import checkoutReducer from './slices/checkoutSlice';


export const store = configureStore({
    reducer: {
        checkout: checkoutReducer,
    },
});
