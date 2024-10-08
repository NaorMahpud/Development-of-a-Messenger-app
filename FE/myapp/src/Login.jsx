import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null)
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:3000/api/auth/login', {
                username,
                password
            });
            sessionStorage.setItem('userId', data.userId)
            sessionStorage.setItem('token', data.token);
            setMessage("Logging in....")
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000)
        } catch (error) {
            console.error('Login error:', error);
            setMessage(error.response.data.message);
            setTimeout(() => {
                setMessage(null)
            }, 2500);
        }
    };


    return (
        <Container maxWidth="sm" style={{ marginTop: '100px', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Login to Messenger
            </Typography>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <TextField
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    required
                />
                {message && (
                    <Typography color="error" style={{ marginTop: '10px', fontSize: "22px" }}>
                        {message}
                    </Typography>
                )}
                <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
                <Button variant="contained" color="secondary" onClick={() => navigate('/signup')}>Register</Button>

            </form>
        </Container>
    );
};

export default Login;
