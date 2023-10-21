import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, CircularProgress } from '@mui/material';
import AddProductModal from '../models/AddProductModal.jsx';
import EditProductModal from '../models/EditProductModal.jsx';
import { DataGrid } from '@mui/x-data-grid';

const API_URL = 'http://localhost:8000/api/product/';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    const formatDate = (dateString) => {
        if (dateString) {
            const date = new Date(dateString);

            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            };

            return new Intl.DateTimeFormat('en-US', options).format(date);
        } else {
            // Handle the case where dateString is null or undefined
            return 'Date Not Found';
        }
    };


    useEffect(() => {
        // Fetch products from your backend API
        fetch(API_URL)
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
                setIsLoading(false);
            })
            .catch((error) => {
                setError(error);
                setIsLoading(false);
                console.error('Error fetching products:', error);
            });
    }, []);

    const handleOpenAddProductModal = () => {
        setAddProductModalOpen(true);
    };

    const handleCloseAddProductModal = () => {
        setAddProductModalOpen(false);
    };
    const handleCloseEditProductModal = () => {
        setAddProductModalOpen(false);
        setEditModalOpen(false);
        setSelectedProduct(null); // Reset selectedProduct when the edit modal is closed
    };

    const handleAddProduct = (newProductData) => {
        // You can update the 'products' state with the new product data here
        setProducts([...products, newProductData]);
        handleCloseAddProductModal();
    };
    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setEditModalOpen(true);
    };


    const handleUpdateProduct = (updatedProduct) => {
        console.log("Updating product:", updatedProduct);
        setProducts((prevProducts) => {
            console.log("Previous products:", prevProducts);
            // Map through the previous products and replace the one with the matching _id
            return prevProducts.map((product) =>
                product._id === updatedProduct._id ? updatedProduct : product
            );
        });
    };





    //console.log(products)

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
            {isLoading ? (
                <CircularProgress />
            ) : error ? (
                <Typography variant="body1" color="error">
                    Error loading products: {error.message}
                </Typography>
            ) : (
                <DataGrid
                    ////for date time converstion
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
                        { field: 'price', headerName: 'Price', flex: 1, valueFormatter: ({ value }) => (typeof value === 'number' ? value.toFixed(2) : 'N/A') },


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
            )}
            <AddProductModal
                open={isAddProductModalOpen || isEditModalOpen}
                onClose={handleCloseEditProductModal}
                selectedProduct={selectedProduct}
                onAddProduct={handleAddProduct} // For adding a product
                onUpdateProduct={handleUpdateProduct} // For updating a product

            />


        </Box>
    );
};

export default ProductList;
