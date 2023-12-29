import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
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
import GuestCheckoutPage from '../components/GuestCheckout';
import ForgotPassword from '../components/ForgotPassword';
import { useAuth } from '../components/Utilities/useAuth';

const LoginPage = () => {
    useEffect(() => {
        document.title = "Login to Herba Natural - Access Your CBD Products Account";
        document.querySelector('meta[name="description"]').setAttribute("content", "Log in to your Herba Naturalaccount to access our premium CBD products, track orders, and manage your details.");
    }, []);




    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    //FORGOT PASSWORD LOGIC
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    //const ForgotPassword = React.lazy(() => import('./ForgotPassword'));

    const { setIsLoggedIn } = useAuth();
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
                sessionStorage.clear(); // Clear session storage
                localStorage.removeItem('isGuest'); // Clear local storage
                // Login successful
                // Store JWT 
                const data = await response.json();
                const accessToken = data.accessToken;

                localStorage.setItem('token', accessToken);


                // Decode the token, store additional data as needed
                const decodedToken = jwtDecode(accessToken);

                // Store user details based on storage preference

                localStorage.setItem('userFirstName', decodedToken.firstName);
                localStorage.setItem('userLastName', decodedToken.lastName);
                localStorage.setItem('customerId', decodedToken.customerId);
                localStorage.setItem('userEmail', decodedToken.email);

                // Redirect logic
                setIsLoggedIn(true);
                if (decodedToken.isAdmin === true) {
                    // Redirect to admin dashboard
                    navigate('/customer/admin');
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
                <Typography variant="h4" component='h1' align="center">
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
                    name="email"
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
                    name="password"
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


                <label id="rememberMe" name="rememberMe" >
                    <Checkbox
                        id="rememberMe"
                        name="rememberMe"
                        label='WDWWD'
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)} // Toggle 'rememberMe' state
                        color="primary"
                    />Remember Me
                </label>

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
                    <ForgotPassword
                        close={setForgotPasswordOpen}
                        startCountdown={startCountdown}
                        isButtonDisabled={isButtonDisabled}
                        countdown={countdown}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default LoginPage;
