/**
 * One-off script to create the first superadmin account.
 * Run with: npm run seed:admin
 * Reads SEED_ADMIN_NAME / SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD from .env.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = (process.env.SEED_ADMIN_EMAIL || '').toLowerCase();

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`[seed] Admin with email ${email} already exists. Skipping.`);
    await mongoose.disconnect();
    return;
  }

  const admin = await User.create({
    name: process.env.SEED_ADMIN_NAME || 'Admin',
    email,
    password: process.env.SEED_ADMIN_PASSWORD,
    role: 'superadmin',
  });

  console.log(`[seed] Superadmin created: ${admin.email}`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('[seed] Failed:', err.message);
  process.exit(1);
});
