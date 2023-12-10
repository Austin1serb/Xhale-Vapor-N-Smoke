// SEOSection.js

import React from 'react';
import { FormControl, FormLabel, Box, TextField } from '@mui/material';
import SeoKeywordsInput from '../components/SeoKeywordsInput';  // Adjust the path accordingly

const SEOSection = ({ productData, handleChange, handleAddKeyword, handleRemoveKeyword }) => {
    return (
        <FormControl

            sx={{
                width: '97%',
                my: 2,
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

                        transition: 'color 0.4s, ',
                    },
                },
            }}
            component="fieldset"
        >
            <FormLabel
                className='form-label-sx'
                component="legend">   Search Engine Optimization (Optional)</FormLabel>
            <Box sx={{}} >
                {/*<Typography variant="body2" sx={{ mt: 2, ml: '25%' }}>
                            Search Engine Optimization (Optional)
                        </Typography>*/}

                <TextField
                    sx={{ my: 2 }}
                    name="seo.title"
                    label="SEO Title"
                    fullWidth
                    value={productData.seo['title'] ? productData.seo['title'] : ''}

                    onChange={handleChange}
                />
                <TextField
                    sx={{ my: 2 }}
                    name="seo.description"
                    label="SEO Description"
                    fullWidth
                    multiline
                    rows={2}
                    value={productData.seo['description']}
                    onChange={handleChange}
                />

                {/* SEO Keywords Input Component */}
                <SeoKeywordsInput
                    seoKeywords={productData.seoKeywords}
                    onAddKeyword={handleAddKeyword}
                    onRemoveKeyword={handleRemoveKeyword}
                />

            </Box>
        </FormControl>
    );
}

export default SEOSection;
