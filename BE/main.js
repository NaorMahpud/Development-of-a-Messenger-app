const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http')
const socketIO = require('socket.io')

const app = express();
const server = http.createServer(app)
const io = socketIO(server, {
    cors: {
        origin: ["http://localhost:3000", 'http://localhost:5173'],
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
})

app.use(cors())
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/WHATSAPPDB').then(() => { console.log('Connected to MongoDB'); })
    .catch((err) => { console.error('Failed to connect to MongoDB', err); });


const { authenticateToken } = require('./Middleware/checkToken');

const Message = require('./Models/messageModel')
const Group = require('./Models/groupModel')

// חיבור פשוט עם WebSockets
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    socket.join(userId)

    // // שליחת הודעה למשתמש אחר
    socket.on('sendMessage', async ({ recipientId, content, senderId }) => {
        const message = new Message({
            senderId,
            recipientId,
            content,
            timestamp: new Date(),
        });
        try {
            await message.save()
            io.to(recipientId).emit('receiveMessage', message);
            io.to(senderId).emit('receiveMessage', message);

        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    });

    socket.on('joinPrivateChat', async ({ userId, recipientId }) => {
        try {
            // שליפת כל ההודעות בין המשתמשים (שני הצדדים)
            const messages = await Message.find({
                $or: [
                    { senderId: userId, recipientId },
                    { senderId: recipientId, recipientId: userId }
                ]
            }).sort({ timestamp: 1 });

            // שליחת ההודעות השמורות למשתמש
            socket.emit('loadPrivateMessages', messages);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    });

    // הצטרפות לקבוצה
    socket.on('joinGroup', async ({ groupId, userId }) => {
        socket.join(groupId);
        console.log(`User ${userId} joined group ${groupId}`);

        try {
            const messages = await Message.find({ groupId }).sort({ timestamp: 1 });

            // שליחת ההודעות השמורות למשתמש שהצטרף
            socket.emit('groupMessages', messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    });

    // יציאה מקבוצה
    socket.on('leaveGroup', async (data) => {
        try {
            socket.leave(data.groupId);
            if (data.userId) {
                const updatedGroup = await Group.findByIdAndUpdate(
                    data.groupId,
                    { $pull: { members: data.userId } }, // מסיר את ה-userId ממערך החברים
                    { new: true } // מחזיר את המסמך המעודכן
                );

                if (updatedGroup) {
                    console.log(`User ${data.userId} left group ${data.groupId}`);
                } else {
                    console.log(`Group ${data.groupId} not found`);
                }
            }
        } catch (error) {
            console.error('Error while leaving group:', error);
        }
    });

    socket.on('sendGroupMessage', async ({ groupId, senderId, content }) => {
        const message = new Message({
            groupId,
            senderId,
            content
        });

        try {
            await message.save(); // שמירת ההודעה במסד הנתונים

            // שליחת ההודעה לכל המשתמשים בחדר
            io.to(groupId).emit('receiveGroupMessage', {
                senderId,
                content,
                timestamp: message.timestamp
            });
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });


    // ניתוק משתמש
    socket.on('disconnect', () => {
        console.log('User disconnected:', userId);
    });

});


const authController = require('./Controllers/authController')
app.use('/api/auth', authController)

const groupController = require('./Controllers/groupController')
app.use('/api/groups', authenticateToken, groupController)

const userController = require('./Controllers/userController')
app.use('/api/users', authenticateToken, userController)

const messageController = require('./Controllers/messageController')
app.use('/api/messages', authenticateToken, messageController)



server.listen(3000, () => {
    console.log(`Server running on port 3000`);
});
