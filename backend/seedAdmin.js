require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

connectDB().then(async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@thefolio.com';
        const adminPass = process.env.ADMIN_PASSWORD || 'Admin@1234';
        const adminName = process.env.ADMIN_NAME || 'Admin';
        
        const exists = await User.findOne({ email: adminEmail });
        if (exists) {
            console.log('Admin already exists.');
            process.exit();
        }
        
        // IMPORTANT: This model has NO pre-save hook, so we must hash manually!
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPass, salt);
        
        await User.create({
            teamName: adminName,
            ign: 'Admin',
            email: adminEmail,
            password: hashedPassword,
            dob: '2000-01-01',
            level: 'mythic',
            terms: true,
            role: 'Admin'
        });
        
        console.log('Admin created!');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
});