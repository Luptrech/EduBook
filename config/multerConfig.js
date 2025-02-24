const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;  // Versión asíncrona para evitar bloqueos del hilo principal

// Función para crear carpetas si no existen
async function createDirectoryIfNotExists(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true }); // `recursive: true` evita errores si ya existe
  } catch (error) {
    console.error(`Error al crear la carpeta ${dirPath}:`, error);
  }
}

// Configuración dinámica de almacenamiento con validación de usuario
const storageConfig = (type) => multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      if (!req?.user?._id) {
        return cb(new Error('Usuario no autenticado'), null);
      }
      const userId = req.user._id.toString();
      const uploadPath = path.join(__dirname, 'uploads', userId, type);
      await createDirectoryIfNotExists(uploadPath);
      cb(null, uploadPath);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    try {
      if (!req?.user?.username) {
        return cb(new Error('Usuario no autenticado'), null);
      }
      const extname = path.extname(file.originalname);
      const sanitizedUsername = req.user.username.replace(/[^a-zA-Z0-9-_]/g, ''); // Eliminar caracteres no válidos
      const filename = `${sanitizedUsername}_${Date.now()}${extname}`;
      cb(null, filename);
    } catch (error) {
      cb(error, null);
    }
  }
});

// Configuración general de multer con filtros de tipo
const configureUpload = (type, allowedTypes) => multer({
  storage: storageConfig(type),
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // Límite de 10MB por archivo
});

// Definir uploaders con validaciones
const uploadImage = configureUpload('posts', ['image/jpeg', 'image/png', 'image/jpg']);
const uploadDocument = configureUpload('documents', [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
]);

module.exports = { uploadImage, uploadDocument };
