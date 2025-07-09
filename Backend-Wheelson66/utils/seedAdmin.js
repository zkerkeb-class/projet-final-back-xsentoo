const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function seedAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = 'admin@wheels66.com';
  const password = 'Admin123!'; // Change ce mot de passe si tu veux
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin déjà existant.');
    process.exit();
  }

  await User.create({
    name: 'Admin',
    email,
    password: hashedPassword,
    isAdmin: true,
    isBlocked: false,
    isVerified: true,
  });

  console.log('Admin créé ! Email :', email, '| Mot de passe :', password);
  process.exit();
}

seedAdmin();