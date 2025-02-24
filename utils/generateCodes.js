// backend/utils/generateCodes.js
function generateUserFolderCode(username) {
  // Toma las dos primeras letras del nombre de usuario (en mayúsculas)
  const letters = username.substring(0, 2).toUpperCase();
  // Genera un número aleatorio de 6 dígitos
  const number = Math.floor(100000 + Math.random() * 900000);
  return letters + number;
}

function generateRandomFileName(length = 10) {
  // Genera un número aleatorio de "length" dígitos y lo convierte a string
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

module.exports = { generateUserFolderCode, generateRandomFileName };
