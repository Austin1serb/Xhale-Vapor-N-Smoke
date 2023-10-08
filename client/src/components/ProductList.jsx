import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import AddProductModal from '../models/AddProductModal.jsx';
import EditProductModal from '../models/EditProductModal.jsx';


const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [isAddProductModalOpen, setAddProductModalOpen] = useState(false); // Add state for the modal
    const [isEditProductModalOpen, setEditProductModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Fetch products from your backend API
    useEffect(() => {
        // Replace with your API call to retrieve products
        fetch('http://localhost:8000/api/product/') // Adjust the URL to match your backend endpoint
            .then((response) => response.json())
            .then((data) => {
                // Update the 'products' state with the fetched data
                setProducts(data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }, []);

    const handleOpenAddProductModal = () => {
        setAddProductModalOpen(true);
    };

    const handleCloseAddProductModal = () => {
        setAddProductModalOpen(false);
    };

    // logic to open a modal for adding a new product
    const handleAddProduct = (newProductData) => {
        // You can update the 'products' state with the new product data here
        // For example:
        setProducts([...products, newProductData]);
        // Close the "Add Product" modal
        handleCloseAddProductModal();
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setEditProductModalOpen(true);
    };
    const handleUpdateProduct = (updatedProduct) => {
        // Update the products state with the edited product data
        const updatedProducts = products.map((product) => {
            if (product.id === updatedProduct.id) {
                return updatedProduct;
            }
            return product;
        });

        setProducts(updatedProducts);
    };

    const handleDeleteProduct = (productId) => {
        // Prompt the admin for confirmation before deleting the product
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');

        if (confirmDelete) {
            // Send a DELETE request to your backend API to delete the product
            fetch(`http://localhost:8000/api/product/${productId}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        // If deletion is successful, remove the product from the products state
                        const updatedProducts = products.filter((product) => product._id !== productId);
                        setProducts(updatedProducts);
                    } else {
                        console.error('Error deleting product:', response.statusText);
                    }
                })
                .catch((error) => {
                    console.error('Error deleting product:', error);
                });
        }
    };

    return (
        <div>
            <Typography variant="h6">Product Management</Typography>
            <Button variant="contained" color="primary" onClick={handleOpenAddProductModal}>
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
                            <TableRow key={product._id}>
                                <TableCell>{product._id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>${product.price ? product.price.toFixed(2) : ''}</TableCell>

                                <TableCell>
                                    <Button variant="outlined" color="primary" onClick={() => handleEditProduct(product)}>
                                        Edit
                                    </Button>
                                    <Button variant="outlined" color="secondary" onClick={() => handleDeleteProduct(product._id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        <EditProductModal
                            open={isEditProductModalOpen}
                            onClose={() => {
                                setEditProductModalOpen(false);
                                setSelectedProduct(null);
                            }}
                            product={selectedProduct}
                            onUpdateProduct={handleUpdateProduct}
                        />
                    </TableBody>
                </Table>
            </TableContainer>

            {/* AddProductModal component */}
            <AddProductModal
                open={isAddProductModalOpen}
                onClose={handleCloseAddProductModal}
                onAddProduct={handleAddProduct}
            />
        </div>
    );
};

export default ProductList;
