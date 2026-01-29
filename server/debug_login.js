const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config({ path: '../.env' });

async function debug() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const testUid = 'test-' + Date.now();
        const testPassword = 'password123';
        const role = 'student';

        // 1. Create User
        const hashedPassword = await bcrypt.hash(testPassword, 10);
        const newUser = new User({
            uid: testUid,
            name: 'Test Tool',
            email: testUid + '@test.com',
            password: hashedPassword,
            role: role
        });
        await newUser.save();
        console.log('User created:', testUid);

        // 2. Try Login logic
        const user = await User.findOne({ uid: testUid, role: role });
        if (!user) {
            console.log('Login failed: User not found in DB');
        } else {
            const isMatch = await bcrypt.compare(testPassword, user.password);
            console.log('Password match:', isMatch);
        }

        // Cleanup
        await User.deleteOne({ uid: testUid });
        console.log('Test user deleted');

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

debug();
