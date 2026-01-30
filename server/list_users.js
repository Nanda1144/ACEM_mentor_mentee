const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load .env.local from the root
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    console.error('.env.local not found at', envPath);
    process.exit(1);
}

const User = require('./models/User');

async function listUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({});
        console.log('--- USERS IN DATABASE ---');
        users.forEach(u => {
            console.log(`UID: "${u.uid}", Email: "${u.email}", Role: "${u.role}", Name: "${u.name}"`);
        });
        console.log('-------------------------');
        console.log('Total users:', users.length);

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

listUsers();
