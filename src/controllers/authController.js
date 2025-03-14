const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Función para generar un JWT
const generateToken = (user) => {
  return jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' }); // Token válido por 1 hora
};

// Función para login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Verificar la contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Generar el token JWT
    const token = generateToken(user);

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { login };
