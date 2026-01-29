const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: '../.env' });

async function checkStudents() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({ role: 'student' }, 'uid email mentorId');
        console.log('Students:', JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkStudents();
