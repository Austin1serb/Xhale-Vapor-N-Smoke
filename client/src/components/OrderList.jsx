import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { TextField, Select, MenuItem, Snackbar, FormControl, InputLabel, Box, CircularProgress, Typography, Card, CardContent } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

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

    const handleSearch = () => {
        filterOrders();
    };

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
                `${value.address}, ${value.city}, ${value.state}, ${value.zipCode}, ${value.country}`,
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

                        <svg color='blue' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M17 12c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm1.65 7.35L16.5 17.2V14h1v2.79l1.85 1.85-.7.71zM18 3h-3.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H6c-1.1 0-2 .9-2 2v15c0 1.1.9 2 2 2h6.11a6.743 6.743 0 0 1-1.42-2H6V5h2v3h8V5h2v5.08c.71.1 1.38.31 2 .6V5c0-1.1-.9-2-2-2zm-6 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" /></svg>
                        Pending
                    </MenuItem>
                    <MenuItem value="Processing">
                        <svg height='24' version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enableBackground="new 0 0 48 48">
                            <g fill="#9C27B0">
                                <polygon points="31,8 42.9,9.6 33.1,19.4" />
                                <polygon points="17,40 5.1,38.4 14.9,28.6" />
                                <polygon points="8,17 9.6,5.1 19.4,14.9" />
                                <path d="M9.3,21.2L5.1,22C5,22.7,5,23.3,5,24c0,4.6,1.6,9,4.6,12.4l3-2.6C10.3,31.1,9,27.6,9,24 C9,23.1,9.1,22.1,9.3,21.2z" />
                                <path d="M24,5c-5.4,0-10.2,2.3-13.7,5.9l2.8,2.8C15.9,10.8,19.7,9,24,9c0.9,0,1.9,0.1,2.8,0.3l0.7-3.9 C26.4,5.1,25.2,5,24,5z" />
                                <path d="M38.7,26.8l4.2-0.8c0.1-0.7,0.1-1.3,0.1-2c0-4.4-1.5-8.7-4.3-12.1l-3.1,2.5c2.2,2.7,3.4,6.1,3.4,9.5 C39,24.9,38.9,25.9,38.7,26.8z" />
                                <path d="M34.9,34.3C32.1,37.2,28.3,39,24,39c-0.9,0-1.9-0.1-2.8-0.3l-0.7,3.9c1.2,0.2,2.4,0.3,3.5,0.3 c5.4,0,10.2-2.3,13.7-5.9L34.9,34.3z" />
                                <polygon points="40,31 38.4,42.9 28.6,33.1" />
                            </g>
                        </svg>Processing
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
                    <MenuItem value="Delivered">
                        <svg height='24' version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enableBackground="new 0 0 48 48">
                            <polygon fill="#43A047" points="40.6,12.1 17,35.7 7.4,26.1 4.6,29 17,41.3 43.4,14.9" />
                        </svg> Delivered
                    </MenuItem>
                    <MenuItem value="Cancelled">
                        <svg height='24' version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enableBackground="new 0 0 48 48">
                            <path fill="#D50000" d="M24,6C14.1,6,6,14.1,6,24s8.1,18,18,18s18-8.1,18-18S33.9,6,24,6z M24,10c3.1,0,6,1.1,8.4,2.8L12.8,32.4 C11.1,30,10,27.1,10,24C10,16.3,16.3,10,24,10z M24,38c-3.1,0-6-1.1-8.4-2.8l19.6-19.6C36.9,18,38,20.9,38,24C38,31.7,31.7,38,24,38 z" />
                        </svg> Cancelled
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
