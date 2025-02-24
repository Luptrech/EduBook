const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    // Intenta obtener el token del encabezado Authorization o de las cookies
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    // Verifica el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Acceso denegado. Token inválido.' });
    }

    // Buscar al usuario en la base de datos (solo verificar existencia, sin cargar todo el usuario)
    const userExists = await User.exists({ _id: decoded.id });
    if (!userExists) {
      return res.status(401).json({ message: 'Acceso denegado. Usuario no encontrado.' });
    }

    // Almacenar solo el ID del usuario en `req.userId`
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(401).json({ message: 'Acceso denegado. Token inválido o expirado.' });
  }
};

module.exports = authenticate;
