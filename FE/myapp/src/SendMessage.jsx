import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import socket from './socket';


const SendMessage = () => {
    const [users, setUsers] = useState([]); // כל המשתמשים
    const [messages, setMessages] = useState([]);
    const [recipientId, setRecipientId] = useState(''); // הנמען הנבחר
    const [content, setContent] = useState('');

    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId');

    // הבאת כל המשתמשים מהשרת
    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('http://localhost:3000/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    

    useEffect(() => {
        const handleReceiveMessage = (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        socket.on('receiveMessage', handleReceiveMessage);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
        };
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:3000/api/messages', {
                recipientId,
                content
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // שליחת ההודעה גם דרך Socket.IO
            socket.emit("sendMessage", {
                recipientId,
                content,
                senderId: sessionStorage.getItem('userId'),
            });

            setContent(''); // נקה את שדה ההודעה לאחר השליחה
        } catch (error) {
            setStatus(error.response.data.message);
        }

    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '50px', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Send a Message
            </Typography>
            <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <FormControl fullWidth>
                    <InputLabel id="recipient-select-label1">Recipient</InputLabel>

                    {users.length > 1 ? (
                        <Select
                            labelId="recipient-select-label1"
                            value={recipientId}
                            onChange={(e) => setRecipientId(e.target.value)}
                            fullWidth
                            required
                        >
                            {users.filter(user => user._id !== userId).map((user) => (
                                <MenuItem key={user._id} value={user._id}>
                                    {user.username}
                                </MenuItem>
                            ))}
                        </Select>
                    ) : (

                        <Select
                            labelId="recipient-select-label2"
                            value={recipientId}
                            fullWidth
                            required
                        >
                            {users.filter(user => user._id !== userId).map((user) => (
                                <MenuItem key={user._id} value={user._id}>
                                    {user.username}
                                </MenuItem>
                            ))}
                        </Select>
                    )
                    }
                </FormControl>

                <TextField
                    label="Message"
                    variant="outlined"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    fullWidth
                    required
                    multiline
                    rows={4}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Send
                </Button>
            </form>

            <Typography variant="h5" style={{ marginTop: '20px', textAlign: 'center' }}>
                Messages:
            </Typography>

            <Box
                style={{
                    width: '100%',
                    maxWidth: '600px',
                    height: '200px',
                    overflowY: 'scroll',
                    border: '1px solid #ccc',
                    padding: '10px',
                    marginTop: '10px',
                }}
            >
                <ul>
                    {messages.map((message, index) => (
                        <li key={index}>
                            {message.senderId}: {message.content} ({new Date(message.timestamp).toLocaleString()})
                        </li>
                    ))}
                </ul>
            </Box>
            
        </Container>
    );
};

export default SendMessage;
