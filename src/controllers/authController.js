import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Función para generar un JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'adur rnat fqsq nnki', {
    expiresIn: '1h',
  });
};

// Login de usuario
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
    }

    const token = generateToken(user);

    // Enviar token como cookie + datos del usuario
    res.cookie('token', token, { httpOnly: true }).json({
      status: 'success',
      message: 'Inicio de sesión exitoso',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener usuario actual desde token
export const currentUser = (req, res, next) => {
  passport.authenticate('current', { session: false }, (error, user, info) => {
    if (error) {
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    if (!user) {
      return res.status(401).json({ message: 'No estás logueado o tu sesión ha expirado.' });
    }
    return res.json({
      id: user._id,
      email: user.email,
      role: user.role,
    });
  })(req, res, next);
};