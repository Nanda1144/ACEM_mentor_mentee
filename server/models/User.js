const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'mentor'], required: true },

    // Shared / Role Specific
    dept: { type: String, default: 'Computer Science' },
    year: { type: String }, // Student
    mentorId: { type: String }, // Student linked to Mentor ID

    // Student Metrics
    progress: { type: Number, default: 0 },
    attendance: { type: Number, default: 0 },
    lastUpdate: { type: Date, default: Date.now },
    currentProject: { type: String },
    technologies: { type: String },
    skills: { type: String },

    // Mentor Specific
    collegeHeader: { type: String, default: 'ST. JOSEPH INSTITUTE OF TECHNOLOGY' },
    collegeLogo: { type: String }, // Base64 or URL

    photo: { type: String }, // Base64 profile photo
    phone: { type: String },
    address: { type: String },
    office: { type: String }, // Mentor
    designation: { type: String }, // Mentor
    expertise: { type: String }, // Mentor

    // Student Specific Collections
    events: [{
        name: String,
        college: String,
        date: String,
        certificate: String,
        status: { type: String, default: 'Pending' },
        timestamp: { type: Date, default: Date.now }
    }],
    achievements: [{
        title: String,
        date: String,
        description: String,
        timestamp: { type: Date, default: Date.now }
    }],
    leaves: [{
        reason: String,
        startDate: String,
        endDate: String,
        status: { type: String, default: 'Pending' },
        timestamp: { type: Date, default: Date.now }
    }],
    activities: [{
        description: String,
        type: String, // 'event', 'achievement', 'leave', 'update'
        timestamp: { type: Date, default: Date.now }
    }],
    weeklyUpdates: [{
        title: String,
        description: String,
        weekNumber: Number,
        timestamp: { type: Date, default: Date.now }
    }],
    notifications: [{
        message: String,
        type: String, // 'info', 'warning', 'success'
        isRead: { type: Boolean, default: false },
        timestamp: { type: Date, default: Date.now }
    }],
    documents: [{
        name: String,
        type: String, // 'pdf', 'excel'
        url: String,
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
