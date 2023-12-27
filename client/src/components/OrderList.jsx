import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { TextField, Select, MenuItem, Snackbar, FormControl, InputLabel, Box, CircularProgress, Typography, Card, CardContent, Button } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import OrderDetails from './OrderDetails';


const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [filterCriteria, setFilterCriteria] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Function to handle dialog close
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };



    useEffect(() => {

        fetch('http://localhost:8000/api/order', {
            credentials: 'include',
        })
            .then((response) => response.json())

            .then((data) => {

                setOrders(data);
                setLoading(false);  // Set loading to false once data is fetched
                filterOrders(data);
            })
            .catch((error) => {
                console.error('Error fetching orders:', error);
                setLoading(false);  // Also set loading to false on an error
            });
    }, []);

    // Function to handle order deletion
    const handleDeleteOrder = (orderId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this order? - It will be permanently deleted');
        setLoading(true);
        if (isConfirmed) {
            fetch(`http://localhost:8000/api/order/${orderId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then((response) => response.json())
                .then(() => {
                    // Update orders state to remove the deleted order
                    const updatedOrders = orders.filter(order => order._id !== orderId);
                    setOrders(updatedOrders);
                    setFilteredOrders(updatedOrders);
                    setLoading(false);
                    setSnackbarMessage('Order deleted successfully');
                    setSnackbarOpen(true);
                })
                .catch((error) => {
                    console.error('Error deleting order:', error);
                    setSnackbarMessage('Error deleting order');
                    setSnackbarOpen(true);
                    setLoading(false);
                });
        };
    };
    // Use this effect to filter and update filteredOrders
    useEffect(() => {
        filterOrders();

    }, [searchKeyword, filterCriteria,]);





    const filterOrders = (fetchedOrders = orders) => {
        const filtered = fetchedOrders.filter((order) => {
            const keyword = searchKeyword.toLowerCase();
            // Combine all product names into a single string
            const productNames = order.products
                .map((product) => product.name.toLowerCase())
                .join(' ');


            return (
                (filterCriteria === '' || order.orderStatus === filterCriteria) &&
                (keyword === '' ||
                    order._id.toLowerCase().includes(keyword) ||
                    order.customer.toLowerCase().includes(keyword) ||
                    order.orderDate.toLowerCase().includes(keyword) ||
                    order.orderStatus.toLowerCase().includes(keyword) ||
                    order.address?.toLowerCase().includes(keyword) ||
                    order.shippingMethod.provider?.toLowerCase().includes(keyword) ||

                    order.products.productId?.toString().includes(keyword) ||
                    productNames.includes(keyword)
                )
            );
        });
        setFilteredOrders(filtered);
    };






    const handleOrderStatusChange = (event, orderId) => {
        if (event && event.target) {
            const newStatus = event.target.value;
            setLoading(true);
            // Send a PUT request to update the order status
            fetch(`http://localhost:8000/api/order/${orderId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderStatus: newStatus }),
            })
                .then((response) => response.json())
                .then((updatedOrder) => {
                    // Update the order status in the client-side state
                    const updatedOrders = orders.map((order) => {
                        if (order._id === updatedOrder._id) {
                            return { ...order, orderStatus: updatedOrder.orderStatus };
                        } else {
                            return order;
                        }
                    });
                    setOrders(updatedOrders);
                    setFilteredOrders(updatedOrders)
                    // Show a success message to the user
                    setSnackbarMessage(`Order status updated to ${updatedOrder.orderStatus}`);
                    setSnackbarOpen(true);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error updating order status:', error);
                    setLoading(false);
                    // Show an error message to the user
                    setSnackbarMessage('Error updating order status');
                    setSnackbarOpen(true);
                });
        }
    };




    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleDetailsClick = (order) => {
        setSelectedOrder(order);
        setIsDialogOpen(true)
    };




    const columns = [
        {
            field: '_id',
            headerName: 'Order ID',
            flex: 2,
            renderCell: (params) => (
                <Tooltip title={params.value}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {params.value}
                    </div>
                </Tooltip>
            ),
        },

        {
            field: 'customer',
            headerName: 'Customer ID',
            flex: 1.5,
            renderCell: (params) => (
                <Tooltip title={params.value}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {params.value}
                    </div>
                </Tooltip>
            ),
        },

        {
            field: 'orderDate',
            headerName: 'Order Date',
            flex: 1,
            valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
        },
        {
            field: 'address',
            headerName: 'Shipping To',
            flex: 1.5,

        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1.5,
            renderCell: (params) => (
                <Box>

                    <Button
                        sx={{ fontSize: 10, p: 1 }}
                        variant="outlined"
                        onClick={() => handleDetailsClick(params.row)}
                    >
                        Details
                    </Button>
                    <Button sx={{ fontSize: 10, m: 1, p: 1 }} variant="outlined" color="secondary" onClick={() => handleDeleteOrder(params.row._id)}>
                        Delete
                    </Button>
                </Box>
            )
        },


        {
            field: 'orderStatus',
            headerName: 'Order Status',
            flex: 1.5,
            renderCell: (params) => (
                <Select
                    fullWidth
                    sx={{ height: 50, ml: -1 }}
                    value={params.row.orderStatus}
                    onChange={(e) => handleOrderStatusChange(e, params.row._id)}

                >
                    <MenuItem value="Pending" >

                        <svg color='blue' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M17 12c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm1.65 7.35L16.5 17.2V14h1v2.79l1.85 1.85-.7.71zM18 3h-3.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H6c-1.1 0-2 .9-2 2v15c0 1.1.9 2 2 2h6.11a6.743 6.743 0 0 1-1.42-2H6V5h2v3h8V5h2v5.08c.71.1 1.38.31 2 .6V5c0-1.1-.9-2-2-2zm-6 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" /></svg>
                        Pending
                    </MenuItem>
                    <MenuItem value="Shipped">
                        <svg height='24' version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enableBackground="new 0 0 48 48">
                            <path fill="#8BC34A" d="M43,36H29V14h10.6c0.9,0,1.6,0.6,1.9,1.4L45,26v8C45,35.1,44.1,36,43,36z" />
                            <path fill="#388E3C" d="M29,36H5c-1.1,0-2-0.9-2-2V9c0-1.1,0.9-2,2-2h22c1.1,0,2,0.9,2,2V36z" />
                            <g fill="#37474F">
                                <circle cx="37" cy="36" r="5" />
                                <circle cx="13" cy="36" r="5" />
                            </g>
                            <g fill="#78909C">
                                <circle cx="37" cy="36" r="2" />
                                <circle cx="13" cy="36" r="2" />
                            </g>
                            <path fill="#37474F" d="M41,25h-7c-0.6,0-1-0.4-1-1v-7c0-0.6,0.4-1,1-1h5.3c0.4,0,0.8,0.3,0.9,0.7l1.7,5.2c0,0.1,0.1,0.2,0.1,0.3V24 C42,24.6,41.6,25,41,25z" />
                            <polygon fill="#DCEDC8" points="21.8,13.8 13.9,21.7 10.2,17.9 8,20.1 13.9,26 24,15.9" />
                        </svg>Shipped
                    </MenuItem>
                    <MenuItem value="Delivered" >
                        <svg height='24' version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enableBackground="new 0 0 48 48">
                            <polygon fill="#43A047" points="40.6,12.1 17,35.7 7.4,26.1 4.6,29 17,41.3 43.4,14.9" />
                        </svg> Delivered
                    </MenuItem>
                    <MenuItem value="Canceled">
                        <svg height='24' version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enableBackground="new 0 0 48 48">
                            <path fill="#D50000" d="M24,6C14.1,6,6,14.1,6,24s8.1,18,18,18s18-8.1,18-18S33.9,6,24,6z M24,10c3.1,0,6,1.1,8.4,2.8L12.8,32.4 C11.1,30,10,27.1,10,24C10,16.3,16.3,10,24,10z M24,38c-3.1,0-6-1.1-8.4-2.8l19.6-19.6C36.9,18,38,20.9,38,24C38,31.7,31.7,38,24,38 z" />
                        </svg> Canceled
                    </MenuItem>
                </Select>
            ),
        },
    ];


    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (

        <Box sx={{ m: 3, py: 5 }}>
            <Typography variant="h4" gutterBottom>Order List </Typography>

            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            name='searchBar'
                            sx={{ mr: 5, flexGrow: 1 }}
                            label="Search by keyword"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        <FormControl sx={{ width: '20%' }}>
                            <InputLabel sx={{ backgroundColor: 'white', px: 1 }}>Order Status</InputLabel>
                            <Select value={filterCriteria} onChange={(e) => setFilterCriteria(e.target.value)}
                                defaultValue='All Orders'>
                                <MenuItem value="">All Orders</MenuItem>
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Shipped">Shipped</MenuItem>
                                <MenuItem value="Delivered">Delivered</MenuItem>
                                <MenuItem value="Canceled">Canceled</MenuItem>
                                {/* Add more filter options based on order status */}
                            </Select>
                        </FormControl>
                    </Box>
                </CardContent>
            </Card>
            <DataGrid
                getRowId={(row) => row._id}
                rows={filteredOrders}
                columns={columns}
                components={{ Toolbar: GridToolbar }}
                onCellClick={(params) => {
                    if (params.field === 'orderStatus') {
                        // Handle cell click for order status change
                        handleOrderStatusChange(params.event, params.row._id);
                    }
                }}
            />
            {/* Snackbar for success/error messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
            {
                filteredOrders.length === 0 && !loading && <Typography variant='h4' sx={{ textAlign: "center" }} >No orders found based on the current filter/search criteria.</Typography>
            }
            {selectedOrder && <OrderDetails order={selectedOrder} open={isDialogOpen}
                onClose={handleCloseDialog} />}
        </Box>

    );
};

export default OrderList;
