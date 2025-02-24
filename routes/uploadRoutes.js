const express = require('express');
const multer = require('multer');
const router = express.Router();

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'Archivo subido correctamente', file: req.file });
});

module.exports = router;
