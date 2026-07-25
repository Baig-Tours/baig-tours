require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[seed] Connected to MongoDB');

    const existing = await User.findOne({ email: process.env.SEED_ADMIN_EMAIL });
    if (existing) {
      console.log('[seed] Admin already exists:', existing.email);
      process.exit(0);
    }

    const admin = await User.create({
      name: process.env.SEED_ADMIN_NAME || 'Admin',
      email: process.env.SEED_ADMIN_EMAIL || 'admin@baigtours.com',
      password: process.env.SEED_ADMIN_PASSWORD || 'change_this_password',
      role: 'superadmin',
      isActive: true,
    });

    console.log('[seed] Admin created successfully:');
    console.log('  Email:', admin.email);
    console.log('  Password:', process.env.SEED_ADMIN_PASSWORD || 'change_this_password');
    process.exit(0);
  } catch (err) {
    console.error('[seed] Error:', err.message);
    process.exit(1);
  }
};

seedAdmin();