const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const bcrypt = require('bcrypt');

// Configuración de la estrategia local para el login (utilizando email como campo de usuario)
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'Correo o contraseña incorrectos' });
      }

      // Compara las contraseñas (usando bcrypt)
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Correo o contraseña incorrectos' });
      }

      return done(null, user); // El login es exitoso
    } catch (error) {
      return done(error);
    }
  })
);

// Configuración para serializar y deserializar al usuario
passport.serializeUser((user, done) => {
  done(null, user.id); // Serializamos el ID del usuario
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Estrategia de JWT para proteger rutas
passport.use(
  new jwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'adur rnat fqsq nnki', 
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload.id);
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }
        return done(null, user); // El JWT es válido, devolvemos el usuario
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Estrategia para obtener el usuario actual a partir del JWT
passport.use(
  'current',
  new jwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'adur rnat fqsq nnki', 
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload.id);
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }
        return done(null, user); // El usuario es válido, devolvemos los datos
      } catch (error) {
        return done(error);
      }
    }
  )
);

module.exports = passport;