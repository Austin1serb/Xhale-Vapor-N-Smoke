import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode'; // Import jwt-decode
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Link,
    CircularProgress,
    Checkbox,
    InputAdornment,
    IconButton,

} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rememberMe, setRememberMe] = useState(false); // Changed to 'false' by default
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Check if the user is logged in by verifying the presence of the access token

    // If the user is already logged in, you can redirect them to another page
    //const isUserLoggedIn = Boolean(localStorage.getItem('token'));

    //if (isUserLoggedIn) {
    //    // Redirect to a different route, e.g., the home page
    //    navigate('/');

    //}
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
            });

            if (response.ok) {
                // Login successful
                // Store JWT and refresh token
                const data = await response.json();
                const token = data.accessToken;
                const refreshToken = data.refreshToken;
                localStorage.setItem('token', token); // Store in localStorage for persistent login
                localStorage.setItem('refreshToken', refreshToken); // Store the refresh token
                // Redirect to the home page
                navigate('/');
            } else {
                // Login failed, display error message
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            setError('An error occurred while logging in: ' + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '70vh',
                backgroundColor: '#fff', // Set your desired background color
            }}
        >
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
                                    aria-label="toggle password visibility"
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
                    >
                        Login
                    </Button>
                )}

                <Typography variant="body2" align="center" mt={2}>
                    <Link
                        component={RouterLink}
                        to="/forgot-password"
                        color="primary"
                    >
                        Forgot your password?
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default LoginPage;
