import { Button, CircularProgress, IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";

// ForgotPassword.jsx
const ForgotPassword = ({ close }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
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



    const handleSubmit = async (e) => {
        setErrors({});

        if (email.trim() === '') {
            setErrors(errors => ({ ...errors, email: 'Email is required' }));
            return
        }
        else {
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            if (!emailRegex.test(email.trim())) {

                setErrors(errors => ({ ...errors, email: 'Please enter a valid email address' }));

                return
            }

        }
        e.preventDefault();
        try {
            setLoading(true);

            const response = await fetch('http://localhost:8000/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (response.ok) {
                setLoading(false);
                setMessage(data.message);
                startCountdown();
            } else {
                // If the response contains field-specific errors
                if (data.errors && data.errors.email) {
                    setErrors({ email: data.errors.email });
                } else {
                    // General error message
                    setErrors({ email: data.message || 'Error occurred' });
                }
            }
        } catch (error) {
            setLoading(false);
            // Handle network or other errors here
            setErrors({ message: error.message });
        }
        finally {
            setLoading(false);

        }
    };
    const styles = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '40vh',
        backgroundColor: 'white',
        bgcolor: 'background.paper',
        boxShadow: 24,
        padding: '10px',
        borderRadius: '10px',
        border: '0.1px solid black',
    }
    return (

        <div style={styles}>

            <Typography variant="h5" align="center" >
                Forgot Password
            </Typography>
            <IconButton style={{ transform: 'translate(255px, -45px)', }} onClick={() => close(false)}>


                <svg style={{ border: '1px solid black', borderRadius: '10px' }} height='40' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                    <path fill="white" d="M184 840h656V184H184v656zm163.9-473.9A7.95 7.95 0 0 1 354 353h58.9c4.7 0 9.2 2.1 12.3 5.7L512 462.2l86.8-103.5c3-3.6 7.5-5.7 12.3-5.7H670c6.8 0 10.5 7.9 6.1 13.1L553.8 512l122.3 145.9c4.4 5.2.7 13.1-6.1 13.1h-58.9c-4.7 0-9.2-2.1-12.3-5.7L512 561.8l-86.8 103.5c-3 3.6-7.5 5.7-12.3 5.7H354c-6.8 0-10.5-7.9-6.1-13.1L470.2 512 347.9 366.1z" />
                    <path fill="#333" d="M354 671h58.9c4.8 0 9.3-2.1 12.3-5.7L512 561.8l86.8 103.5c3.1 3.6 7.6 5.7 12.3 5.7H670c6.8 0 10.5-7.9 6.1-13.1L553.8 512l122.3-145.9c4.4-5.2.7-13.1-6.1-13.1h-58.9c-4.8 0-9.3 2.1-12.3 5.7L512 462.2l-86.8-103.5c-3.1-3.6-7.6-5.7-12.3-5.7H354c-6.8 0-10.5 7.9-6.1 13.1L470.2 512 347.9 657.9A7.95 7.95 0 0 0 354 671z" />
                </svg>



            </IconButton>
            <div style={{ borderTop: '0.1px solid black', transform: 'translateY(-48px)', marginLeft: '-10px', marginRight: '-10px' }}>
            </div>
            <Typography mb={4} mt={-3} textAlign='center' variant="body2">Send a link to reset  <br />  your password</Typography>

            <TextField

                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                error={!!errors.email}
                helperText={errors.email || ''}

            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
                disabled={isButtonDisabled || loading}
                type="submit"
                sx={{ mt: 5, height: '50px' }}
            >
                {loading ? (
                    <CircularProgress size={24} />
                ) : isButtonDisabled ? (
                    `Resend Link (${countdown})`
                ) : (
                    'Send Link'
                )}
            </Button>

            {message && <p style={{ textAlign: 'center', color: '#30842E', marginTop: '5px' }}>{message}</p>}
        </div>

    );
};



export default ForgotPassword
