import React, { useState, useEffect } from 'react';
import { Typography, Button, Box } from '@mui/material';
import AddProductModal from '../models/AddProductModal.jsx';
import EditProductModal from '../models/EditProductModal.jsx';
import { DataGrid } from '@mui/x-data-grid';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
    const [isEditProductModalOpen, setEditProductModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    useEffect(() => {
        // Fetch products from your backend API
        fetch('http://localhost:8000/api/product/')
            .then((response) => response.json())
            .then((data) => {
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

    const handleAddProduct = (newProductData) => {
        // You can update the 'products' state with the new product data here
        setProducts([...products, newProductData]);
        handleCloseAddProductModal();
    };
    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setEditProductModalOpen(true);
    };
    const handleUpdateProduct = (updatedProduct) => {
        const updatedProducts = products.map((product) => {
            if (product._id === updatedProduct._id) {
                return updatedProduct;
            }
            return product;
        });

        setProducts(updatedProducts);
    };

    const handleDeleteProduct = (productId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');

        if (confirmDelete) {
            fetch(`http://localhost:8000/api/product/${productId}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
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
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }} >
                <Typography variant="h6">Product Management</Typography>
                <Button variant="outlined" color="success" onClick={handleOpenAddProductModal}>
                    Add Product
                </Button>
            </Box>
            <DataGrid
                //for date time converstion
                rows={products.map(product => ({
                    ...product,
                    createdAt: formatDate(product.createdAt), // Format the date
                }))}
                //rows={products}
                columns={[
                    { field: '_id', headerName: 'ID', flex: 1 },
                    { field: 'name', headerName: 'Name', flex: 1 },
                    { field: 'description', headerName: 'Description', flex: 1 },
                    { field: 'category', headerName: 'Category', flex: 1 },
                    { field: 'createdAt', headerName: 'Date Added', flex: 1 },
                    { field: 'price', headerName: 'Price', flex: 1, valueFormatter: ({ value }) => `${value.toFixed(2)}` },
                    {
                        field: 'actions',
                        headerName: 'Actions',
                        flex: 1,
                        renderCell: (params) => (
                            <Box sx={{ ml: -1 }} >
                                <Button sx={{ fontSize: 8, mr: 1 }} variant="outlined" color="primary" onClick={() => handleEditProduct(params.row)}>
                                    Edit
                                </Button>
                                <Button sx={{ fontSize: 8 }} variant="outlined" color="secondary" onClick={() => handleDeleteProduct(params.row._id)}>
                                    Delete
                                </Button>
                            </Box>
                        ),
                    },
                ]}
                autoHeight
                disableSelectionOnClick
                getRowId={(row) => row._id}
            />

            <AddProductModal
                open={isAddProductModalOpen}
                onClose={handleCloseAddProductModal}
                onAddProduct={handleAddProduct}
            />

            <EditProductModal
                open={isEditProductModalOpen}
                onClose={() => setEditProductModalOpen(false)}
                product={selectedProduct}
                onUpdateProduct={handleUpdateProduct}
            />
        </Box>
    );
};

export default ProductList;
