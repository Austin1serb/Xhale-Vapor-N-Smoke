import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
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
        setEditAdminModalOpen(true);
        setAdminDataForEdit(admin); // Populate admin data for editing
    };
    const handleCloseEditAdminModal = () => {
        setEditAdminModalOpen(false);
        setAdminDataForEdit(null); // Reset admin data for editing
    };

    return (
        <div>
            <h2>Admin List</h2>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Admin Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>Registration Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {admins.map((admin) => (
                        <TableRow key={admin._id}>
                            <TableCell>{admin.username}</TableCell>
                            <TableCell>{admin.email}</TableCell>
                            <TableCell>{admin._id}</TableCell>
                            <TableCell>{admin.registrationDate}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleOpenEditAdminModal(admin)}>Edit</Button>
                                <AddAdminModal
                                    open={editAdminModalOpen}
                                    onClose={handleCloseEditAdminModal}
                                    adminDataForEdit={adminDataForEdit} // Pass the admin data you want to edit
                                    admins={admins} // Pass the admins array
                                    setAdmins={setAdmins} // Pass the setAdmins function
                                />
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => handleDeleteAdmin(admin._id)}
                                >
                                    Delete
                                </Button>

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpenAddAdminModal}
            >
                Add Admin
            </Button>
            <AddAdminModal
                open={addAdminModalOpen}
                onClose={handleCloseAddAdminModal}
                admins={admins} // Pass admins state as a prop
                setAdmins={setAdmins} // Pass setAdmins function as a prop
            />

            <h2>Customer List</h2>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Customer Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Roles</TableCell>
                        <TableCell>Registration Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {customers.map((customer) => (
                        <TableRow key={customer._id}>
                            <TableCell>{customer.username}</TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>{customer._id}</TableCell>
                            <TableCell>{customer.registrationDate}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default UserList;
