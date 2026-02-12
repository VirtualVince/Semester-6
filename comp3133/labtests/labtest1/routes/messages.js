const express = require('express');
const router = express.Router();
const GroupMessage = require('../models/GroupMessage');
const PrivateMessage = require('../models/PrivateMessage');

// Get group messages for a specific room
router.get('/group/:room', async (req, res) => {
    try {
        const { room } = req.params;
        const messages = await GroupMessage.find({ room })
            .sort({ date_sent: 1 })
            .limit(100);
        
        res.json({ 
            success: true, 
            messages 
        });
    } catch (error) {
        console.error('Error fetching group messages:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching messages' 
        });
    }
});

// Get private messages between two users
router.get('/private/:user1/:user2', async (req, res) => {
    try {
        const { user1, user2 } = req.params;
        const messages = await PrivateMessage.find({
            $or: [
                { from_user: user1, to_user: user2 },
                { from_user: user2, to_user: user1 }
            ]
        })
        .sort({ date_sent: 1 })
        .limit(100);
        
        res.json({ 
            success: true, 
            messages 
        });
    } catch (error) {
        console.error('Error fetching private messages:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching messages' 
        });
    }
});

module.exports = router;