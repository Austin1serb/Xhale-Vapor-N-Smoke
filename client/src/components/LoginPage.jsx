import React, { useState } from 'react';
import jwtDecode from 'jwt-decode'; // Import jwt-decode
import {
    Paper,
    Typography,
    TextField,
    Button,
    Link,
    CircularProgress,
    Checkbox,
    InputAdornment,
    IconButton,
    Modal,

} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import GuestCheckoutPage from './GuestCheckout';
import ForgotPassword from './ForgotPassword';

const LoginPage = () => {
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    //FORGOT PASSWORD LOGIC
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    //const ForgotPassword = React.lazy(() => import('./ForgotPassword'));


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const returnUrl = params.get('returnUrl') || '/';

    const shouldShowGuestCheckout = () => {
        return returnUrl && returnUrl.includes('/checkout');
    };



    const handleClickShowPassword = () => {
        setShowPassword((show) => !show);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleLogin = async () => {
        try {
            setLoading(true);
            // Make an API request to your backend for login
            const response = await fetch('http://localhost:8000/api/customer/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            if (response.ok) {
                // Login successful
                // Store JWT and refresh token
                const data = await response.json();
                console.log(data)
                const accessToken = data.accessToken;
                //const refreshToken = data.newRefreshToken;
                localStorage.setItem('token', accessToken); // Store in localStorage for persistent login
                //localStorage.setItem('refreshToken', refreshToken); // Store the refresh token
                const decodedToken = jwtDecode(accessToken);


                console.log(decodedToken);


                // Store user details in localStorage (or sessionStorage)
                localStorage.setItem('userFirstName', decodedToken.firstName);
                localStorage.setItem('userLastName', decodedToken.lastName);
                localStorage.setItem('customerId', decodedToken.customerId);
                localStorage.setItem('userEmail', decodedToken.email);
                // Redirect to the home page or checkoutpage

                if (decodedToken.isAdmin === true) {
                    // Redirect to admin dashboard
                    navigate('/api/customer/admin');
                } else {
                    // Redirect to the home page or other user-specific page
                    navigate(returnUrl);
                }
            } else {
                handleErrorResponse(response, setError);
            }
        } catch (error) {
            setError('An error occurred while logging in: ' + error);
        } finally {
            setLoading(false);
        }
    };
    async function handleErrorResponse(response, setError) {
        let errorData;
        const contentType = response.headers.get('content-type');

        try {
            if (contentType && contentType.includes('application/json')) {
                errorData = await response.json();
                if (errorData.message) {
                    setError(errorData.message);
                } else {
                    setError('An unknown error occurred');
                }
            } else {
                // Handle non-JSON response
                errorData = await response.text();
                setError(errorData || 'An error occurred');
            }
        } catch (error) {
            console.error('Error processing response:', error);
            setError('An unexpected error occurred');
        }
        setOpenSnackbar(true)
    }







    const containerStyles = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70vh',
        backgroundColor: '#fff', // Set your desired background color
        padding: '40px'
    }
    return (
        <div
            style={containerStyles}
        >
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
            <Paper
                sx={{
                    padding: 3,
                    border: 0.01,
                    boxShadow: 0,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h4" align="center">
                    Login
                </Typography>
                <Typography variant="subtitle1" align="center">
                    Welcome back! If you don't have an account, you can{' '}
                    <Link component={RouterLink} to="/registration" color="primary">
                        Sign up
                    </Link>
                </Typography>

                <TextField
                    id="email"
                    autoComplete='email'
                    type='email'
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={Boolean(error)}
                    helperText={error}
                />
                <TextField
                    id="password"
                    autoComplete="current-password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={Boolean(error)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Checkbox
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)} // Toggle 'rememberMe' state
                    color="primary"
                />
                <label>Remember Me</label>

                {loading ? (
                    <CircularProgress />
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleLogin}
                        disabled={loading}
                    >

                        {loading ? <CircularProgress size={24} /> : 'Login'}

                    </Button>
                )}

                <Typography variant="body2" align="center" mt={2}>
                    <Button
                        type='text'
                        onClick={() => setForgotPasswordOpen(true)}
                        color="primary"
                    >
                        Forgot your password?
                    </Button>
                </Typography>
            </Paper>
            {shouldShowGuestCheckout() && (
                <GuestCheckoutPage />
            )}
            <Modal
                open={forgotPasswordOpen}
                onClose={() => setForgotPasswordOpen(false)}
                aria-labelledby="forgot-password-modal"
                aria-describedby="forgot-password-form"

            >
                <div >
                    <ForgotPassword close={setForgotPasswordOpen} />
                </div>
            </Modal>
        </div>
    );
};

export default LoginPage;
