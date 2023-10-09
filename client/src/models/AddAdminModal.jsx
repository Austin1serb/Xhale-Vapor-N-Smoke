import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from '@mui/material';

const AddAdminModal = ({ open, onClose, onAddAdmin, adminDataForEdit, admins, setAdmins }) => {
    const [adminData, setAdminData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        mobilePhone: '',
        homePhone: '',
        comment: '',
        password: '',
        profilePicture: '',
        // Add other fields as needed
    });
    useEffect(() => {
        // If adminDataForEdit is provided, populate the form with existing admin data
        if (adminDataForEdit) {
            setAdminData(adminDataForEdit);
        } else {
            // If no adminDataForEdit is provided, reset the form fields
            setAdminData({
                username: '',
                firstName: '',
                lastName: '',
                email: '',
                mobilePhone: '',
                homePhone: '',
                comment: '',
                password: '',
                profilePicture: '',
                // Clear other fields as needed
            });
        }
    }, [adminDataForEdit]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAdminData({ ...adminData, [name]: value });
    };

    const handleAddAdmin = () => {
        if (adminDataForEdit) {
            // Handle updating an existing admin (send PUT or PATCH request)
            fetch(`http://localhost:8000/api/staff/${adminDataForEdit._id}`, {
                method: 'PUT', // Use 'PUT' or 'PATCH' based on your API
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adminData),
            })
                .then((response) => response.json())
                .then((updatedAdmin) => {
                    // Find and update the admin in the admins state
                    const updatedAdmins = admins.map((admin) =>
                        admin._id === updatedAdmin._id ? updatedAdmin : admin
                    );
                    setAdmins(updatedAdmins);

                    // Clear the form and close the modal
                    setAdminData({
                        username: '',
                        firstName: '',
                        lastName: '',
                        email: '',
                        mobilePhone: '',
                        homePhone: '',
                        comment: '',
                        password: '',
                        profilePicture: '',
                        // Clear other fields as needed
                    });
                    onClose();
                })
                .catch((error) => {
                    console.error('Error updating admin:', error);
                    // Handle any errors that occurred during the update
                    // You can show an error message to the user if needed
                });
        } else {
            // Handle adding a new admin (send POST request)
            fetch('http://localhost:8000/api/staff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adminData),
            })
                .then((response) => response.json())
                .then((newAdmin) => {
                    // Add the new admin to the admins state
                    setAdmins([...admins, newAdmin]);

                    // Clear the form and close the modal
                    setAdminData({
                        username: '',
                        firstName: '',
                        lastName: '',
                        email: '',
                        mobilePhone: '',
                        homePhone: '',
                        comment: '',
                        password: '',
                        profilePicture: '',
                        // Clear other fields as needed
                    });
                    onClose();
                })
                .catch((error) => {
                    console.error('Error adding admin:', error);
                    // Handle any errors that occurred during the addition
                    // You can show an error message to the user if needed
                });
        }
    };


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{adminDataForEdit ? 'Edit Admin' : 'Add New Admin'}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please fill in the details of the {adminDataForEdit ? 'edited' : 'new'} admin.
                </DialogContentText>
                <TextField
                    name="username"
                    label="Username"
                    fullWidth
                    value={adminData.username}
                    onChange={handleChange}
                />
                <TextField
                    name="firstName"
                    label="First Name"
                    fullWidth
                    value={adminData.firstName}
                    onChange={handleChange}
                />
                <TextField
                    name="lastName"
                    label="Last Name"
                    fullWidth
                    value={adminData.lastName}
                    onChange={handleChange}
                />
                <TextField
                    name="email"
                    label="Email"
                    fullWidth
                    value={adminData.email}
                    onChange={handleChange}
                />
                <TextField
                    name="mobilePhone"
                    label="Mobile Phone"
                    fullWidth
                    value={adminData.mobilePhone}
                    onChange={handleChange}
                />
                <TextField
                    name="homePhone"
                    label="Home Phone"
                    fullWidth
                    value={adminData.homePhone}
                    onChange={handleChange}
                />
                <TextField
                    name="comment"
                    label="Comment"
                    multiline
                    rows={4}
                    fullWidth
                    value={adminData.comment}
                    onChange={handleChange}
                />
                <TextField
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    value={adminData.password}
                    onChange={handleChange}
                />
                <TextField
                    name="profilePicture"
                    label="Profile Picture URL"
                    fullWidth
                    value={adminData.profilePicture}
                    onChange={handleChange}
                />
                {/* Add other fields as needed */}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleAddAdmin} color="primary">
                    {adminDataForEdit ? 'Save Changes' : 'Add Admin'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddAdminModal;
