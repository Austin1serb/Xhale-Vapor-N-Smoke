import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Link,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const RegistrationPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({}); // State to store validation errors


    const handleClickShowPassword = () => {
        setShowPassword((show) => !show);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Check for empty fields and set errors
        if (name === 'password' && value.trim() === '') {
            setErrors({ ...errors, password: 'Password is required' });
        } else if (name === 'confirmPassword' && value.trim() === '') {
            setErrors({ ...errors, confirmPassword: 'Confirm Password is required' });
        } else {
            // Additional password validation
            if (name === 'password' || name === 'confirmPassword') {
                if (name === 'password' && value.length < 8) {
                    setErrors({ ...errors, password: 'Password must be at least 8 characters long' });
                } else if (name === 'confirmPassword' && value !== formData.password) {
                    setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
                } else {
                    // Clear the specific password-related error when it's valid
                    setErrors({ ...errors, [name]: '' });
                }
            }
        }

        // Update form data
        setFormData({
            ...formData,
            [name]: value,
        });
    };





    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Perform all validation checks
        let hasErrors = false;

        if (formData.firstName.trim() === '') {
            setErrors({ ...errors, firstName: 'First Name is required' });
            hasErrors = true;
        }

        if (formData.lastName.trim() === '') {
            setErrors({ ...errors, lastName: 'Last Name is required' });
            hasErrors = true;
        }

        if (formData.email.trim() === '') {
            setErrors({ ...errors, email: 'Email is required' });
            hasErrors = true;
        }

        if (formData.password.trim() === '') {
            setErrors({ ...errors, password: 'Password is required' });
            hasErrors = true;
        } else if (formData.password.length < 8) {
            setErrors({ ...errors, password: 'Password must be at least 8 characters long' });
            hasErrors = true;
        }

        if (formData.confirmPassword !== formData.password) {
            setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
            hasErrors = true;
        }
        if (!hasErrors) {
            try {
                const response = await fetch('http://localhost:8000/api/customer/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (errorData.errors) {
                        setErrors(errorData.errors);
                    }
                } else {
                    const responseData = await response.json();
                    const token = responseData.token;

                    localStorage.setItem('token', token);

                    setFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                    });
                    setErrors({});

                    // Redirect to the '/' page
                    navigate('/'); // Redirect to the '/' page
                }
            } catch (error) {
                console.error('API request error:', error);
            }
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',

                p: 0,
                m: 0,
            }}
        >
            <Paper
                elevation={3}
                sx={{

                    width: '60%',
                    minWidth: '260px',
                    padding: 3,
                    border: 0.1,
                    boxShadow: 0,
                    height: 'auto',
                }}
            >
                <Typography variant="h4" align="center">
                    Registration
                </Typography>
                <Typography variant="subtitle1" align="center">
                    Welcome! If you already have an account, you can{' '}
                    <Link component={RouterLink} to="/login" color="primary">
                        Login
                    </Link>
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={!!errors.firstName} // Apply error style when there's an error
                        helperText={errors.firstName || ''} // Display the error message
                    />
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={!!errors.lastName} // Apply error style when there's an error
                        helperText={errors.lastName || ''} // Display the error message
                    />

                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email} // Apply error style when there's an error
                        helperText={errors.email || ''} // Display the error message
                    />

                    {/* PASSWORD FIELD  */}
                    <TextField

                        label="Password*"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password || ''}
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

                    {/* Confirm Password field */}
                    <TextField
                        label="Confirm Password*"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
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


                    <Button sx={{
                        my: 3
                    }} variant="contained" color="primary" fullWidth type="submit">
                        Register
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default RegistrationPage;
