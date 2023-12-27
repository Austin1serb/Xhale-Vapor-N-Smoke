import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditCustomerModal from '../models/EditCustomerModal';


const UserList = () => {
    const [editCustomerModalOpen, setEditCustomerModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [users, setUsers] = useState({ customers: [], guests: [] });
    const [error, setError] = useState(null);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [userTypeToDelete, setUserTypeToDelete] = useState(null); // 'customer' or 'guest'
    const [viewMode, setViewMode] = useState(false)



    const handleDeleteUser = (userId, userType) => {
        setUserToDelete(userId);
        setUserTypeToDelete(userType); // 'customer' or 'guest'
        setDeleteConfirmationOpen(true);
    };


    const confirmDeleteUser = () => {

        const url = userTypeToDelete === 'customer'
            ? `http://localhost:8000/api/customer/${userToDelete}`
            : `http://localhost:8000/api/guest/${userToDelete}`;

        fetchData(url, { method: 'DELETE' })
            .then(() => {
                setUsers(prevUsers => {
                    const updatedType = userTypeToDelete === 'customer' ? 'customers' : 'guests';
                    return {
                        ...prevUsers,
                        [updatedType]: prevUsers[updatedType].filter(user => user._id !== userToDelete)
                    };
                });
                alert('User successfully deleted');
            })
            .catch(error => {
                console.error('Error:', error);
                setError('An Error occured while deleting the user');
            })
            .finally(() => {
                setDeleteConfirmationOpen(false);
            });
    };



    // Reusable fetch function
    const fetchData = async (url, options = {}) => {
        setError(null);
        try {
            const response = await fetch(url, {
                ...options,
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', ...options.headers }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Fetch Error:', error);
            setError('An error occurred while fetching data');
        }
    };

    // Combined fetch function for customers and guests
    const fetchUsers = async () => {

        try {
            const [customers, guests] = await Promise.all([
                fetchData('http://localhost:8000/api/customer'),
                fetchData('http://localhost:8000/api/guest')
            ]);

            setUsers({ customers, guests });
        } catch (error) {
            console.error('Error fetching users:', error);

        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);



    const handleMakeAdmin = (customerId) => {
        fetchData(`http://localhost:8000/api/customer/${customerId}`, {
            method: 'PUT',
            body: JSON.stringify({ isAdmin: true })
        })
            .then((updatedCustomer) => {
                setUsers(prevUsers => ({
                    ...prevUsers,
                    customers: prevUsers.customers.map(customer =>
                        customer._id === customerId ? { ...customer, isAdmin: true } : customer
                    )
                }));
            })
            .catch(error => {
                console.error('Error:', error);
                setError('An Error occured while making admin');
            });
    };

    const handleRemoveFromAdmin = (adminId) => {
        if (admins.length <= 1) {
            alert("You cannot remove the last admin.");
            return;
        }
        if (adminId === localStorage.getItem('customerId')) {
            alert("You cannot remove yourself as an admin.");
            return;
        }

        fetchData(`http://localhost:8000/api/customer/${adminId}`, {
            method: 'PUT',
            body: JSON.stringify({ isAdmin: false })
        }
        )
            .then(() => {
                setUsers(prevUsers => {
                    if (!prevUsers || !prevUsers.customers) {
                        console.error("Customers data is undefined");
                        return prevUsers; // Early return if customers data is undefined
                    }

                    return {
                        ...prevUsers,
                        customers: prevUsers.customers.map(customer =>
                            customer._id === adminId ? { ...customer, isAdmin: false } : customer
                        )
                    };
                });
            })
            .catch(error => {
                console.error('Error:', error);
                setError('An Error occured while removing admin');
            });
    };



    const updateCustomerInList = (updatedCustomer) => {
        setUsers(prevUsers => ({
            ...prevUsers,
            customers: prevUsers.customers.map(customer =>
                customer._id === updatedCustomer._id ? updatedCustomer : customer
            )
        }));
    };


    const handleEditCustomer = (customer) => {
        setSelectedCustomer(customer);
        setEditCustomerModalOpen(true);
        setViewMode(false)
    };
    const handleViewGuestDetails = (guest) => {
        setSelectedCustomer(guest);
        setEditCustomerModalOpen(true);
        setViewMode(true)
    };


    // Filter customers to separate admins and non-admins
    const admins = users.customers.filter(customer => customer.isAdmin);
    const nonAdmins = users.customers.filter(customer => !customer.isAdmin);




    const buttonStyles = {
        fontSize: '10px',
        margin: '5px',
    }

    return (
        <div style={{ padding: 20, margin: 20 }}>
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


                            </div>
                        ),
                    },
                ]}
                autoHeight
                disableSelectionOnClick
                getRowId={(row) => row._id}
            />
            {/* error ui */}
            {!error && (
                <div style={{ color: 'red', margin: 10 }}>
                    {error}
                </div>
            )}
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
                    rows={users.guests}
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
                    isViewOnly={viewMode} // Add this line
                />
            )}


        </div>
    );
};

export default UserList;
