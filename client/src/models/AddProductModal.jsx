
import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    MenuItem, // Import MenuItem for category selection
} from '@mui/material';
const AddProductModal = ({ open, onClose, onAddProduct }) => {
    const [productData, setProductData] = useState({
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleAddProduct = () => {
        // Make a POST request to your API to add the product
        fetch('http://localhost:8000/api/product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        })
            .then((response) => response.json())
            .then((newProduct) => {
                // After successful creation, update the product list in the parent component
                onAddProduct(newProduct);

                // Clear the form and close the modal
                setProductData({
                    brand: '',
                    name: '',
                    price: '',
                    description: '',

                });
                onClose();
            })
            .catch((error) => {
                // Handle any errors that occurred during the POST request
                console.error('Error adding product:', error);
                // You can show an error message to the user if needed
            });
    };


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please fill in the details of the new product.
                </DialogContentText>
                <TextField
                    name="brand"
                    label="Brand"
                    fullWidth
                    value={productData.brand}
                    onChange={handleChange}
                />
                <TextField
                    name="name"
                    label="Name"
                    fullWidth
                    value={productData.name}
                    onChange={handleChange}
                />
                <TextField
                    name="price"
                    label="Price"
                    type="number"
                    fullWidth
                    value={productData.price}
                    onChange={handleChange}
                />
                <TextField
                    name="imgSource"
                    label="Image Source"
                    fullWidth
                    value={productData.imgSource}
                    onChange={handleChange}
                />
                <TextField
                    name="category"
                    label="Category"
                    fullWidth
                    value={productData.category}
                    onChange={handleChange}
                />
                <TextField
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                    fullWidth
                    value={productData.description}
                    onChange={handleChange}
                />
                <TextField
                    name="strength"
                    label="Strength (mg)"
                    type="number"
                    fullWidth
                    value={productData.strength}
                    onChange={handleChange}
                />
                <TextField
                    name="inventory"
                    label="Inventory"
                    type="number"
                    fullWidth
                    value={productData.inventory}
                    onChange={handleChange}
                />

                {/* Add more fields as needed */}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleAddProduct} color="primary">
                    Add Product
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddProductModal;