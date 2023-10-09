import React, { useState, useEffect } from 'react';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    TextField,
    Select,
    MenuItem,
    Snackbar,
} from '@mui/material';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filterCriteria, setFilterCriteria] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [page, setPage] = useState(1); // Current page
    const [perPage, setPerPage] = useState(1); // Number of items per page
    const [totalPages, setTotalPages] = useState(1); // Total number of pages
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    useEffect(() => {
        // Fetch orders from your backend API with pagination parameters
        fetch(`http://localhost:8000/api/order?page=${page}&perPage=${perPage}`)
            .then((response) => response.json())
            .then((data) => {
                // Update the state with the retrieved orders and total pages
                setOrders(data.orders);
                setTotalPages(data.totalPages);
            })
            .catch((error) => {
                console.error('Error fetching orders:', error);
            });
    }, [page, perPage]);

    // ... Rest of your code for filtering and searching ...

    // Function to handle changing the page
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };
    // Function to filter orders based on the filter criteria and search keyword
    const filterOrders = () => {
        const filtered = orders.filter((order) => {
            return (
                (filterCriteria === '' || order.orderStatus === filterCriteria) &&
                (searchKeyword === '' ||
                    order._id.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                    order.customer.toLowerCase().includes(searchKeyword.toLowerCase()))
            );
        });
        setFilteredOrders(filtered);
    };


    // Function to perform a search based on the search keyword
    const handleSearch = () => {
        const keyword = searchKeyword.toLowerCase();
        const searchResults = orders.filter((order) => {
            // Customize this part to search through relevant order properties
            return (
                order._id.toLowerCase().includes(keyword) ||
                order.customer.toLowerCase().includes(keyword)
            );
        });
        setFilteredOrders(searchResults);
    };
    // Function to handle changing the order status
    const handleOrderStatusChange = (event, orderId) => {
        const newStatus = event.target.value;

        // Send a PUT request to update the order status
        fetch(`http://localhost:8000/api/order/${orderId}`, {
            method: 'PUT', // Use 'PUT' or 'PATCH' based on your server API
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
                // Handle any errors that occurred during the update
                // You can show an error message to the user if needed

                // Show an error message to the user
                setSnackbarMessage('Error updating order status');
                setSnackbarOpen(true);
            });
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // When filterCriteria or searchKeyword changes, update the filteredOrders
    useEffect(() => {
        if (filterCriteria || searchKeyword) {
            filterOrders();
        } else {
            // If no filters or search, show all orders
            setFilteredOrders(orders);
        }
    }, [filterCriteria, searchKeyword, orders]);

    return (
        <div>
            <h2>Order List</h2>
            <TextField
                label="Search by keyword"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <Select value={filterCriteria} onChange={(e) => setFilterCriteria(e.target.value)}>
                <MenuItem value="">All Orders</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="Shipped">Shipped</MenuItem>
                {/* Add more filter options based on order status */}
            </Select>
            <Button onClick={handleSearch}>Search</Button>
            <Table>
                {/* Table headers */}
                <TableHead>
                    <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Customer Name</TableCell>
                        <TableCell>Order Date</TableCell>
                        <TableCell>Order Total</TableCell>
                        <TableCell>Order Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                {/* Table body */}
                <TableBody>
                    {filteredOrders.map((order) => (
                        <TableRow key={order._id}>
                            <TableCell>{order._id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{order.orderDate}</TableCell>
                            <TableCell>{order.totalAmount}</TableCell>
                            <TableCell>{order.orderStatus}</TableCell>
                            <TableCell>
                                <Select
                                    value={order.orderStatus}
                                    onChange={(e) => handleOrderStatusChange(e, order._id)}
                                >
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="Processing">Processing</MenuItem>
                                    <MenuItem value="Shipped">Shipped</MenuItem>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Button>Edit</Button>
                                <Button>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* Pagination controls */}
            <div>
                <Button onClick={() => handlePageChange(page - 1)}>Previous</Button>
                <span>Page {page} of {totalPages}</span>
                <Button onClick={() => handlePageChange(page + 1)}>Next</Button>
            </div>
            <div>
                <span>showing {perPage} item per page out of {totalPages} pages</span>
                <Button disabled={totalPages === 1 ? (true) : (false)} onClick={() => setPerPage(perPage + 1)}>more</Button>
                <Button disabled={perPage === 1 ? (true) : (false)} onClick={() => setPerPage(perPage - 1)}>less</Button>
            </div>
            {/* Snackbar for success/error messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000} // Adjust as needed
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </div>
    );
};

export default OrderList;
