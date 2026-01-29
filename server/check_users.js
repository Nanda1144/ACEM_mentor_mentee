const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: '../.env' });

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const users = await User.find({}, 'uid email role');
        console.log('Total users:', users.length);
        console.log('Users:', JSON.stringify(users, null, 2));

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkUsers();
