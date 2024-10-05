import React, { useState } from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!username || !password) {
            setError('All fields are required');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/auth/signup', {
                username,
                password,
            });

            if (response.data.message = 'User registered successfully') {
                setError('User successfully registered')
                setTimeout(() => {
                    navigate('/');
                }, 1000) 
            } else {
                setError('Registration failed');
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message); // הצגת ההודעה מהשרת
            } else {
                setError('An error occurred. Please try again.');
            }
            console.error('Error during registration:', error);
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '50px', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Register
            </Typography>

            <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="normal"
            />

            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
            />

            {error && (
                <Typography color="error" style={{ marginTop: '10px', fontSize: "22px" }}>
                    {error}
                </Typography>
            )}

            <Button
                variant="contained"
                color="primary"
                style={{ marginTop: '20px' }}
                onClick={handleRegister}
                fullWidth
            >
                Register
            </Button>
        </Container>
    );
};

export default Registration;
