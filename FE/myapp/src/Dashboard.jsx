import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';


const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    return (
        <Box display="flex" style={{ height: '100vh' }}>
            <Box
                style={{
                    width: '25%',
                    backgroundColor: '#f0f0f0',
                    padding: '20px',
                    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
                }}
            >
                <Typography variant="h4" gutterBottom style={{ textAlign: 'center' }}>
                    Welcome to Messenger
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginBottom: '10px' }}
                    fullWidth
                    onClick={() => navigate('/dashboard/send-message')}
                >
                    Send Message
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginBottom: '10px' }}
                    fullWidth
                    onClick={() => navigate('/dashboard/groups')}
                >
                    View Groups
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginBottom: '10px' }}
                    fullWidth
                    onClick={() => navigate('/dashboard/creategroup')}
                >
                    Create Group
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginBottom: '10px' }}
                    fullWidth
                    onClick={() => navigate('/dashboard/message-history')}
                >
                    Message History
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginBottom: '10px' }}
                    fullWidth
                    onClick={() => navigate('/dashboard/blocks')}
                >
                    Blocks Users
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>

            {/* Main content area for messages */}
            <Box
                style={{
                    flex: 1,
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Outlet />


            </Box>
        </Box>
    );
};

export default Dashboard;
