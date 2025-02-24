const User = require('../models/User');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Registrar usuario
exports.registerUser = async (req, res) => {
  try {
    const { username, password, phone, email } = req.body;
    
    if (!username || !password || (!phone && !email)) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const user = new User({ username, password, phone: phone || "0", email });
    await user.save();
    res.status(201).json({ message: 'Registro exitoso, ahora puedes iniciar sesión' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Iniciar sesión con 2 datos (nombre + contraseña o correo + contraseña)
exports.loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    const user = await User.findOne({ 
      $or: [{ username: identifier }, { email: identifier }, { phone: identifier }] 
    });

    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener perfil del usuario
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Editar perfil del usuario
exports.editProfile = async (req, res) => {
  try {
    const { bio, profileImage, coverImage } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    user.bio = bio || user.bio;
    user.profileImage = profileImage || user.profileImage;
    user.coverImage = coverImage || user.coverImage;

    await user.save();
    res.json({ message: 'Perfil actualizado correctamente', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Solicitar restablecimiento de contraseña
exports.iforgot = async (req, res) => {
  try {
    const { identifier } = req.body;
    const user = await User.findOne({ 
      $or: [{ phone: identifier }, { email: identifier }]
    });

    if (!user) return res.status(404).json({ message: 'No se encontró usuario con ese dato' });

    res.json({ message: 'Solicitud de restablecimiento enviada. Revisa tu correo o número.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Agregar amigo
exports.addFriend = async (req, res) => {
  try {
    const currentUser = req.user;
    const targetUser  = await User.findById(req.params.id);

    if (!targetUser) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (!targetUser.followers.includes(currentUser._id)) {
      targetUser.followers.push(currentUser._id);
      currentUser.followers.push(targetUser._id);
      await targetUser.save();
      await currentUser.save();
      return res.json({ message: `Ahora eres amigo de ${targetUser.username}` });
    }

    res.status(400).json({ message: 'Ya eres amigo de este usuario' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar amigo
exports.removeFriend = async (req, res) => {
  try {
    const currentUser = req.user;
    const targetUser  = await User.findById(req.params.id);

    if (!targetUser) return res.status(404).json({ message: 'Usuario no encontrado' });

    targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUser._id.toString());
    currentUser.followers = currentUser.followers.filter(id => id.toString() !== targetUser._id.toString());

    await targetUser.save();
    await currentUser.save();
    
    res.json({ message: `Has eliminado a ${targetUser.username} de tus amigos` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
