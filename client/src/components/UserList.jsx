import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditCustomerModal from '../models/EditCustomerModal';

const UserList = () => {
    const [editCustomerModalOpen, setEditCustomerModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const handleDeleteUser = (userId) => {
        // Show the delete confirmation dialog
        setUserToDelete(userId);
        setDeleteConfirmationOpen(true);
    };

    const confirmDeleteUser = () => {
        fetch(`http://localhost:8000/api/customer/${userToDelete}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.ok) {
                    // Successfully deleted the user, update the state to remove the user
                    setCustomers(prevCustomers => prevCustomers.filter(customer => customer._id !== userToDelete));
                    alert('User successfully deleted'); // Inform the user
                } else {
                    // Handle other status codes as needed
                    console.error('Deletion failed:', response.status);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
                setDeleteConfirmationOpen(false);
            });
    };


    useEffect(() => {
        // Define a function to fetch customer data
        const fetchCustomers = () => {
            fetch('http://localhost:8000/api/customer', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    setCustomers(data); // Set the fetched data
                })
                .catch(error => {
                    console.error('Error fetching customer data:', error);
                });
        };

        // Call the fetch function
        fetchCustomers();
    }, []);



    // Filter customers to separate admins and non-admins
    const admins = customers.filter(customer => customer.isAdmin);
    const nonAdmins = customers.filter(customer => !customer.isAdmin);

    const handleMakeAdmin = (customerId) => {
        console.log(customerId);
        // Send request to backend to update the isAdmin flag
        fetch(`http://localhost:8000/api/customer/${customerId}`, {
            method: 'PUT', // or the appropriate method used in your backend
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            // You might need to send additional data or authentication tokens depending on your backend setup
        })
            .then((response) => {
                if (response.status === 200) {
                    // Update the customers list in state
                    setCustomers((customers) =>
                        customers.map((customer) =>
                            customer._id === customerId ? { ...customer, isAdmin: true } : customer
                        )
                    );
                    return response.json();
                } else {
                    throw new Error('Failed to make the user admin');
                }
            })
            .then((updatedCustomer) => {
                console.log('User is now an admin:', updatedCustomer);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };



    const handleRemoveFromAdmin = (adminId) => {
        if (admins.length <= 1) {
            // Do not allow removing the last admin
            alert("You cannot remove the last admin.");
            return;
        }

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

    const updateCustomerInList = (updatedCustomer) => {
        setCustomers(customers.map(customer =>
            customer._id === updatedCustomer._id ? updatedCustomer : customer
        ));
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
                                    color='secondary'
                                    onClick={() => handleEditCustomer(params.row)}
                                    updateCustomerList={updateCustomerInList} // Passing the function as a prop

                                >
                                    Edit
                                </Button>
                                <Button
                                    sx={buttonStyles}
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleRemoveFromAdmin(params.row._id)}
                                    disabled={admins.length <= 1}
                                >
                                    Remove Admin
                                </Button>

                                <Dialog
                                    open={deleteConfirmationOpen}
                                    onClose={() => setDeleteConfirmationOpen(false)}
                                >
                                    <DialogTitle>Confirm Deletion</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            Are you sure you want to delete this user?
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => setDeleteConfirmationOpen(false)} color="primary">
                                            Cancel
                                        </Button>
                                        <Button onClick={confirmDeleteUser} color="error">
                                            Delete
                                        </Button>
                                    </DialogActions>
                                </Dialog>
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
                rows={nonAdmins}
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
                                        updateCustomerList={updateCustomerInList} // Passing the function as a prop

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
                                    <Button
                                        sx={buttonStyles}
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDeleteUser(params.row._id)}
                                    >
                                        Delete User
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
