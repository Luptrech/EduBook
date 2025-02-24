const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Asegúrate de tener un modelo User

const authenticate = async (req, res, next) => {
  try {
    // Obtén el token del encabezado de autorización (Authorization Bearer token)
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. No se encontró el token' });
    }

    // Verifica y decodifica el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Asegúrate de tener esta clave en tu .env

    // Busca al usuario en la base de datos usando el ID decodificado del token
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(401).json({ message: 'Acceso denegado. Usuario no encontrado' });
    }

    // Si todo está bien, agrega el usuario a la solicitud
    req.user = user;
    next();  // Llama al siguiente middleware o controlador
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Acceso denegado. Token inválido' });
  }
};

module.exports = authenticate;
