const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get mentor details by UID
router.get('/:uid', async (req, res) => {
    try {
        const mentor = await User.findOne({ uid: req.params.uid, role: 'mentor' });
        if (!mentor) return res.status(404).json({ msg: 'Mentor not found' });
        res.json(mentor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update mentor profile
router.patch('/:uid', async (req, res) => {
    try {
        const updates = req.body;
        const mentor = await User.findOneAndUpdate(
            { uid: req.params.uid, role: 'mentor' },
            { $set: updates },
            { new: true }
        );
        res.json(mentor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
