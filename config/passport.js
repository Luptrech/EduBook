// backend/config/passport.js
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
require('dotenv').config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

if (!opts.secretOrKey) {
  console.error("❌ Error: JWT_SECRET no está definido en las variables de entorno.");
  process.exit(1); // Detiene la ejecución si falta la clave secreta
}

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        console.error("❌ Error en la autenticación JWT:", error);
        return done(error, false);
      }
    })
  );
};
