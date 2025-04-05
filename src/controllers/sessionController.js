const passport = require('passport');

// Función para obtener el usuario logueado
const currentUser = (req, res, next) => {
  passport.authenticate('current', { session: false }, (error, user, info) => {
    if (error) {
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    if (!user) {
      return res.status(401).json({ message: 'No estás logueado o tu sesión ha expirado.' });
    }
    return res.json(user); // Devolver los datos del usuario
  })(req, res, next); // Ejecutamos la autenticación
};

module.exports = { currentUser };