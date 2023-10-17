import React, { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    FormControl,
    FormLabel,
    Chip,
} from '@mui/material';
const CategoryInput = ({ category, onAddCategory, onRemoveCategory }) => {
    const [newCategory, setNewCategory] = useState('');

    const handleAddCategory = () => {
        if (newCategory.trim() !== '') {
            // Convert the new category to lowercase and remove leading/trailing spaces
            const formattedCategory = newCategory.trim().toLowerCase();

            // Check if the category already exists in the list
            if (!category.includes(formattedCategory)) {
                onAddCategory(formattedCategory);
            }

            setNewCategory('');
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
                },
            }}
            component="fieldset"
        >
            <FormLabel component="legend">Add product categories.</FormLabel>
            <Box sx={{ display: 'flex', alignItems: 'center' }} >
                <TextField
                    spellCheck={true}
                    label="Categories*"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button
                    sx={{ fontSize: 10, m: 2 }}
                    variant="outlined"
                    color="primary"
                    onClick={handleAddCategory}
                >
                    Add
                </Button>
            </Box>
            <Box>
                {category.map((category, index) => (
                    <Chip
                        sx={{
                            m: 1, "&:hover": {
                                borderColor: "red",
                            },
                        }}
                        size='small'
                        key={index}
                        label={category}
                        onDelete={() => onRemoveCategory(category)}
                        color="secondary"
                        variant='outlined'
                    />
                ))}
            </Box>
        </FormControl>
    );
};

export default CategoryInput;
