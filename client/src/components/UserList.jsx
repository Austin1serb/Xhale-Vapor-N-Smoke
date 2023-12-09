import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditCustomerModal from '../models/EditCustomerModal';

const UserList = () => {
    const [editCustomerModalOpen, setEditCustomerModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [guests, setGuests] = useState([]);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [userTypeToDelete, setUserTypeToDelete] = useState(null); // 'customer' or 'guest'


    const handleDeleteUser = (userId, userType) => {
        setUserToDelete(userId);
        setUserTypeToDelete(userType); // 'customer' or 'guest'
        setDeleteConfirmationOpen(true);
    };


    const confirmDeleteUser = () => {
        const url = userTypeToDelete === 'customer'
            ? `http://localhost:8000/api/customer/${userToDelete}`
            : `http://localhost:8000/api/guest/${userToDelete}`;

        fetch(url, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.ok) {
                    // Update the state to remove the user from the list
                    if (userTypeToDelete === 'customer') {
                        setCustomers(prevCustomers => prevCustomers.filter(customer => customer._id !== userToDelete));
                    } else {
                        setGuests(prevGuests => prevGuests.filter(guest => guest._id !== userToDelete));
                    }
                    alert('User successfully deleted');
                } else {
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



    const fetchGuests = () => {
        fetch('http://localhost:8000/api/guest/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                setGuests(data); // Set the fetched data
            })
            .catch(error => {
                console.error('Error fetching guest data:', error);
            });
    };
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


    useEffect(() => {
        fetchCustomers();
        fetchGuests()
    }, []);



    // Filter customers to separate admins and non-admins
    const admins = customers.filter(customer => customer.isAdmin);
    const nonAdmins = customers.filter(customer => !customer.isAdmin);

    const handleMakeAdmin = (customerId) => {

        // Send request to backend to update the isAdmin flag
        fetch(`http://localhost:8000/api/customer/${customerId}`, {
            method: 'PUT', // or the appropriate method used in your backend
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isAdmin: true })
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
            body: JSON.stringify({ isAdmin: false })
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
    const handleViewGuestDetails = (guest) => {
        setSelectedCustomer(guest);
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
                    { field: '_id', headerName: 'ID', flex: 1.25 },
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
                                    <Button
                                        sx={buttonStyles}
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDeleteUser(params.row._id, 'customer')}
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
            <div>
                <h2 style={{ margin: 10 }}>Guest User List</h2>
                <DataGrid
                    rows={guests}
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
                        { field: 'createdAt', headerName: 'Registration Date', flex: 1, valueFormatter: ({ value }) => new Date(value).toLocaleDateString(), },
                        {
                            field: 'actions',
                            headerName: 'Actions',
                            flex: 1.5,
                            renderCell: (params) => (
                                <>
                                    <Button
                                        sx={buttonStyles}
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleViewGuestDetails(params.row)}
                                    >
                                        View Details
                                    </Button>
                                    <Button
                                        sx={buttonStyles}
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDeleteUser(params.row._id, 'guest')}
                                    >
                                        Delete Guest
                                    </Button>
                                </>
                            ),
                        },


                    ]}
                    autoHeight
                    disableSelectionOnClick
                    getRowId={(row) => row._id}
                />
            </div>

            {editCustomerModalOpen && (
                <EditCustomerModal
                    open={editCustomerModalOpen}
                    onClose={() => setEditCustomerModalOpen(false)}
                    customer={selectedCustomer}
                    updateCustomerList={updateCustomerInList}
                    isViewOnly={true} // Add this line
                />
            )}


        </div>
    );
};

export default UserList;
