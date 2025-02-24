require('dotenv').config();
const fs = require('fs');
const https = require('https');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware de seguridad
app.use(cors());
app.use(helmet());
app.use(express.json());

// Límite de peticiones (protección contra ataques de fuerza bruta)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo de 100 solicitudes por IP
  message: "Demasiadas solicitudes, intenta más tarde.",
});
app.use(limiter);

// Conectar a MongoDB (Asegúrate de que tu base de datos está corriendo)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('🔗 Conectado a MongoDB'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Rutas
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));

// Cargar certificados SSL


// Iniciar servidor HTTPS en el puerto 443 (predeterminado para HTTPS)
const PORT = 443;
https.createServer(options, app).listen(PORT, () => {
  console.log(`🚀 Servidor seguro en https://192.168.110.28`);
});
