import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, CircularProgress } from '@mui/material';
import AddProductModal from '../models/AddProductModal.jsx';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DetailsView from './DetailsView.jsx';

const API_URL = 'http://localhost:8000/api/product/';

const ProductList = () => {
    const [detailsViewOpen, setDetailsViewOpen] = useState(false);
    const [selectedProductForDetails, setSelectedProductForDetails] = useState(null);

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
                month: 'numeric',
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
        setIsLoading(true);

        fetch(API_URL, {
            credentials: 'include',
        })
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
    const handleOpenDetailsView = (product) => {
        setSelectedProductForDetails(product);
        setDetailsViewOpen(true);
    };







    const handleUpdateProduct = (updatedProduct) => {
        setProducts((prevProducts) => {
            // Map through the previous products and replace the one with the matching _id
            return prevProducts.map((product) =>
                product._id === updatedProduct._id ? updatedProduct : product
            );
        });
    };





    const handleDeleteProduct = (productId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');

        if (confirmDelete) {
            fetch(`http://localhost:8000/api/product/${productId}`, {
                credentials: 'include',
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
        <Box sx={{ p: 2, m: 2 }}>
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
                    sx={{}}
                    //for date time converstion

                    rows={products.map(product => ({
                        ...product,

                        createdAt: formatDate(product.createdAt), // Format the date


                    }))}

                    //rows={products}
                    columns={[
                        //{ field: '_id', headerName: 'ID', flex: 1 },
                        //{ field: 'brand', headerName: 'Brand', flex: 1 },

                        {
                            field: 'imgSource',
                            headerName: 'Image',
                            flex: 0.5,
                            renderCell: (params) => (
                                <img
                                    src={params.row.imgSource[0].url}
                                    alt="Product"
                                    style={{ width: '50px', height: '50px' }}
                                    loading='lazy'
                                />
                            ),
                        },
                        { field: 'name', headerName: 'Name', flex: 1 },
                        //{ field: 'description', headerName: 'Description', flex: 1 },
                        { field: 'category', headerName: 'Category', flex: 1 },
                        { field: 'specs', headerName: 'Specs', flex: 1 },
                        { field: 'totalSold', headerName: 'Sold', flex: 0.25 },
                        //{ field: 'strength', headerName: 'Strength', flex: 1 },
                        //{ field: 'isFeatured', headerName: 'Featured', flex: 1 },
                        //{ field: 'seoKeywords', headerName: 'SEO', flex: 1 },
                        //{ field: 'seoTitle', headerName: 'SEO Title', flex: 1, valueGetter: (params) => params.row.seo.title, },
                        //{ field: 'seDescription', headerName: 'SEO Description', flex: 1, valueGetter: (params) => params.row.seo.description, },
                        //{ field: 'shipping', headerName: 'Shipping Info', flex: 1, valueGetter: (params) => params.row.shipping.weight, },
                        { field: 'price', headerName: 'Price', flex: 0.5, valueFormatter: ({ value }) => (typeof value === 'number' ? value.toFixed(2) : 'N/A') },
                        { field: 'createdAt', headerName: 'Date Added', flex: 0.75 },


                        {
                            field: 'actions',
                            headerName: 'Actions',
                            flex: 1.75,

                            renderCell: (params) => (
                                <Box sx={{ ml: -1 }} >
                                    <Button
                                        sx={{ fontSize: 8, mr: 1 }}
                                        variant="outlined"
                                        color="success"
                                        onClick={() => handleOpenDetailsView(params.row)}
                                    >
                                        Details
                                    </Button>
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
                    components={{ Toolbar: GridToolbar }}
                />
            )}
            <AddProductModal
                open={isAddProductModalOpen || isEditModalOpen}
                onClose={handleCloseEditProductModal}
                selectedProduct={selectedProduct}
                onAddProduct={handleAddProduct} // For adding a product
                onUpdateProduct={handleUpdateProduct} // For updating a product

            />

            {/* Render the DetailsView component when detailsViewOpen is true */}
            {detailsViewOpen && (
                <DetailsView
                    open={detailsViewOpen}
                    product={selectedProductForDetails}
                    onClose={() => setDetailsViewOpen(false)}
                />
            )}


        </Box>
    );
};

export default ProductList;



