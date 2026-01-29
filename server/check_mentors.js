const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: '../.env' });

async function checkMentors() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const mentors = await User.find({ role: 'mentor' }, 'uid email');
        console.log('Mentors:', JSON.stringify(mentors, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkMentors();
