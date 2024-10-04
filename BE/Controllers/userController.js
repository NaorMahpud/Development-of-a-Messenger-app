const express = require('express');
const User = require('../Models/userModel');


const router = express.Router();

// קבלת כל המשתמשים
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, 'username isBlocked'); // מחזיר רק שם משתמש וסטטוס חסימה
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// קבלת משתמש לפי ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id, 'username isBlocked');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
});

// עדכון פרטי משתמש (לדוגמה: שינוי שם משתמש)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;
    try {
        const user = await User.findByIdAndUpdate(id, { username }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
});

// חסימת משתמש
router.put('/block/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isBlocked = true; // חסימת המשתמש
        await user.save();
        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error blocking user', error });
    }
});

// שחרור חסימה למשתמש
router.put('/unblock/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isBlocked = false; // שחרור החסימה של המשתמש
        await user.save();
        res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error unblocking user', error });
    }
});

module.exports = router;
