import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    // Fetch products from your backend API
    useEffect(() => {
        // Replace with your API call to retrieve products
        // Example API call: fetch('/api/products')
        // Update the 'products' state with the fetched data
    }, []);

    return (
        <div>
            <Typography variant="h6">Product Management</Typography>
            <Button variant="contained" color="primary" onClick={'/* Add logic to open a modal for adding a new product */'}>
                Add Product
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>${product.price.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="primary" onClick={'/* Add logic to edit the product */'}>
                                        Edit
                                    </Button>
                                    <Button variant="outlined" color="secondary" onClick={'/* Add logic to delete the product */'}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ProductList;
