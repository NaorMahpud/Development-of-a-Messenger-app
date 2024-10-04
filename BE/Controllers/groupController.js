const express = require('express');
const Group = require('../Models/groupModel');
const { authenticateToken } = require('../Middleware/checkToken');

const router = express.Router();

// קבלת כל הקבוצות שהמשתמש חבר בהן
router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        // מציאת כל הקבוצות שהמשתמש חבר בהן
        const groups = await Group.find({ members: userId });
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ message: 'Error fetching groups', error });
    }
});


// יצירת קבוצה חדשה
router.post('/create', authenticateToken, async (req, res) => {
    const { name, members } = req.body;
    const adminId = req.user.userId;

    try {
        const existingGroup = await Group.findOne({ name });
        if (existingGroup) {
            return res.status(400).json({ message: 'Group name already exists' });
        }

        const group = new Group({
            name,
            admin: adminId,
            members: [adminId, ...members] // המנהל הוא גם חבר הקבוצה
        });

        await group.save();
        res.status(201).json({ message: 'Group created successfully', group });
    } catch (error) {
        res.status(500).json({ message: 'Error creating group', error });
    }
});

// הוספת חברים לקבוצה
router.put('/add-member/:groupId', authenticateToken, async (req, res) => {
    const { groupId } = req.params;
    const { newMemberId } = req.body;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // בדיקה שהמשתמש מוסיף חברים לקבוצה שהוא מנהל
        if (group.admin.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Only the admin can add members' });
        }

        group.members.push(newMemberId);
        await group.save();
        res.status(200).json({ message: 'Member added successfully', group });
    } catch (error) {
        res.status(500).json({ message: 'Error adding member', error });
    }
});

// עזיבת קבוצה
router.put('/leave/:groupId', authenticateToken, async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.userId;
    
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // בדיקה שהמשתמש בקבוצה ואז הסרה שלו מהרשימה
        if (!group.members.includes(userId)) {
            return res.status(400).json({ message: 'User is not a member of this group' });
        }

        // הסרת המשתמש מהקבוצה
        group.members = group.members.filter(member => member.toString() !== userId);
        await group.save();

        console.log(`User ${userId} left group ${groupId}`);
        res.status(200).json({ message: 'You have left the group', group });

    } catch (error) {
        console.error('Error leaving group:', error); // הצגת השגיאה במסוף
        res.status(500).json({ message: 'Error leaving group', error });
    }
});


module.exports = router;
