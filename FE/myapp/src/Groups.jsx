import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Container, Typography, Button, TextField, Box } from '@mui/material';
import axios from 'axios';
import socket from './socket'; // ייבוא חיבור ל-Socket.IO
import { Outlet, useNavigate } from 'react-router-dom';

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [currentGroup, setCurrentGroup] = useState(null); // הקבוצה הנוכחית שהמשתמש נכנס אליה
    const [currentGroupName, setCurrentGroupName] = useState('')
    const [messages, setMessages] = useState([]); // הודעות בקבוצה הנוכחית
    const [newMessage, setNewMessage] = useState(''); // ההודעה החדשה לשליחה
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId'); // מזהה המשתמש

    const navigate = useNavigate()

    // הבאת הקבוצות
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/api/groups', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setGroups(data);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        fetchGroups();
    }, [token]);


    // הצטרפות לחדר של קבוצה
    const handleJoinGroup = (groupId) => {
        if (currentGroup) {
            socket.emit('leaveGroup', { groupId, userId });
        }
        socket.emit('joinGroup', { groupId, userId });
        setCurrentGroup(groupId); // שמור את הקבוצה הנוכחית שהמשתמש נכנס אליה
        const chosenGroupName = groups.filter(group => group._id === groupId).map(group => group.name)
        setCurrentGroupName(chosenGroupName)
        setMessages([]); // נקה את ההודעות עבור הקבוצה החדשה
        console.log(`User ${userId} joined group ${groupId}`);
    };

    // עזיבת חדר של קבוצה
    const handleLeaveGroup = (groupId) => {
        socket.emit('leaveGroup', { groupId, userId });
        window.location.reload()
    };

    // האזנה להודעות בקבוצה
    useEffect(() => {
        if (currentGroup) {
            socket.on('groupMessages', (messages) => {
                setMessages(messages); // טוען את ההודעות השמורות
            });

            socket.on('receiveGroupMessage', (message) => { // האזנה להודעות חדשות
                setMessages((prevMessages) => [...prevMessages, message]);
            });
        }

        // ניקוי ההאזנה כשהמשתמש עוזב את הקבוצה
        return () => {
            socket.off('groupMessages');
            socket.off('receiveGroupMessage');
        };
    }, [currentGroup]);

    // שליחת הודעה לקבוצה
    const handleSendMessage = () => {
        if (newMessage.trim() && currentGroup) {
            socket.emit('sendGroupMessage', {
                groupId: currentGroup,
                senderId: userId,
                content: newMessage,
            });
            setNewMessage(''); // נקה את שדה ההודעה לאחר השליחה
        }
    };
   

    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', }}>
            <Typography variant="h4" gutterBottom>
                Your Groups
            </Typography>
            <List>
                {groups.length > 0 ? (
                    groups.map(group => (
                        <ListItem style={{ border: "1px solid black" }} key={group._id} button>
                            <ListItemText primary={group.name} />
                            <Button onClick={() => handleJoinGroup(group._id)}>Join</Button>
                            <Button onClick={() => handleLeaveGroup(group._id)}>Leave</Button>
                        </ListItem>
                    ))
                ) : (
                    <Typography variant="body1" color="textSecondary">
                        You are not a member of any groups yet.
                    </Typography>
                )}
            </List>
           
            <br /> <br />
            <Outlet />
            {currentGroup && (
                <div style={{ marginTop: '20px' }}>
                    <Typography variant="h5"> {currentGroupName}</Typography>
                    <TextField
                        label="Type your message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        fullWidth
                    />

                    <Button color="primary" variant="contained" onClick={handleSendMessage} style={{ marginTop: '10px' }}>
                        Send Message
                    </Button>
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
                    <br /> <br />
                </div>
            )}


        </Container>
    );
};

export default Groups;
