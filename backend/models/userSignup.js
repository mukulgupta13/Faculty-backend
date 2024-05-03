// models/User.js
const mongoose = require('mongoose');

const userSignupSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true }
});

module.exports = mongoose.model('UserSignup', userSignupSchema);
