import React, { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    FormControl,
    FormLabel,
    Chip,
} from '@mui/material';

const SeoKeywordsInput = ({ seoKeywords, onAddKeyword, onRemoveKeyword }) => {
    const [newKeyword, setNewKeyword] = useState('');

    const handleAddKeyword = () => {
        if (newKeyword.trim() !== '') {
            const formattedKeyword = newKeyword.trim().toLowerCase();
            if (!seoKeywords.includes(formattedKeyword)) {
                onAddKeyword(formattedKeyword);
            }

            setNewKeyword('');
        }
    };

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
                    '& .form-label-sx1': {
                        color: '#1776D1',

                        transition: 'color 0.4s, ',

                    },
                },
                ' &:not(:hover)': {
                    '& .form-label-sx1': {
                        color: 'initial', // Return the text color to its original state

                        transition: 'color 0.4s,',
                    },
                },
            }}
            component="fieldset"
        >
            <FormLabel
                className="form-label-sx1"
                sx={{
                    fontSize: 16,

                }}
                component="legend">Add SEO keywords.</FormLabel>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    spellCheck={true}
                    label="Keywords"
                    name='keywords'
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                />
                <Button
                    sx={{ fontSize: 10, m: 2 }}
                    variant="outlined"
                    color="primary"
                    onClick={handleAddKeyword}
                >
                    Add
                </Button>
            </Box>
            <Box>
                {seoKeywords.map((seoKeyword, index) => (
                    <Chip
                        sx={{
                            m: 1,
                            '&:hover': {
                                borderColor: 'red',
                            },
                        }}
                        size="small"
                        key={index}
                        label={seoKeyword}
                        onDelete={() => onRemoveKeyword(seoKeyword)}
                        color="secondary"
                        variant="outlined"
                    />
                ))}
            </Box>
        </FormControl>
    );
};

export default SeoKeywordsInput;
