import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,

    InputAdornment,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ReCAPTCHA from 'react-google-recaptcha';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import jwtDecode from 'jwt-decode';
import GuestCheckoutPage from './GuestCheckout';



const RegistrationPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const location = useLocation();

    const [errorMessage, setErrorMessage] = useState('')
    const siteKey = '6LdWVw4pAAAAADqgqwejq2_Os3NGofQXke0q3JsV'
    const navigate = useNavigate();
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const params = new URLSearchParams(window.location.search);
    const returnUrl = params.get('returnUrl') || '/';


    const shouldShowGuestCheckout = () => {
        return returnUrl && returnUrl.includes('/checkout');
    };

    const onRecaptchaChange = (value) => {
        setRecaptchaValue(value);
    };
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
        setFormData({
            ...formData,
            [name]: value,
        });

        // Password validation
        if (name === 'password') {
            if (value.trim() === '') {
                setErrors({ ...errors, password: 'Password is required' });
            } else if (value.length < 8) {
                setErrors({ ...errors, password: 'Password must be at least 8 characters long' });
            } else if (!/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
                setErrors({
                    ...errors, password: 'Password must contain at least one uppercase letter, one number'
                });
            } else {
                // Clear the password error if it's valid
                const { password, ...rest } = errors;
                setErrors(rest);
            }


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

        let newErrors = {};
        // Reset errors
        setErrors({});
        // Frontend validations
        // Email format validation
        // Email empty check
        if (formData.email.trim() === '') {
            newErrors.email = 'Email is required';
        }
        // Email format validation
        else {
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            if (!emailRegex.test(formData.email.trim())) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        // Password length and strength validation
        if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        } else if (!/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter, and one number';
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // First and last name validations
        if (formData.firstName.trim() === '') {
            newErrors.firstName = 'First Name is required';
        }
        if (formData.lastName.trim() === '') {
            newErrors.lastName = 'Last Name is required';
        }

        if (!recaptchaValue) {
            alert('Please solve the reCAPTCHA');
            return;
        }
        setErrors(newErrors);

        // If there are validation errors, stop the form submission
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        setIsSubmitting(true); // Start submitting
        try {
            const registrationData = {
                ...formData,
                recaptchaValue,
                isVerified: localStorage.getItem('isVerified')


            };

            const response = await fetch('http://localhost:8000/api/customer/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
            });
            const responseData = await response.json();

            if (response.ok) {
                // Registration successful

                const { accessToken } = responseData;
                // Store the token securely (Consider more secure storage than localStorage)
                localStorage.setItem('token', accessToken);

                const decodedToken = jwtDecode(accessToken);

                // Store user details in localStorage (or sessionStorage)
                localStorage.setItem('userFirstName', decodedToken.firstName);
                localStorage.setItem('userLastName', decodedToken.lastName);
                localStorage.setItem('customerId', decodedToken.customerId);
                localStorage.setItem('userEmail', decodedToken.email);
                resetFormData();

                // Redirect to the home page or checkout page
                navigateToReturnUrl();
                setIsSubmitting(false); // End submitting after form handling
            } else {
                // Check if the error is a validation error
                if (responseData.errors) {
                    // Set field-specific errors
                    setErrors(responseData.errors);
                } else {
                    // Set general error message
                    setErrorMessage(responseData.message || 'An error occurred');
                    setOpenSnackbar(true);
                }
            }
        } catch (error) {
            console.error('API request error:', error);
            setErrorMessage('An unexpected error occurred');
            setOpenSnackbar(true);
        } finally {
            setIsSubmitting(false);
        }


        // Helper functions (to keep handleSubmit clean)
        function resetFormData() {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
            });
            setErrors({});
        }

        function navigateToReturnUrl() {

            navigate(returnUrl);
        }

        async function handleErrorResponse(response) {
            let errorData;
            const contentType = response.headers.get('content-type');

            try {
                if (contentType && contentType.includes('application/json')) {
                    errorData = await response.json();
                    // Assuming errorData.message contains your error message
                    setErrorMessage(errorData.message || 'An error occurred');
                } else {
                    // Handle non-JSON response
                    errorData = await response.text();
                    setErrorMessage(errorData || 'An error occurred');
                }
            } catch (error) {
                console.error('Error processing response:', error);
                setErrorMessage('An unexpected error occurred');
            }

            setOpenSnackbar(true); // Show the Snackbar with the error message
        }

    }
    function getTextFieldStyle(fieldName) {
        const isFieldValid = formData[fieldName].trim() && !errors[fieldName];
        return {
            color: isFieldValid ? 'success' : 'primary',
            focused: !!isFieldValid,
        };
    }

    const containerStyles = {
        display: 'flex',
        justifyContent: 'center',

        height: '90%',

    }

    return (
        <div
            style={containerStyles}
        >
            <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%' }}>
                    {errorMessage ? errorMessage : 'An error occurred'}
                </Alert>
            </Snackbar>
            <Paper
                elevation={3}
                sx={{

                    width: '40%',
                    minWidth: '260px',
                    padding: 3,
                    border: 0.1,
                    boxShadow: 0,
                    marginTop: '60px'

                }}
            >
                <Typography variant="h4" align="center">
                    Quick Register
                </Typography>
                <Typography variant="subtitle1" align="center">
                    Welcome! If you already have an account, you can{' '}

                    <Link to={`/login${location.search}`}>

                        Login
                    </Link>
                </Typography>
                {<Typography variant="h4" align="center">

                </Typography>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        autoComplete="given-name"
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={!!errors.firstName}
                        helperText={errors.firstName || ''}
                        {...getTextFieldStyle('firstName')}
                    />
                    <TextField
                        autoComplete="family-name"
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={!!errors.lastName} // Apply error style when there's an error
                        helperText={errors.lastName || ''} // Display the error message
                        {...getTextFieldStyle('lastName')}
                    />

                    <TextField
                        label="Email"
                        autoComplete="email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email} // Apply error style when there's an error
                        helperText={errors.email || ''} // Display the error message
                        {...getTextFieldStyle('email')}
                    />

                    {/* PASSWORD FIELD  */}
                    <TextField
                        autoComplete="new-password"
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
                        {...getTextFieldStyle('password')}
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

                    {/* Confirm Password field */}
                    <TextField
                        autoComplete="new-password"
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
                        {...getTextFieldStyle('confirmPassword')}
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
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <ReCAPTCHA
                            sitekey={siteKey}
                            onChange={onRecaptchaChange}
                        />
                    </Box>
                    <Button
                        sx={{ my: 3 }}
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <CircularProgress size={24} /> : 'Register'}
                    </Button>

                </form>
            </Paper>
            {shouldShowGuestCheckout() && (

                <GuestCheckoutPage />
            )}
        </div>
    );
};

export default RegistrationPage;
