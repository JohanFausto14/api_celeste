const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  tower: { type: String, required: true },
  role: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
