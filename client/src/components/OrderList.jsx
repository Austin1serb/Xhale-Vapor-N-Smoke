import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { TextField, Select, MenuItem, Snackbar, Button, FormControl, InputLabel, Box, CircularProgress, Typography, Card, CardContent } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import { FcCancel, FcCheckmark, FcProcess, FcShipped } from 'react-icons/fc';
import { MdOutlinePendingActions } from 'react-icons/md';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [filterCriteria, setFilterCriteria] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetch('http://localhost:8000/api/order')
            .then((response) => response.json())
            .then((data) => {
                setOrders(data);
                setLoading(false);  // Set loading to false once data is fetched
            })
            .catch((error) => {
                console.error('Error fetching orders:', error);
                setLoading(false);  // Also set loading to false on an error
            });
    }, []);



    // Use this effect to filter and update filteredOrders
    useEffect(() => {
        filterOrders();

    }, [searchKeyword, filterCriteria]);

    //const handleSearch = () => {
    //    filterOrders();
    //};

    const filterOrders = () => {
        const filtered = orders.filter((order) => {
            return (
                (filterCriteria === '' || order.orderStatus === filterCriteria) &&
                (!searchKeyword || searchKeyword === '' ||
                    order._id.toLowerCase().includes(searchKeyword.toLowerCase()))
            );
        });
        setFilteredOrders(filtered);
    };




    const handleOrderStatusChange = (event, orderId) => {
        if (event && event.target) {
            const newStatus = event.target.value;

            // Send a PUT request to update the order status
            fetch(`http://localhost:8000/api/order/${orderId}`, {
                method: 'PUT',
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

                    // Show a success message to the user
                    setSnackbarMessage(`Order status updated to ${updatedOrder.orderStatus}`);
                    setSnackbarOpen(true);
                })
                .catch((error) => {
                    console.error('Error updating order status:', error);

                    // Show an error message to the user
                    setSnackbarMessage('Error updating order status');
                    setSnackbarOpen(true);
                });
        }
    };

    console.log(searchKeyword)




    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const columns = [
        {
            field: '_id',
            headerName: 'Order ID',
            width: 90,
            renderCell: (params) => (
                <Tooltip title={params.value}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {params.value}
                    </div>
                </Tooltip>
            ),
        },

        { field: 'orderNumber', headerName: 'Number', width: 90 },
        {
            field: 'customer',
            headerName: 'Customer ID',
            width: 150,
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
            width: 125,
            valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
        },
        //{
        //    field: 'products',
        //    headerName: 'Product',
        //    width: 125,
        //    renderCell: (params) => <div>{params.row.products[0].product}</div>
        //},
        { field: 'totalAmount', headerName: 'Order Total', width: 100 },
        {
            field: 'shippingAddress',
            headerName: 'Shipping Address',
            width: 250,
            valueFormatter: ({ value }) =>
                `${value.street}, ${value.city}, ${value.state}, ${value.zipCode}, ${value.country}`,
            renderCell: (params) => (
                <Tooltip title={`${params.value.street}, ${params.value.city}, ${params.value.state}, ${params.value.zipCode}, ${params.value.country}`}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {params.value.street}, {params.value.city}, {params.value.state}, {params.value.zipCode}, {params.value.country}
                    </div>
                </Tooltip>
            ),
        },
        {
            field: 'orderStatus',
            headerName: 'Order Status',
            width: 170,
            renderCell: (params) => (
                <Select
                    fullWidth
                    sx={{ height: 50, ml: -1 }}
                    value={params.row.orderStatus}
                    onChange={(e) => handleOrderStatusChange(e, params.row._id)}

                >
                    <MenuItem value="Pending">
                        <MdOutlinePendingActions color='blue' /> Pending
                    </MenuItem>
                    <MenuItem value="Processing">
                        <FcProcess /> Processing
                    </MenuItem>
                    <MenuItem value="Shipped">
                        <FcShipped /> Shipped
                    </MenuItem>
                    <MenuItem value="Delivered">
                        <FcCheckmark /> Delivered
                    </MenuItem>
                    <MenuItem value="Cancelled">
                        <FcCancel /> Cancelled
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
            <Typography variant="h4" gutterBottom>Order List</Typography>
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
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
                                <MenuItem value="Processing">Processing</MenuItem>
                                <MenuItem value="Shipped">Shipped</MenuItem>
                                <MenuItem value="Delivered">Delivered</MenuItem>
                                <MenuItem value="Cancelled">Cancelled</MenuItem>
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

        </Box>

    );
};

export default OrderList;
