const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Función para crear las carpetas si no existen
function createDirectoryIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Configuración de multer para las imágenes de las publicaciones
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user._id;  // ID del usuario logueado
    const uploadPath = path.join(__dirname, 'uploads', userId.toString(), 'posts');
    createDirectoryIfNotExists(uploadPath);  // Crear la carpeta si no existe
    cb(null, uploadPath);  // Define la carpeta de destino
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);  // Extensión del archivo
    const filename = `${req.user.username}_${Date.now()}${extname}`;
    cb(null, filename);  // Nombre final del archivo
  }
});

// Configuración para aceptar solo imágenes
const uploadImage = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'));
    }
  }
});

// Configuración de multer para otros archivos (por ejemplo, documentos)
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user._id;  // ID del usuario logueado
    const uploadPath = path.join(__dirname, 'uploads', userId.toString(), 'documents');
    createDirectoryIfNotExists(uploadPath);  // Crear la carpeta si no existe
    cb(null, uploadPath);  // Define la carpeta de destino
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);  // Extensión del archivo
    const filename = `${req.user.username}_${Date.now()}${extname}`;
    cb(null, filename);  // Nombre final del archivo
  }
});

// Configuración para aceptar todos los tipos de archivo
const uploadDocument = multer({
  storage: documentStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Archivo no permitido'));
    }
  }
});

module.exports = { uploadImage, uploadDocument };
