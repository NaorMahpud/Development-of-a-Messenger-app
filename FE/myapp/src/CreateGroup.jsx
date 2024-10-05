import React, { useEffect, useState } from 'react'
import { List, ListItem, ListItemText, Container, Typography, Button, TextField, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateGroup() {
    const [users, setUsers] = useState([]); // שמירת כל המשתמשים באפליקציה לצורך בחירה ביצירת קבוצה
    const [selectedUsers, setSelectedUsers] = useState([]); // משתמשים שנבחרו לקבוצה החדשה
    const [groupName, setGroupName] = useState(''); // שם הקבוצה החדשה
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId'); // מזהה המשתמש
    const navigate = useNavigate()

    // הבאת כל המשתמשים לצורך בחירה ביצירת קבוצה
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [token]);
    // טיפול בבחירת משתמשים ליצירת קבוצה
    const handleSelectUser = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    // טיפול ביצירת קבוצה חדשה
    const handleCreateGroup = async () => {
        if (!groupName) {
            alert('Please enter a group name');
            return;
        }

        try {
            await axios.post('http://localhost:3000/api/groups/create', {
                name: groupName,
                members: selectedUsers // המשתמש היוצר והמשתמשים שנבחרו
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/dashboard/groups')
            window.location.reload()
            
            setGroupName(''); // איפוס שם הקבוצה לאחר יצירתה
            setSelectedUsers([]); // איפוס בחירת המשתמשים

        } catch (error) {
            console.error('Error creating group:', error);
        }
    };



    return (
        <Container style={{marginBottom: "300px"}}>
            <Typography variant="h4" gutterBottom>
                Create a New Group
            </Typography>
            <TextField
                label="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                fullWidth
                style={{ width: "800px" }}
            />
            <br /> <br />

            {groupName &&
                <div>
                    <Typography variant="h6" gutterBottom>
                        Select Users to Add
                    </Typography>
                    <List>
                        {users.filter(user => user._id !== userId).map(user => (
                            <ListItem key={user._id} button onClick={() => handleSelectUser(user._id)}>
                                <ListItemText
                                    primary={user.username}
                                    secondary={selectedUsers.includes(user._id) ? 'Selected' : ''}
                                />
                            </ListItem>
                        ))}
                    </List>
                </div>
            }


            <Button color="primary" variant="contained" onClick={handleCreateGroup}>
                Create
            </Button>
        </Container>
    )
}
