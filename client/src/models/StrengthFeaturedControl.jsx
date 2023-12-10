// StrengthFeaturedControl.js

import React from 'react';
import {
    Box, FormControl, FormLabel, RadioGroup,
    FormControlLabel, Radio, Typography
} from '@mui/material';

const StrengthFeaturedControl = ({
    selectedStrength,
    handleStrengthChange,
    productData,
    handleChange,
    error
}) => {
    return (
        <Box sx={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: {
                sm: 'row',
                xs: 'column',
            },

        }}>
            <FormControl sx={{
                my: 4,
                pl: 1,
                pb: 1,
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

                        transition: 'color 0.4s, ',
                    },
                },
            }} component="fieldset">
                <FormLabel
                    sx={{
                        fontSize: 16,
                        pr: 0.5,
                        pl: .5,
                    }}
                    className='form-label-sx'
                    component="legend"
                >Strength</FormLabel>
                <RadioGroup
                    row
                    aria-label="strength"
                    name="strength"
                    value={selectedStrength}
                    onChange={handleStrengthChange}
                >
                    <FormControlLabel
                        value="low"
                        control={<Radio />}
                        label="Low"
                    />
                    <FormControlLabel
                        value="medium"
                        control={<Radio />}
                        label="Medium"
                    />
                    <FormControlLabel
                        value="high"
                        control={<Radio />}
                        label="High"
                    />
                </RadioGroup>
                {error && (
                    <Typography variant='caption' sx={{ ml: 1.2 }} color="error">
                        {error.strength}
                    </Typography>
                )}
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'end' }} >
                <FormControl
                    sx={{
                        pl: 1,
                        pr: 3,
                        pb: 1,
                        border: 1,
                        borderRadius: 1,
                        borderColor: '#CACACA',
                        '&:hover': {
                            borderColor: 'black',
                            '& .form-label-sx': {
                                color: '#1776D1',

                                transition: 'color 0.4s',

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
                    <FormLabel sx={{
                        fontSize: 16,

                        pl: .5,


                    }}
                        className='form-label-sx' component="legend">Feature on Home page?</FormLabel>
                    <RadioGroup
                        row
                        aria-label="isFeatured"
                        name="isFeatured"
                        value={Boolean(productData.isFeatured)} // Use the actual Boolean value
                        onChange={handleChange}
                    >
                        <FormControlLabel
                            value={Boolean(true)}
                            control={<Radio />}
                            label="Yes"
                        />
                        <FormControlLabel
                            value={Boolean(false)}
                            control={<Radio />}
                            label="No"
                        />
                    </RadioGroup>
                </FormControl>
            </Box>
        </Box>

    );
}

export default StrengthFeaturedControl;
