const express = require('express');
const AuthService = require('../services/authService');
const { login, currentUser } = require('../controllers/authController');

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const user = await AuthService.registerUser(req.body);
    res.status(201).json({ status: 'success', user });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

// Login de usuario (usando el controlador separado)
router.post('/login', login);
router.get('/current', currentUser); // Ruta protegida con JWT y Passport

module.exports = router;