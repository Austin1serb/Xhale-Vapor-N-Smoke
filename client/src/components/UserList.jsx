import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditCustomerModal from '../models/EditCustomerModal';

const UserList = () => {
    const [editCustomerModalOpen, setEditCustomerModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [customers, setCustomers] = useState([]);


    useEffect(() => {
        // Fetch customer data from your backend API
        fetch('http://localhost:8000/api/customer', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })


            .then((response) => response.json())
            .then((data) => {
                // Update the state with the retrieved customer data
                setCustomers(data)

            })
            .catch((error) => {
                console.error('Error fetching customer data:', error);
            });
    }, []);

    // Derived state for admins - filter customers who are admins
    const admins = customers.filter(customer => customer.isAdmin);


    const handleMakeAdmin = (customerId) => {
        // Send request to backend to update the isAdmin flag
        fetch(`http://localhost:8000/api/customer/${customerId}`, {
            method: 'PUT', // or the appropriate method used in your backend
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            // You might need to send additional data or authentication tokens depending on your backend setup
        })
            .then((response) => response.json())
            .then((updatedCustomer) => {
                // Update the customers list in state
                setCustomers(customers.map(customer =>
                    customer._id === customerId ? { ...customer, isAdmin: true } : customer
                ));
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };


    const handleRemoveFromAdmin = (adminId) => {
        // Send request to backend to update the isAdmin flag
        fetch(`http://localhost:8000/api/customer/${adminId}`, {
            method: 'PUT', // or the appropriate method used in your backend
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            // Additional data or authentication tokens might be needed
        })
            .then((response) => response.json())
            .then(() => {
                // Update the customers list in state
                setCustomers(customers.map(customer =>
                    customer._id === adminId ? { ...customer, isAdmin: false } : customer
                ));
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleEditCustomer = (customer) => {
        setSelectedCustomer(customer);
        setEditCustomerModalOpen(true);
    };

    const buttonStyles = {
        fontSize: '10px',
        margin: '5px',
    }

    return (
        <div style={{ padding: 20, margin: 20 }}>
            <h2 style={{ margin: 10 }}>Admin List</h2>
            <DataGrid

                rows={admins}
                columns={[
                    {
                        field: 'fullName',
                        headerName: 'Full Name',
                        flex: 1,
                        renderCell: (params) => (
                            <div>{params.row.firstName} {params.row.lastName}</div>
                        )
                    },
                    { field: 'email', headerName: 'Email', flex: 1 },
                    { field: '_id', headerName: 'ID', flex: 1.25 },
                    { field: 'createdAt', headerName: 'Registration Date', flex: 0.75, valueFormatter: ({ value }) => new Date(value).toLocaleDateString(), },
                    {
                        field: 'actions',
                        headerName: 'Actions',
                        flex: 1.5,
                        renderCell: (params) => (
                            <div>
                                <Button
                                    sx={buttonStyles}
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => handleRemoveFromAdmin(params.row._id)}
                                >
                                    Remove Admin
                                </Button>
                                <Button
                                    sx={buttonStyles}
                                    variant="outlined"
                                    color="error"

                                >
                                    Delete User
                                </Button>
                            </div>
                        ),
                    },
                ]}
                autoHeight
                disableSelectionOnClick
                getRowId={(row) => row._id}
            />
            <h2 style={{ margin: 10 }}>Customer List</h2>
            <DataGrid
                rows={customers}
                columns={[
                    {
                        field: 'fullName',
                        headerName: 'Full Name',
                        flex: 1,
                        renderCell: (params) => (
                            <div>{params.row.firstName} {params.row.lastName}</div>
                        )
                    },
                    { field: 'email', headerName: 'Email', flex: 1 },
                    { field: '_id', headerName: 'ID', flex: 1 },
                    { field: 'createdAt', headerName: 'Registration Date', flex: 1, valueFormatter: ({ value }) => new Date(value).toLocaleDateString(), },
                    {
                        field: 'makeAdmin',
                        headerName: 'Make Admin',
                        flex: 1.5,
                        renderCell: (params) => (
                            !params.row.isAdmin && (
                                <>
                                    <Button
                                        sx={buttonStyles}
                                        variant="outlined"
                                        color='secondary'
                                        onClick={() => handleEditCustomer(params.row)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        sx={buttonStyles}
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleMakeAdmin(params.row._id)}
                                    >
                                        Make Admin
                                    </Button>

                                </>

                            )
                        ),
                    },
                ]}
                autoHeight
                disableSelectionOnClick
                getRowId={(row) => row._id}
            />
            {editCustomerModalOpen && (
                <EditCustomerModal
                    open={editCustomerModalOpen}
                    onClose={() => setEditCustomerModalOpen(false)}
                    customer={selectedCustomer}
                    updateCustomerList={setCustomers}
                />
            )}

        </div>
    );
};

export default UserList;
