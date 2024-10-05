const express = require('express');
const Message = require('../Models/messageModel');
const User = require('../Models/userModel');
const Group = require('../Models/groupModel');
const { authenticateToken } = require('../Middleware/checkToken');

const router = express.Router();

// שליחת הודעה
router.post('/', authenticateToken, async (req, res) => {
    const { recipientId, groupId, content } = req.body;
    const senderId = req.user.userId;
    console.log(senderId)
    try {
        // בדיקה אם השולח חסום
        const sender = await User.findById(senderId);
        if (sender.isBlocked) {
            return res.status(403).json({ message: 'You are blocked by this user' });
        }

        // אם מדובר בנמען יחיד
        if (recipientId) {
            const recipient = await User.findById(recipientId);
            if (recipient.isBlocked) {
                return res.status(403).json({ message: 'Recipient is blocked' });
            }

            const message = new Message({
                senderId: senderId,
                recipientId: recipientId,
                content
            });

            await message.save();

            return res.status(201).json({ message: 'Message sent successfully' });
        }

        // אם מדובר בקבוצה
        if (groupId) {
            const group = await Group.findById(groupId);
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }

            const message = new Message({
                sender: senderId,
                group: groupId,
                content
            });

            await message.save();


            return res.status(201).json({ message: 'Message sent successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error });
    }
});

// קבלת היסטוריית השיחות האחרונות
router.get('/history', authenticateToken, async (req, res) => {
    const userId = req.user.userId; // מזהה המשתמש הנוכחי

    try {
        // שליפת ההודעות שהמשתמש שלח או קיבל, מוגבלות ל-20 האחרונות
        const messages = await Message.find({
            $or: [
                { senderId: userId },
                { recipientId: userId } 
            ]
        })
            .sort({ timestamp: -1 }) // סדר מהעדכני לישן
            .limit(20); 

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching message history', error });
    }
});

module.exports = router;
