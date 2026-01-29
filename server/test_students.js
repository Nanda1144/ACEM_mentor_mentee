const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: '../.env' });

async function test() {
    await mongoose.connect(process.env.MONGODB_URI);
    const mentorUid = 'c-141'; // From my previous check_users.js output
    const students = await User.find({ role: 'student', mentorId: mentorUid });
    console.log('Students for c-141:', JSON.stringify(students, null, 2));
    process.exit(0);
}

test();
