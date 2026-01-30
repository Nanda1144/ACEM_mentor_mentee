const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all students for a specific mentor
router.get('/mentor/:mentorId', async (req, res) => {
    try {
        const mid = req.params.mentorId.toLowerCase();
        const students = await User.find({ role: 'student', mentorId: mid });
        const formattedStudents = students.map(s => ({
            ...s.toObject(),
            id: s.uid
        }));
        res.json(formattedStudents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update student progress (used by student)
router.patch('/:uid', async (req, res) => {
    try {
        const updates = req.body;
        updates.lastUpdate = new Date();
        const student = await User.findOneAndUpdate(
            { uid: req.params.uid, role: 'student' },
            { $set: updates },
            { new: true }
        );
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add an event
router.post('/:uid/events', async (req, res) => {
    try {
        const { name, college, date, certificate } = req.body;
        const student = await User.findOne({ uid: req.params.uid, role: 'student' });
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        const newEvent = { name, college, date, certificate, status: 'Pending' };
        student.events.push(newEvent);

        // Log in activities
        student.activities.push({
            description: `Participated in ${name} at ${college}`,
            type: 'event'
        });

        await student.save();
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add an achievement
router.post('/:uid/achievements', async (req, res) => {
    try {
        const { title, date, description } = req.body;
        const student = await User.findOne({ uid: req.params.uid, role: 'student' });
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        student.achievements.push({ title, date, description });
        student.activities.push({
            description: `Achievement Unlocked: ${title}`,
            type: 'achievement'
        });

        await student.save();
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a leave request
router.post('/:uid/leaves', async (req, res) => {
    try {
        const { reason, startDate, endDate } = req.body;
        const student = await User.findOne({ uid: req.params.uid, role: 'student' });
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        student.leaves.push({ reason, startDate, endDate, status: 'Pending' });
        student.activities.push({
            description: `Applied for leave: ${reason} (${startDate} to ${endDate})`,
            type: 'leave'
        });

        await student.save();
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a weekly update
router.post('/:uid/weekly-updates', async (req, res) => {
    try {
        const { title, description, weekNumber } = req.body;
        const student = await User.findOne({ uid: req.params.uid, role: 'student' });
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        student.weeklyUpdates.push({ title, description, weekNumber });
        student.activities.push({
            description: `Weekly Update Submitted: Week ${weekNumber} - ${title}`,
            type: 'update'
        });

        await student.save();
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a notification
router.post('/:uid/notifications', async (req, res) => {
    try {
        const { message, type } = req.body;
        const student = await User.findOne({ uid: req.params.uid, role: 'student' });
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        student.notifications.push({ message, type });
        await student.save();
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get notifications (filtered to last 3 months)
router.get('/:uid/notifications', async (req, res) => {
    try {
        const student = await User.findOne({ uid: req.params.uid, role: 'student' });
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        const filteredNotifications = student.notifications.filter(note =>
            new Date(note.timestamp) >= threeMonthsAgo
        );

        res.json(filteredNotifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a document (PDF/Excel)
router.post('/:uid/documents', async (req, res) => {
    try {
        const { name, type, url } = req.body;
        const student = await User.findOne({ uid: req.params.uid, role: 'student' });
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        student.documents.push({ name, type, url });
        await student.save();
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a project
router.post('/:uid/projects', async (req, res) => {
    try {
        const { title, description, link, status } = req.body;
        const student = await User.findOne({ uid: req.params.uid, role: 'student' });
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        student.projects.push({ title, description, link, status });
        student.activities.push({
            description: `Added project: ${title}`,
            type: 'update'
        });

        await student.save();
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a course
router.post('/:uid/courses', async (req, res) => {
    try {
        const { name, platform, status, certificate } = req.body;
        const student = await User.findOne({ uid: req.params.uid, role: 'student' });
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        student.courses.push({ name, platform, status, certificate });
        student.activities.push({
            description: `Enrolled in course: ${name} on ${platform}`,
            type: 'update'
        });

        await student.save();
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a research paper
router.post('/:uid/research-papers', async (req, res) => {
    try {
        const { title, journal, link, status } = req.body;
        const student = await User.findOne({ uid: req.params.uid, role: 'student' });
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        student.researchPapers.push({ title, journal, link, status });
        student.activities.push({
            description: `Added research paper: ${title}`,
            type: 'update'
        });

        await student.save();
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
