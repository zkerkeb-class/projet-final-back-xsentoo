const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified:       { type: Boolean, default: false },
  verificationCode: { type: String },
  isAdmin:   { type: Boolean, default: false },   // <-- AJOUTE ICI
  isBlocked: { type: Boolean, default: false }    // <-- AJOUTE ICI
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);