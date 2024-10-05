import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Container, Typography } from '@mui/material';
import axios from 'axios';

const MessageHistory = () => {
    const [messages, setMessages] = useState([]);
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        const fetchHistoryMessages = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/api/messages/history', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMessages(data);
            } catch (error) {
                console.error('Error fetching message history:', error.response.data);
            }
        };

        fetchHistoryMessages();
    }, [token]);

    return (
        <Container maxWidth="sm" style={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Message History
            </Typography>
            <List style={{ border: "2px solid back", overflowY: 'scroll', maxHeight: "750px" }}>
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <ListItem key={index} >
                            <ListItemText
                                primary={`${message.senderId}: ${message.content}`}
                                secondary={new Date(message.timestamp).toLocaleString()}
                            />
                        </ListItem>
                    ))
                ) : (
                    <Typography variant="body1" color="textSecondary">
                        No messages found.
                    </Typography>
                )}
            </List>
        </Container>
    );
};

export default MessageHistory;
