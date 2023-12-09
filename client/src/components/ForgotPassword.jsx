import { Button, CircularProgress, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

// ForgotPassword.jsx
const ForgotPassword = ({ close, type, resetEmail, startCountdown, countdown, isButtonDisabled }) => {
    const [email, setEmail] = useState(resetEmail || '');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});





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
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (response.ok) {
                setLoading(false);
                setMessage(data.message);
                startCountdown();

            } if (response.status === 429) {
                setErrors({ email: response.statusText, });

            } else {
                // If the response contains field-specific errors
                if (data.errors && data.errors.email) {
                    setErrors({ email: data.errors.email });
                } else {
                    // General error message
                    setMessage(data.message || 'Error occurred');
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
        height: '410px',
        backgroundColor: 'white',
        bgcolor: 'background.paper',


        borderRadius: '5px',
        border: '0.1px solid black',
    }
    return (

        <div style={styles}>

            <Typography sx={{ backgroundColor: '#0F75E0', padding: 2, color: 'white', pb: 2 }} variant="h5" align="center" >
                {type === 'change' ? ('Reset Password') : (' Forgot Password')}
            </Typography>
            <IconButton style={{ transform: 'translate(240px, -60px)', color: '#282F48' }} onClick={() => close(false)}>


                {/* CLOSE ICON */}
                <svg xmlns="http://www.w3.org/2000/svg" fill='white' height="40" width="40"><path d="m10.458 31.458-1.916-1.916 9.5-9.542-9.5-9.542 1.916-1.916 9.542 9.5 9.542-9.5 1.916 1.916-9.5 9.542 9.5 9.542-1.916 1.916-9.542-9.5Z" /></svg>



            </IconButton>
            <div >
            </div>
            <Typography mb={4} mt={{ sm: -3, md: 0 }} textAlign='center' variant="body2">Send a link to reset  <br />  your password</Typography>
            <div style={{ padding: 10 }}>
                <TextField
                    id="email-reset"
                    type="email"
                    autoComplete="email"
                    label="Email Address"
                    disabled={type === 'change' ? true : false}
                    //fill with reset email if type === change

                    value={type === 'change' ? resetEmail : email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email || ''}
                    name="email"
                />
                {message && <h3 style={{ textAlign: 'center', color: '#30842E', marginTop: '5px' }}>{message}!</h3>}
                <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={isButtonDisabled || loading}
                    type="submit"
                    sx={{ mt: 8, height: '50px' }}
                >
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : isButtonDisabled ? (
                        `Resend Link (${countdown})`
                    ) : (
                        'Send Link'
                    )}
                </Button>


            </div>
        </div>

    );
};



export default ForgotPassword
