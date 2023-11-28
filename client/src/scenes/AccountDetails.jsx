import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import {
    Paper,
    Typography,
    Box,
    Button,
    TextField,
    Grid,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Modal,
} from '@mui/material';
import { useAuth } from '../components/Utilities/useAuth';
import ForgotPassword from '../components/ForgotPassword';

const AccountDetails = () => {
    const { deleteUser } = useAuth();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);
    const [errors, setErrors] = useState({});
    const [isFormChanged, setIsFormChanged] = useState(false);
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.customerId;
            fetchCustomerData(userId);
        }

    }, [navigate]);


    const fetchCustomerData = (userId) => {
        setLoadingPage(true);
        fetch(`http://localhost:8000/api/customer/${userId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setCustomer(data);
                setLoadingPage(false);
            })
            .catch((error) => {
                console.error('Error fetching customer data:', error);
            });
    };
    const handleChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
        setIsFormChanged(true);
    };




    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setErrors({}); // Clear any previous error
        setLoading(true)

        try {
            const response = await fetch(`http://localhost:8000/api/customer/${customer._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',

                },
                credentials: 'include',
                body: JSON.stringify(customer),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Try to parse the error response
                console.error('Error updating customer data:', errorData);

                // Handle validation errors here
                if (errorData.message === 'Validation error' && errorData.error) {
                    const validationErrors = {};
                    Object.keys(errorData.error.errors).forEach((fieldName) => {

                        console.error(`Validation error for ${fieldName}: ${errorData.error.errors[fieldName].message}`);

                        validationErrors[fieldName] = errorData.error.errors[fieldName].message;
                    });
                    setErrors(validationErrors);
                    setLoading(false)
                }
            } else {
                const data = await response.json();

                setCustomer(data);
                setLoading(false)
                setIsFormChanged(false);

                console.log('Customer data updated successfully:', data);
            }
        } catch (error) {
            console.error('Unknown error occurred:', error);
        }
        finally {
            setLoading(false)

        }
    };




    const handleDeleteAccount = () => {

        fetch(`http://localhost:8000/api/customer/${customer._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',

            },
            credentials: 'include',
        })
            .then(async response => {
                if (!response.ok) {
                    throw new Error('Error deleting account');
                }
                await deleteUser();
                navigate('/');
            })
            .catch(error => console.error('Error:', error));
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };





    if (loadingPage) {
        return (
            <Paper sx={{ p: 2, maxWidth: 800, margin: '0 auto', marginTop: 4 }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    Loading Account Details...
                    <CircularProgress />
                </Typography>

            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 4, maxWidth: 800, margin: '0px auto', marginTop: -5, marginBottom: 5 }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Account Details
            </Typography>
            <form onSubmit={handleFormSubmit}>
                <Grid container spacing={2}>
                    {/* Add more fields here */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            autoComplete="given-name"
                            name="firstName"
                            label="First Name"
                            fullWidth
                            value={customer?.firstName || ''}
                            onChange={handleChange}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Last Name"
                            fullWidth
                            autoComplete="family-name"
                            name="lastName"
                            value={customer?.lastName || ''}
                            onChange={handleChange}
                            error={!!errors.lastName}
                            helperText={errors.lastName}

                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            fullWidth
                            name="email"
                            value={customer?.email || ''}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                    </Grid>
                    {/* Address Line 1 */}
                    <Grid item xs={12}>
                        <TextField
                            label="Address"
                            fullWidth
                            name="address1"
                            autoComplete="address-line1"
                            value={customer?.address || ''}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* Address Line 2 */}
                    <Grid item xs={12}>
                        <TextField
                            label="Address Line 2"
                            fullWidth
                            autoComplete="address-line2"
                            name="address2"
                            value={customer?.address2 || ''}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* City */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="City"
                            fullWidth
                            name="city"
                            autoComplete="address-level2"
                            value={customer?.city || ''}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* State */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="State"
                            fullWidth
                            name="state"
                            autoComplete="address-level1"
                            value={customer?.state || ''}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* Zip Code */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Zip"
                            fullWidth
                            name="zip"
                            autoComplete="postal-code"
                            value={customer?.zip || ''}
                            onChange={handleChange}
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
                            value={customer?.phone || ''}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* Country */}
                    <Grid item xs={12}>
                        <TextField
                            autoComplete="country-name"
                            label="Country"
                            fullWidth
                            name="country"
                            value={customer?.country || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>

                        <Typography variant="body2" align="center" mt={2}>
                            <Button
                                type='text'
                                onClick={() => setForgotPasswordOpen(true)}
                                color="primary"
                            >
                                Change your password?
                            </Button>
                        </Typography>
                        <Modal
                            open={forgotPasswordOpen}
                            onClose={() => setForgotPasswordOpen(false)}
                            aria-labelledby="forgot-password-modal"
                            aria-describedby="forgot-password-form"

                        >
                            <div >
                                <ForgotPassword close={setForgotPasswordOpen} type={'change'} />
                            </div>
                        </Modal>
                    </Grid>
                </Grid>
                <Box sx={{ marginTop: 2, height: '90px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Button
                        style={{ width: '210px' }}
                        disabled={loading || !isFormChanged}
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                    <Button
                        style={{ width: '210px' }}
                        variant="contained"
                        color="error"
                        onClick={handleOpenDialog}

                    >
                        Delete Account
                    </Button>
                </Box>
            </form>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Delete Your Account?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete your account? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteAccount} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}

export default AccountDetails;