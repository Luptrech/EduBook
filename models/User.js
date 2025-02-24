const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Nombre de usuario único
  password: { type: String, required: true }, // Contraseña encriptada
  emailOrPhone: { type: String, required: true, unique: true }, // Puede ser correo o número de teléfono
  bio: { type: String, default: "" }, // Descripción del usuario
  profileImage: { type: String, default: "" }, // Foto de perfil
  coverImage: { type: String, default: "" }, // Foto de portada
  authorized: { type: Boolean, default: true }, // Indica si el usuario está activo
  folderCode: { type: String, default: null }, // Código de carpeta (si se usa)
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Lista de amigos
  notifications: { type: Array, default: [] }, // Notificaciones recibidas
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], // Mensajes con otros usuarios
}, { timestamps: true }); // Agrega fechas de creación y actualización automáticamente

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
