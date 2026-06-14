const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Auto-create admin if not present
    const User = require('../models/User.model');
    const adminEmail = process.env.ADMIN_EMAIL || 'singhshivam112002@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@Flora2024';
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log('✅ Admin user created automatically');
    }
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
