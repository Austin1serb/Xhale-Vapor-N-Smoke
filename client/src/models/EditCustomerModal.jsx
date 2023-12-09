import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Grid } from '@mui/material';

const EditCustomerModal = ({ open, onClose, customer, updateCustomerList, isViewOnly = false }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        country: '',
        orders: [],
    });

    useEffect(() => {
        // Populate form data when the modal opens
        if (customer) {
            setFormData({
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                address: customer.address,
                address2: customer.address2,
                city: customer.city,
                state: customer.state,
                zip: customer.zip,
                phone: customer.phone,
                country: customer.country,
                orders: customer.orders

            });
        }
    }, [customer]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        fetch(`http://localhost:8000/api/customer/${customer._id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((updatedCustomer) => {
                updateCustomerList(updatedCustomer);
                onClose(); // Close the modal
            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle errors (e.g., show a notification)
            });
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ ...modalStyle }}>
                <Typography variant="h6">Edit Customer</Typography>
                <Grid container spacing={2}>

                    <Grid item xs={12} sm={6}>

                        <TextField
                            label="First Name"
                            name="firstName"
                            autoComplete="given-name"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            disabled={isViewOnly}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Last Name"
                            name="lastName"
                            autoComplete="family-name"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            disabled={isViewOnly}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <TextField
                            label="Email"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            disabled={isViewOnly}
                        />
                    </Grid>
                    {/* Address Line 1 */}
                    <Grid item xs={12}>
                        <TextField
                            label="Address"
                            fullWidth
                            name="address1"
                            autoComplete="address-line1"
                            value={formData.address || ''}
                            onChange={handleInputChange}
                            disabled={isViewOnly}
                        />
                    </Grid>

                    {/* Address Line 2 */}
                    <Grid item xs={12}>
                        <TextField
                            label="Address Line 2"
                            fullWidth
                            autoComplete="address-line2"
                            name="address2"
                            value={formData.address2 || ''}
                            onChange={handleInputChange}
                            disabled={isViewOnly}
                        />
                    </Grid>

                    {/* City */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="City"
                            fullWidth
                            name="city"
                            autoComplete="address-level2"
                            value={formData.city || ''}
                            onChange={handleInputChange}
                            disabled={isViewOnly}
                        />
                    </Grid>

                    {/* State */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="State"
                            fullWidth
                            name="state"
                            autoComplete="address-level1"
                            value={formData.state || ''}
                            onChange={handleInputChange}
                            disabled={isViewOnly}
                        />
                    </Grid>

                    {/* Zip Code */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Zip"
                            fullWidth
                            name="zip"
                            autoComplete="postal-code"
                            value={formData.zip || ''}
                            onChange={handleInputChange}
                            disabled={isViewOnly}
                        />
                    </Grid>

                    {/* Phone Number */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Phone"
                            fullWidth
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            value={formData.phone || ''}
                            onChange={handleInputChange}
                            disabled={isViewOnly}
                        />
                    </Grid>

                    {/* Country */}
                    <Grid item xs={12}>
                        <TextField
                            autoComplete="country-name"
                            label="Country"
                            fullWidth
                            name="country"
                            value={formData.country || ''}
                            onChange={handleInputChange}
                            disabled={isViewOnly}
                        />
                    </Grid>
                    {/* Orders */}
                    <Grid item xs={6}>
                        <Typography
                            label="Orders"
                            name="orders"
                            onChange={handleInputChange}
                        >
                            Orders:  {customer.orders.length}
                        </Typography>
                    </Grid>
                    {/* Date Created */}
                    <Grid item xs={6}>
                        <Typography
                            label="Date Created"
                            name="dateCreated"
                            onChange={handleInputChange}
                        >
                            Date Created:  {new Date(customer.createdAt).toLocaleDateString()}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            fullWidth

                            onClick={handleSubmit}
                            variant="outlined"
                            color="primary"
                            sx={{ mt: 2 }}
                            disabled={isViewOnly}
                        >
                            Save Changes
                        </Button>
                    </Grid>
                    <Grid item xs={6} >
                        <Button
                            fullWidth
                            onClick={onClose}
                            variant="outlined"
                            color="secondary"
                            sx={{ mt: 2 }}
                        >
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',

};

export default EditCustomerModal;
