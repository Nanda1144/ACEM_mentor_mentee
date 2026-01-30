const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        console.log('Registration attempt:', req.body.uid, req.body.email, req.body.role);
        let { uid, name, email, password, role, mentorId } = req.body;

        // Normalizing to lowercase
        email = email.toLowerCase().trim();

        // Auto-generate Mentor ID if it's a mentor and no ID provided
        if (role === 'mentor' && (!uid || uid.trim() === '')) {
            const count = await User.countDocuments({ role: 'mentor' });
            uid = `m-${Math.floor(1000 + Math.random() * 9000)}-${count + 1}`;
        } else {
            uid = uid.toLowerCase().trim();
        }

        if (mentorId) {
            mentorId = mentorId.toLowerCase().trim();
        }

        let user = await User.findOne({ uid });
        if (user) {
            console.log('Registration failed: UID already exists', uid);
            return res.status(400).json({ msg: `The ID "${uid}" is already registered. Please use a different ID.` });
        }

        let emailCheck = await User.findOne({ email });
        if (emailCheck) {
            console.log('Registration failed: Email already exists', email);
            return res.status(400).json({ msg: `The Email "${email}" is already registered.` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            uid, name, email, password: hashedPassword, role, mentorId,
            events: [], achievements: [], leaves: [], activities: []
        });

        await user.save();
        console.log('Registration successful:', uid);

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                id: user.uid,
                name: user.name,
                email: user.email,
                role: user.role,
                mentorId: user.mentorId,
                events: [],
                achievements: [],
                leaves: [],
                activities: [],
                attendance: 0
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        console.log('Login attempt:', req.body.uid, req.body.role);
        let { uid, password, role } = req.body;

        // Normalizing for case-insensitive lookup
        uid = uid.toLowerCase().trim();

        // Find user by UID first (case-insensitive handled by normalization)
        const user = await User.findOne({ uid });

        if (!user) {
            console.log('Login failed: User not found with ID', uid);
            return res.status(400).json({ msg: 'User ID does not exist' });
        }

        // Check if role matches
        if (user.role !== role) {
            console.log(`Login failed: Role mismatch for ${uid}. Expected ${role}, found ${user.role}`);
            return res.status(400).json({ msg: `This ID is registered as a ${user.role}, not a ${role}.` });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Login failed: Invalid credentials for', uid);
            return res.status(400).json({ msg: 'Invalid password' });
        }

        console.log('Login successful:', uid);
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                id: user.uid,
                name: user.name,
                email: user.email,
                role: user.role,
                dept: user.dept,
                year: user.year,
                mentorId: user.mentorId,
                collegeHeader: user.collegeHeader,
                collegeLogo: user.collegeLogo,
                photo: user.photo,
                events: user.events || [],
                achievements: user.achievements || [],
                leaves: user.leaves || [],
                activities: user.activities || [],
                attendance: user.attendance || 0
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
