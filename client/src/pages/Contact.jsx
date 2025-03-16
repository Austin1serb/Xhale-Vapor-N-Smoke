import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../utils/secrets';

const Contact = () => {
    useEffect(() => {
        document.title = "Contact Herba Natural - Get in Touch with Us in Kirkland";
        document.querySelector('meta[name="description"]').setAttribute("content", "Contact Herba Natural in Kirkland for inquiries, support, or feedback. We're here to help with all your CBD needs.");
    }, []);


    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitStatus, setSubmitStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            // Send a POST request to the server
            await axios.post(`${BACKEND_URL}/api/contact`, formData);
            // Handle response here
            setSubmitStatus('Message sent successfully.');
            // Reset form
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            console.error('Error sending message:', error);
            setSubmitStatus('Failed to send message. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (
        <Container maxWidth="sm" sx={{ pt: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Contact Us
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    name="name"
                    fullWidth
                    margin="normal"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    margin="normal"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    type="email"
                />
                <TextField
                    label="Subject"
                    name="subject"
                    fullWidth
                    margin="normal"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Message"
                    name="message"
                    fullWidth
                    margin="normal"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    multiline
                    rows={4}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '20px' }}
                    disabled={submitStatus !== ''} // Disable button if submitStatus is not empty}

                >
                    {isLoading ? <CircularProgress color='secondary' /> : "Submit"}
                </Button>

                <h2 style={{ marginTop: '5px', color: 'green', fontWeight: 200 }}>{submitStatus}</h2>
            </form>
            <Typography variant="body1" style={{ marginTop: '20px' }}>
                <Link to="/about" state={{ scrollToBottom: true }} >
                    FAQ
                </Link>
                {" | "}
                <Link to="/privacy-policy" >
                    Privacy Policy
                </Link>
            </Typography>
        </Container>
    );
};

export default Contact;
