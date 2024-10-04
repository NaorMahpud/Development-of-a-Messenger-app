import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import socket from './socket';


const SendMessage = () => {
    const [messages, setMessages] = useState([]);
    const [recipientId, setRecipientId] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('');

    const token = sessionStorage.getItem('token');

    useEffect(() => {
        const handleReceiveMessage = (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            console.log('Received message:', message);
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


            setStatus('Message sent successfully!');
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
                <TextField
                    label="Recipient ID"
                    variant="outlined"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    fullWidth
                    required
                />
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
                    height: '300px',
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
            {status && <Typography style={{ marginTop: '20px' }}>{status}</Typography>}
        </Container>
    );
};

export default SendMessage;
