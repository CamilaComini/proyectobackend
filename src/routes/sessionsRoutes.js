const express = require('express');
const router = express.Router();
const { currentUser } = require('../controllers/sessionsController');

// Ruta para obtener el usuario actual
router.get('/current', currentUser);

module.exports = router;