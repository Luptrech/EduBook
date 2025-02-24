require("dotenv").config();
const fs = require("fs");
const https = require("https");
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

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

// Conectar a MongoDB
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://mongo:rgvhOfNwzoHKMhRlGdLVyGdHQaqmyMur@centerbeam.proxy.rlwy.net:47227/EduBook";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("🔗 Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

// Rutas
app.use("/api/users", require("./routes/users"));
app.use("/api/posts", require("./routes/posts"));

// Cargar certificados SSL (si existen)
let server;
const PORT_HTTPS = 443;
const PORT_HTTP = 80;

try {
  const options = {
    key: fs.readFileSync("./certs/key.pem"), // Ruta de la clave privada
    cert: fs.readFileSync("./certs/cert.pem"), // Ruta del certificado SSL
  };

  server = https.createServer(options, app);
  console.log("🔐 Servidor con HTTPS activado");
} catch (error) {
  console.warn("⚠️ No se encontraron certificados SSL. Usando HTTP en su lugar.");
  server = http.createServer(app);
}

// Iniciar servidor
server.listen(PORT_HTTPS, () => {
  console.log(`🚀 Servidor corriendo en HTTPS en el puerto ${PORT_HTTPS}`);
}).on("error", () => {
  console.log(`🌐 Servidor corriendo en HTTP en el puerto ${PORT_HTTP}`);
  app.listen(PORT_HTTP);
});
