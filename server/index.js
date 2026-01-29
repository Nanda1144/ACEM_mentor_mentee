const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Higher limit for Base64 images

// DB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Atlas Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const mentorRoutes = require('./routes/mentors');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/mentors', mentorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
