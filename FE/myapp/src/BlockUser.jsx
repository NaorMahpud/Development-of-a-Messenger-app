import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Button, Container, Typography } from '@mui/material';
import axios from 'axios';

const BlockUser = () => {
    const [users, setUsers] = useState([]);
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId');

    // הבאת רשימת כל המשתמשים
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error.response.data);
            }
        };

        fetchUsers();
    }, [token]);

    // טיפול בחסימת משתמש
    const handleBlockUser = async (userId) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/users/block/${userId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('User blocked:', response.data);
            // עדכון רשימת המשתמשים אחרי החסימה
            setUsers(users.map(user => user._id === userId ? { ...user, isBlocked: true } : user));
        } catch (error) {
            console.error('Error blocking user:', error);
        }
    };

    // טיפול בביטול חסימת משתמש
    const handleUnblockUser = async (userId) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/users/unblock/${userId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('User unblocked:', response.data);
            // עדכון רשימת המשתמשים אחרי ביטול החסימה
            setUsers(users.map(user => user._id === userId ? { ...user, isBlocked: false } : user));
        } catch (error) {
            console.error('Error unblocking user:', error);
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginBottom: "400px", textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Users List
            </Typography>
            <List>
                {users.length > 0 ? (
                    users.filter(user => user._id !== userId).map(user => (
                        <ListItem style={{ border: "1px solid black" }} key={user._id}>
                            <ListItemText primary={user.username} />
                            {user.isBlocked ? (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleUnblockUser(user._id)}
                                >
                                    Unblock
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleBlockUser(user._id)}
                                >
                                    Block
                                </Button>
                            )}
                        </ListItem>
                    ))
                ) : (
                    <Typography variant="body1" color="textSecondary">
                        No users found.
                    </Typography>
                )}
            </List>
        </Container>
    );
};

export default BlockUser;
