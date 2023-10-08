import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

const EditProductModal = ({ open, onClose, product, onUpdateProduct }) => {
    const [editedProductData, setEditedProductData] = useState({
        brand: '',
        name: '',
        price: '',
        imgSource: '',
        category: '', // Add category field
        description: '',
        strength: '',
        inventory: '',
        ingredients: [],
        reviews: [],
        discounts: [],
        isFeatured: false,
        tags: [],
        images: [],
        relatedProducts: [],
        seo: {
            title: '',
            description: '',
            keywords: [],
        },
        shipping: {
            weight: '',
            dimensions: {
                length: '',
                width: '',
                height: '',
            },
        },
    });

    // Set initial form values based on the selected product
    useEffect(() => {
        if (product) {
            setEditedProductData({
                brand: product.brand || '',
                name: product.name || '',
                price: product.price.toString() || '',
                imgSource: product.imgSource || '',
                category: product.category || '', // Add category field
                description: product.description || '',
                strength: product.strength.toString() || '',
                inventory: product.inventory.toString() || '',
                ingredients: product.ingredients || [],
                reviews: product.reviews || [],
                discounts: product.discounts || [],
                isFeatured: product.isFeatured || false,
                tags: product.tags || [],
                images: product.images || [],
                relatedProducts: product.relatedProducts || [],
                seo: {
                    title: product.seo ? product.seo.title || '' : '',
                    description: product.seo ? product.seo.description || '' : '',
                    keywords: product.seo ? product.seo.keywords || [] : [],
                },
                shipping: {
                    weight: product.shipping ? product.shipping.weight || '' : '',
                    dimensions: {
                        length: product.shipping ? product.shipping.dimensions.length || '' : '',
                        width: product.shipping ? product.shipping.dimensions.width || '' : '',
                        height: product.shipping ? product.shipping.dimensions.height || '' : '',
                    },
                },
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedProductData({
            ...editedProductData,
            [name]: value,
        });
    };

    const handleUpdate = () => {
        // Make a PUT request to update the product data
        fetch(`/api/product/${product.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedProductData),
        })
            .then((response) => response.json())
            .then((updatedProduct) => {
                // Call the onUpdateProduct function to update the product data in the parent component
                onUpdateProduct(updatedProduct);
                // Close the modal
                onClose();
            })
            .catch((error) => {
                console.error('Error updating product:', error);
            });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogContent>
                <TextField
                    name="brand"
                    label="Brand"
                    fullWidth
                    value={editedProductData.brand}
                    onChange={handleChange}
                />
                <TextField
                    name="name"
                    label="Name"
                    fullWidth
                    value={editedProductData.name}
                    onChange={handleChange}
                />
                <TextField
                    name="price"
                    label="Price"
                    type="number"
                    fullWidth
                    value={editedProductData.price}
                    onChange={handleChange}
                />
                {/* Add more fields as needed */}
                {/* For example, the category field */}
                <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                        name="category"
                        value={editedProductData.category}
                        onChange={handleChange}
                    >
                        <MenuItem value="Vape">Vape</MenuItem>
                        <MenuItem value="Cartridge">Cartridge</MenuItem>
                        <MenuItem value="Gummy">Gummy</MenuItem>
                        {/* Add more category options */}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleUpdate} color="primary">
                    Update Product
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProductModal;
