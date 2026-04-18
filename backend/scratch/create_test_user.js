const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const createTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Check if test user exists
        const existingUser = await User.findOne({ accountNumber: 100000 });
        if (existingUser) {
            console.log('Test user already exists. Account Number: 100000, Password: password123');
            process.exit();
        }

        const testUser = new User({
            name: 'Test Administrator',
            email: 'admin_test@artheron.com',
            password: 'password123',
            accountNumber: 100000,
            role: 'admin',
            isVerified: true,
            balances: {
                tokenBalance: 10000,
                stakeBalance: 5000,
                incomeBalance: 250,
                lockedBalance: 0
            }
        });

        await testUser.save();
        console.log('Test User Created Successfully!');
        console.log('------------------------------');
        console.log('Account Number: 100000');
        console.log('Password: password123');
        console.log('Role: admin');
        console.log('------------------------------');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createTestUser();
