// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, default: "0" },
  bio: { type: String, default: null },
  profileImage: { type: String, default: null },
  authorized: { type: Boolean, default: false },
  folderCode: { type: String, default: null }, // Nueva propiedad para la carpeta del usuario
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  notifications: { type: Array, default: [] },
  messages: { type: Array, default: [] }
});

// Encriptar la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);
