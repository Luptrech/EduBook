// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, iforgot, followUser } = require('../controllers/userController');
const passport = require('passport');

// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

// Ruta para obtener el perfil del usuario autenticado
router.get('/profile', passport.authenticate('jwt', { session: false }), getProfile);

// Ruta para solicitar restablecimiento de contraseña
router.post('/iforgot', iforgot);

// Ruta para seguir a otro usuario
router.post('/follow/:id', passport.authenticate('jwt', { session: false }), followUser);

// Manejo de errores para las rutas
router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

module.exports = router;
