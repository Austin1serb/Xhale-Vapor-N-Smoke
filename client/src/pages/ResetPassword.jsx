import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, CircularProgress, TextField, Typography } from '@mui/material';

const ResetPassword = () => {
    useEffect(() => {
        document.title = "Reset Your Password - Herba Naturals Account Assistance";
        document.querySelector('meta[name="description"]').setAttribute("content", "Easily reset your Herba Naturals account password. Secure and efficient password recovery for uninterrupted access to our CBD products.");
    }, []);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const token = useParams().token; // Retrieve token from URL
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setErrors({});
        // Password length and strength validation
        if (password.length < 8) {
            setErrors(errors => ({ ...errors, password: 'Password must be at least 8 characters long' }));

        } else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            setErrors(errors => ({ ...errors, password: 'Password must contain at least one uppercase letter, and one number' }));

        }

        if (password !== confirmPassword) {
            setErrors(errors => ({ ...errors, confirmPassword: 'Passwords do not match' }));
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/reset-password', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            });

            const data = await response.json();
            setLoading(false);
            if (response.ok) {
                setMessage('Password has been reset successfully!');

                setTimeout(() => navigate('/login'), 2000); // 2 seconds delay
            } else {
                setErrors({ password: data.message || 'Error occurred' })
                throw new Error(data.message || 'Error occurred');

            }
        } catch (error) {
            setLoading(false);
            setErrors({ password: error.message || 'Error occurred' })
        }
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        maxWidth: '400px',
        margin: 'auto',
        marginTop: '50px',
        marginBottom: '50px',
    };

    return (
        <div style={formStyle}>
            <Typography variant="h5" component="h1" align="center">
                Reset Password
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    name='password'
                    label="New Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    error={!!errors.password}
                    helperText={errors.password}
                />
                <TextField
                    name='confirmPassword'
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                    disabled={loading}
                    sx={{ mt: 2, height: '50px' }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Reset Password'}
                </Button>
                {message && (
                    <Typography style={{ color: '#30842E' }} mt={2}>
                        {message}
                    </Typography>
                )}
            </form>
        </div>
    );
};

export default ResetPassword;
