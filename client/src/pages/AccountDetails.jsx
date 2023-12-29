import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
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
    Divider,
} from '@mui/material';
import { useAuth } from '../components/Utilities/useAuth';
import ForgotPassword from '../components/ForgotPassword';

const AccountDetails = () => {
    useEffect(() => {
        document.title = "Your Account Details - Herba Natural User Profile";
        document.querySelector('meta[name="description"]').setAttribute("content", "Manage your Herba Natural account details. Update personal information, track orders, and customize your CBD shopping experience.");
    }, []);



    const { deleteUser } = useAuth();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);
    const [errors, setErrors] = useState({});
    const [isFormChanged, setIsFormChanged] = useState(false);
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const startCountdown = () => {
        setIsButtonDisabled(true);
        setCountdown(30);

        const interval = setInterval(() => {
            setCountdown((currentCountdown) => {
                if (currentCountdown <= 1) {
                    clearInterval(interval);
                    setIsButtonDisabled(false);
                    return 0;
                }
                return currentCountdown - 1;
            });
        }, 1000);
    };

    // Call startCountdown in handleSubmit on successful send





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


    const fetchOrders = async (orderIds) => {
        const orders = await Promise.all(orderIds.map(orderId =>
            fetch(`http://localhost:8000/api/order/${orderId}`, { credentials: 'include' })
                .then(response => response.json())
                .catch(error => {
                    console.error('Error fetching order:', orderId, error)

                })
        ));
        return orders.filter(order => order != null); // Filter out any failed requests
    };

    const fetchCustomerData = async (userId) => {
        setLoadingPage(true);
        try {
            const response = await fetch(`http://localhost:8000/api/customer/${userId}`, { credentials: 'include' });
            if (!response.ok) throw new Error('Network response was not ok');

            const customerData = await response.json();
            setCustomer(customerData);

            // Fetch orders if they exist
            if (customerData.orders && customerData.orders.length > 0) {
                const orders = await fetchOrders(customerData.orders);
                setCustomer(prev => ({ ...prev, orders })); // Append orders to customer state
            }
        } catch (error) {
            console.error('Error fetching customer data:', error);
        } finally {
            setLoadingPage(false);
        }
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
                window.alert('Account Succssfully Updated!')

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

    const renderOrderItem = (item) => (
        <Grid container key={item} spacing={1} sx={{ marginBottom: 1 }}>
            <Grid item xs={3}>
                <img src={item.img} alt={item.name} style={{ width: '100%', height: 'auto' }} />
            </Grid>
            <Grid item xs={9}>
                <Typography variant="subtitle2">{item.name}</Typography>
                <Typography variant="body2">Price: ${item.price ? item.price.toFixed(2) : 'N/A'}</Typography>
                <Typography variant="body2">Quantity: {item.quantity || 'N/A'}</Typography>
            </Grid>
        </Grid>
    );

    const renderOrders = () => {
        return customer && customer.orders && customer.orders.length > 0 ? (

            customer.orders.map((order, index) => (
                <Paper key={index} sx={{ padding: 2, marginBottom: 3, width: '100%' }} >
                    <Typography variant="h6">Order #{order.orderNumber}</Typography>
                    <Typography variant="body2">Order Date: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</Typography>
                    <Typography variant="body2">Total Amount: ${order.totalAmount ? order.totalAmount.grandTotal.toFixed(2) : 'N/A'}</Typography>
                    <Typography variant="body2">Order Status: {order?.orderStatus || 'Unknown'}</Typography>
                    <Typography variant="body2">Payment Status: {order?.paymentStatus || 'N/A'}</Typography>
                    <Divider sx={{ my: 2 }} />
                    {order.shippingMethod && (
                        <>
                            <Typography variant="body2">Shipping Carrier: {order.shippingMethod?.carrier || 'N/A'}</Typography>
                            <Typography variant="body2">Shipping To: {order.address || 'N/A'}</Typography>
                            <Typography variant="body2">Tracking Number: {order.shippingMethod?.trackingNumber || 'N/A'}</Typography>
                            <Typography variant="body2">Track Your Package: <a href={order.shippingMethod?.trackingUrl || '#'}>Here</a></Typography>
                        </>
                    )}
                    <Divider sx={{ my: 2 }} />
                    {order.products && order.products.length > 0 ? (
                        order.products.map((item, idx) => renderOrderItem(item))
                    ) : (
                        <Typography variant="body2">No products in this order.</Typography>
                    )}
                    <Divider sx={{ my: 2 }} />


                    {order.orderNotes && (
                        <Typography variant="body2">Notes: {order.orderNotes}</Typography>
                    )}
                </Paper>
            ))
        ) : (
            <Typography variant="body2">You have no orders.</Typography>
        );
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
        <Paper sx={{ p: 4, maxWidth: 800, margin: '0px auto', marginTop: 5, marginBottom: 5 }}>
            <Typography variant="h1" component="h1" sx={{ marginBottom: 2, fontSize: 'h5.fontSize' }}>
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

                            autoComplete="email"
                            type='email'
                            id='email'
                            name="email"
                            value={customer?.email || ''}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email ? errors.email :
                                <span>
                                    {/* information icon */}
                                    <svg height='16' fill='#0F75E0' style={{ transform: 'translateY(3px)' }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z" /></svg>
                                    {' This will change the email associated with your account'}
                                </span>
                            }
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
                                type='button'
                                onClick={() => setForgotPasswordOpen(true)}
                                color="primary"
                            >
                                Change your password?
                            </Button>
                        </Typography>
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
                        <Modal
                            open={forgotPasswordOpen}
                            onClose={() => setForgotPasswordOpen(false)}
                            aria-labelledby="forgot-password-modal"
                            aria-describedby="forgot-password-form"

                        >
                            <div >
                                <ForgotPassword
                                    close={setForgotPasswordOpen}
                                    type={'change'}
                                    resetEmail={customer?.email}
                                    startCountdown={startCountdown}
                                    isButtonDisabled={isButtonDisabled}
                                    countdown={countdown}

                                />
                            </div>
                        </Modal>
                        <Typography variant="h1" component="h1" sx={{ marginBottom: 2, fontSize: 'h5.fontSize', mt: 10 }}>
                            Your Orders
                        </Typography>

                    </Grid>

                    {renderOrders()}
                </Grid>

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