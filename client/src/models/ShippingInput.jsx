// ShippingInput.js

import React from 'react';
import { FormControl, FormLabel, Box, TextField } from '@mui/material';

const ShippingInput = ({ weight, length, width, height, handleChange }) => {
    return (
        <FormControl

            sx={{
                width: '97%',

                pl: 1,
                py: 1,
                pr: 1,
                border: 1,
                borderRadius: 1,
                borderColor: '#CACACA',
                '&:hover': {
                    borderColor: 'black',
                    '& .form-label-sx': {
                        color: '#1776D1',

                        transition: 'color 0.4s, ',

                    },
                },
                ' &:not(:hover)': {
                    '& .form-label-sx': {
                        color: 'initial', // Return the text color to its original state

                        transition: 'color 0.4s',
                    },
                },
            }}
            component="fieldset"
        >
            <FormLabel
                className="form-label-sx"
                sx={{
                    fontSize: 16,

                }}
                component="legend">Shipping Details (Optional).</FormLabel>
            <Box sx={{
                display: 'flex', alignItems: 'center', flexDirection: {
                    sm: 'row',
                    xs: 'column',
                },
            }} >
                <TextField
                    sx={{ my: 2 }}
                    name="shipping.weight"
                    label="Weight (oz)"
                    type="number"
                    fullWidth
                    value={weight}
                    onChange={handleChange}
                    onWheel={(e) => e.target.blur()}
                />
                <TextField
                    sx={{ my: 2 }}
                    name="shipping.dimensions.length"
                    label="Length (in)"
                    type="number"
                    fullWidth
                    value={length}
                    onChange={handleChange}
                    onWheel={(e) => e.target.blur()}
                />
                <TextField
                    sx={{ my: 2 }}
                    name="shipping.dimensions.width"
                    label="Width (in)"
                    type="number"
                    fullWidth
                    value={width}
                    onChange={handleChange}
                    onWheel={(e) => e.target.blur()}
                />
                <TextField
                    sx={{ my: 2 }}
                    name="shipping.dimensions.height"
                    label="Height (in)"
                    type="number"
                    fullWidth
                    value={height}
                    onChange={handleChange}
                    onWheel={(e) => e.target.blur()}
                />
            </Box>
        </FormControl>
    );
}

export default ShippingInput;
