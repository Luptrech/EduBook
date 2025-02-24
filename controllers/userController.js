// backend/controllers/userController.js
const User = require('../models/User');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

exports.registerUser = async (req, res) => {
  try {
    const { username, password, phone } = req.body;
    // Se puede validar que phone no sea "" o "0" en el controlador o en el esquema
    const user = new User({ username, password, phone });
    await user.save();
    res.status(201).json({ message: 'Registro enviado, espere aprobación del administrador' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciales inválidas' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.iforgot = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: 'No se encontró usuario con ese teléfono' });
    // Aquí se podría notificar al admin para iniciar el proceso de restablecimiento
    res.json({ message: 'Solicitud de restablecimiento enviada. Contacte al administrador.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const currentUser = req.user;
    const targetUser  = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'Usuario no encontrado' });
    if (!targetUser.followers.includes(currentUser._id)) {
      targetUser.followers.push(currentUser._id);
      await targetUser.save();
      return res.json({ message: `Ahora sigues a ${targetUser.username}` });
    }
    res.status(400).json({ message: 'Ya sigues a este usuario' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
