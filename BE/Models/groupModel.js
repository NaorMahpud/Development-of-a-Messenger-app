const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // שם הקבוצה
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // מנהל הקבוצה
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // חברי הקבוצה
    createdAt: { type: Date, default: Date.now } // תאריך יצירה
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
