import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddAdminModal from '../models/AddAdminModal';

const UserList = () => {
    const [admins, setAdmins] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [addAdminModalOpen, setAddAdminModalOpen] = useState(false);
    const [editAdminModalOpen, setEditAdminModalOpen] = useState(false);
    const [adminDataForEdit, setAdminDataForEdit] = useState(null);

    useEffect(() => {
        // Fetch admin data from your backend API
        fetch('http://localhost:8000/api/staff') // Replace with your admin endpoint
            .then((response) => response.json())
            .then((data) => {
                // Update the state with the retrieved admin data
                setAdmins(data);
            })
            .catch((error) => {
                console.error('Error fetching admin data:', error);
            });

        // Fetch customer data from your backend API
        fetch('http://localhost:8000/api/customer') // Replace with your customer endpoint
            .then((response) => response.json())
            .then((data) => {
                // Update the state with the retrieved customer data
                setCustomers(data);
            })
            .catch((error) => {
                console.error('Error fetching customer data:', error);
            });
    }, []);

    const handleDeleteAdmin = (adminId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this admin?');

        if (confirmDelete) {
            // Send a DELETE request to your API to delete the admin with the provided adminId
            fetch(`http://localhost:8000/api/staff/${adminId}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        // If the admin is successfully deleted, update the state to remove the admin
                        setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== adminId));
                    } else {
                        // Handle error or show an error message to the user
                        console.error('Error deleting admin:', response.statusText);
                    }
                })
                .catch((error) => {
                    console.error('Error deleting admin:', error);
                });
        }
    };

    const handleOpenAddAdminModal = () => {
        setAddAdminModalOpen(true);
    };

    const handleCloseAddAdminModal = () => {
        setAddAdminModalOpen(false);
    };

    const handleOpenEditAdminModal = (admin) => {
        setAdminDataForEdit(admin);
        setEditAdminModalOpen(true); // Open the modal for editing
    };

    const handleCloseEditAdminModal = () => {
        setEditAdminModalOpen(false);
        setAdminDataForEdit(null);
    };

    return (
        <div>
            <h2>Admin List</h2>
            <DataGrid
                rows={admins}
                columns={[
                    { field: 'username', headerName: 'Admin Name', flex: 1 },
                    { field: 'email', headerName: 'Email', flex: 1 },
                    { field: '_id', headerName: 'ID', flex: 1 },
                    { field: 'createdAt', headerName: 'Registration Date', flex: 1 },
                    {
                        field: 'actions',
                        headerName: 'Actions',
                        flex: 1,
                        renderCell: (params) => (
                            <div>
                                <Button onClick={() => handleOpenEditAdminModal(params.row)}>
                                    Edit
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => handleDeleteAdmin(params.row._id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        ),
                    },
                ]}
                autoHeight
                disableSelectionOnClick
                getRowId={(row) => row._id}
            />

            <Button variant="contained" color="primary" onClick={handleOpenAddAdminModal}>
                Add Admin
            </Button>

            <AddAdminModal
                open={addAdminModalOpen}
                onClose={handleCloseAddAdminModal}
                admins={admins}
                setAdmins={setAdmins}
            />

            <AddAdminModal
                open={editAdminModalOpen} // Open the modal for editing
                onClose={handleCloseEditAdminModal}
                adminDataForEdit={adminDataForEdit} // Pass the admin data for editing
                admins={admins}
                setAdmins={setAdmins}
            />

            <h2>Customer List</h2>
            <DataGrid
                rows={customers}
                columns={[
                    { field: `firstName`, headerName: 'First Name', flex: 1 },
                    { field: `lastName`, headerName: 'Last Name', flex: 1 },
                    { field: 'email', headerName: 'Email', flex: 1 },
                    { field: '_id', headerName: 'ID', flex: 1 },
                    { field: 'registrationDate', headerName: 'Registration Date', flex: 1 },
                ]}
                autoHeight
                disableSelectionOnClick
                getRowId={(row) => row._id}
            />
        </div>
    );
};

export default UserList;
